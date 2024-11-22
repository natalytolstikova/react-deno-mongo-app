import { categories } from "../mongo.ts";
import { ObjectId } from "npm:mongodb@6.1.0";

const getCategories = async (): Promise<Response> => {
  try {
    const allCategories = await categories.find().toArray();
    return new Response(JSON.stringify(allCategories), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

const addCategory = async (req: Request): Promise<Response> => {
  try {
    const body = await req.json();
    const result = await categories.insertOne(body);
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

const updateCategory = async (id: string, req: Request): Promise<Response> => {
  try {
    const body = await req.json();
    const result = await categories.updateOne(
      { _id: new ObjectId(id) },
      { $push: body },
    );

    if (result.matchedCount === 0) {
      return new Response(JSON.stringify({ error: "Category not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
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

export { getCategories, addCategory, updateCategory };
