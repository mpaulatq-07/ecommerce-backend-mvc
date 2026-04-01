import connection from "../config/db";
import { Product } from "../types/product";
import { RowDataPacket, ResultSetHeader } from "mysql2";

// Obtener todos los productos
export const getProducts = async (): Promise<Product[]> => {
  const [rows] = await connection.query<RowDataPacket[]>(
    "SELECT * FROM products"
  );

  return rows.map((product: any) => ({
    id: product.id,
    name: product.name,
    price: Number(product.price), // conversión
    stock: product.stock,
  }));
};

// Obtener producto por ID
export const getProductById = async (
  id: number
): Promise<Product | null> => {
  const [rows] = await connection.query<RowDataPacket[]>(
    "SELECT * FROM products WHERE id = ?",
    [id]
  );

  const products = rows as any[];

  if (products.length === 0) return null;

  const product = products[0];

  return {
    id: product.id,
    name: product.name,
    price: Number(product.price), //conversión
    stock: product.stock,
  };
};

// Crear producto (devuelve ID)
export const createProduct = async (product: Product): Promise<number> => {
  const { name, price, stock } = product;

  const [result] = await connection.query<ResultSetHeader>(
    "INSERT INTO products (name, price, stock) VALUES (?, ?, ?)",
    [name, price, stock]
  );

  return result.insertId;
};

// Actualizar producto
export const updateProduct = async (id: number, product: Product) => {
  const { name, price, stock } = product;

  await connection.query(
    "UPDATE products SET name = ?, price = ?, stock = ? WHERE id = ?",
    [name, price, stock, id]
  );
};

// Eliminar producto
export const deleteProduct = async (id: number) => {
  await connection.query("DELETE FROM products WHERE id = ?", [id]);
};