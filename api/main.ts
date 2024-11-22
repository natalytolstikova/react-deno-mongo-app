import {
  addCategory,
  getCategories,
  updateCategory,
} from "./controllers/categoriesController.ts";
import {
  addProduct,
  getProducts,
  updateProduct,
} from "./controllers/productsController.ts";

const PORT = 8000;

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);

  const path = url.pathname;

  if (req.method === "GET" && path === "/") {
    return new Response("Hello World!");
  } else if (req.method === "GET" && path === "/api/categories") {
    return await getCategories();
  } else if (req.method === "POST" && path === "/api/categories") {
    return await addCategory(req);
  } else if (req.method === "PUT" && path.startsWith("/api/categories")) {
    const id = path.split("/")[3];
    return await updateCategory(id, req);
  } else if (req.method === "PUT" && path.startsWith("/api/products")) {
    const id = path.split("/")[3];
    return await updateProduct(id, req);
  } else if (req.method === "GET" && path === "/api/products") {
    return await getProducts();
  } else if (req.method === "POST" && path === "/api/products") {
    return await addProduct(req);
  } else {
    return new Response("Not Found", { status: 404 });
  }
}

console.log(`HTTP webserver running. Access it at: http://localhost:${PORT}/`);
Deno.serve({ port: PORT }, handler);
