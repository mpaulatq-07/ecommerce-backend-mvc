import { Request, Response } from "express";
import * as ProductService from "../models/product.model";
import * as PurchaseService from "../models/purchase.model";

// Helper de validación
const validateProduct = (name: any, price: any, stock: any) => {
  if (!name || typeof name !== "string") return "Nombre inválido";
  if (typeof price !== "number" || price <= 0) return "Precio inválido";
  if (typeof stock !== "number" || stock < 0) return "Stock inválido";
  return null;
};

// Obtener todos los productos
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await ProductService.getProducts();
    res.json({ success: true, data: products });
  } catch (error: any) {
    console.error("ERROR getAllProducts:", error);
    res.status(500).json({ success: false, message: "Error al obtener productos" });
  }
};

// Obtener producto por ID
export const getProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const product = await ProductService.getProductById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Producto no encontrado" });
    }

    res.json({ success: true, data: product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "ID no válido o error de servidor" });
  }
};

// Crear producto
export const createNewProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, stock } = req.body;

    const errorMsg = validateProduct(name, price, stock);
    if (errorMsg) {
      return res.status(400).json({ success: false, message: errorMsg });
    }

    const newProduct = await ProductService.createProduct({ name, price, stock });

    res.status(201).json({
      success: true,
      message: "Producto creado correctamente",
      data: newProduct,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error al crear producto" });
  }
};

// Actualizar producto
export const updateExistingProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { name, price, stock } = req.body;

    const errorMsg = validateProduct(name, price, stock);
    if (errorMsg) {
      return res.status(400).json({ success: false, message: errorMsg });
    }

    const updatedProduct = await ProductService.updateProduct(id, { name, price, stock });

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Producto no encontrado" });
    }

    res.json({
      success: true,
      message: "Producto actualizado correctamente",
      data: updatedProduct,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error al actualizar producto" });
  }
};

// Eliminar producto
export const deleteExistingProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const deletedProduct = await ProductService.deleteProduct(id);

    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: "Producto no encontrado" });
    }

    res.json({ success: true, message: "Producto eliminado correctamente" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error al eliminar producto" });
  }
};

// COMPRAR PRODUCTO
export const purchaseProduct = async (req: Request, res: Response) => {
  try {
    const { productId, quantity, money } = req.body;

    if (!productId || typeof quantity !== "number" || typeof money !== "number") {
      return res.status(400).json({ success: false, message: "Datos inválidos" });
    }

    const product = await ProductService.getProductById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: "Producto no encontrado" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ success: false, message: "Stock insuficiente" });
    }

    const total = product.price * quantity;

    if (money < total) {
      return res.status(400).json({ success: false, message: "Dinero insuficiente" });
    }

    const change = money - total;

    // Actualizar stock
    await ProductService.updateProduct(productId, { 
      stock: product.stock - quantity 
    });

    // Guardar compra
    const purchase = await PurchaseService.createPurchase({
      productId,
      quantity,
      total,
      money,
      change,
    });

    res.json({
      success: true,
      message: "Compra realizada correctamente",
      data: purchase, // Mongoose ya incluye el cambio si lo guardas en el modelo
    });
  } catch (error: any) {
    console.error("ERROR purchaseProduct:", error);
    res.status(500).json({ success: false, message: "Error al procesar compra" });
  }
};

// HISTORIAL
export const getAllPurchases = async (req: Request, res: Response) => {
  try {
    const data = await PurchaseService.getPurchases();
    res.json({ success: true, total: data.length, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error al obtener compras" });
  }
};