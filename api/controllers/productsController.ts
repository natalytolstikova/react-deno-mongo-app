import { products, categories } from "../mongo.ts";
import { ObjectId } from "npm:mongodb@6.1.0";

const getProducts = async (): Promise<Response> => {
  try {
    const aggregatedProducts = await products
      .aggregate([
        {
          $lookup: {
            from: "categories",
            localField: "catId",
            foreignField: "id",
            as: "categoryDetails",
          },
        },
        {
          $unwind: "$categoryDetails",
        },
      ])
      .toArray();
    return new Response(JSON.stringify(aggregatedProducts), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

const addProduct = async (req: Request): Promise<Response> => {
  try {
    const body = await req.json();

    const category = await categories.findOne({ id: body.catId });

    if (!category) throw new Error("Category not found");

    for (const prop of category.properties) {
      if (!(prop.name in body.properties)) {
        throw new Error(`Missing property: ${prop.name}`);
      }

      if (typeof body.properties[prop.name] !== prop.type) {
        throw new Error(`Invalid type for property ${prop.name}`);
      }
    }

    const result = await products.insertOne(body);

    return new Response(JSON.stringify({ id: result.insertedId }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
};

const updateProduct = async (id: string, req: Request): Promise<Response> => {
  try {
    const body = await req.json();
    const result = await products.updateMany(
      { catId: body.catId },
      { $set: body.properties },
    );

    if (result.matchedCount === 0) {
      return new Response(
        JSON.stringify({
          error: `Products in category ${body.catId} not found`,
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    return new Response(JSON.stringify({ updated: result.modifiedCount }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export { getProducts, addProduct, updateProduct };
