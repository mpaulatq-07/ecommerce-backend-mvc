import { Request, Response } from "express";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
} from "../models/product.model";

import {
  createPurchase,
  getPurchases,
} from "../models/purchase.model";

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
    const products = await getProducts();
    res.json({ success: true, data: products });
  } catch (error: any) {
    console.error("ERROR getAllProducts:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener productos",
    });
  }
};

// Obtener producto por ID
export const getProduct = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id); 

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "ID inválido",
      });
    }

    const product = await getProductById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado",
      });
    }

    res.json({ success: true, data: product });
  } catch (error: any) {
    console.error("ERROR getProduct:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener producto",
    });
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

    const insertId = await createProduct({ name, price, stock });

    res.status(201).json({
      success: true,
      message: "Producto creado correctamente",
      data: { id: insertId, name, price, stock },
    });
  } catch (error: any) {
    console.error("ERROR createNewProduct:", error);
    res.status(500).json({
      success: false,
      message: "Error al crear producto",
    });
  }
};

// Actualizar producto
export const updateExistingProduct = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { name, price, stock } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "ID inválido",
      });
    }

    const errorMsg = validateProduct(name, price, stock);
    if (errorMsg) {
      return res.status(400).json({ success: false, message: errorMsg });
    }

    const existingProduct = await getProductById(id);

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado",
      });
    }

    await updateProduct(id, { name, price, stock });

    res.json({
      success: true,
      message: "Producto actualizado correctamente",
      data: { id, name, price, stock },
    });
  } catch (error: any) {
    console.error("ERROR updateExistingProduct:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar producto",
    });
  }
};

// Eliminar producto
export const deleteExistingProduct = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "ID inválido",
      });
    }

    const existingProduct = await getProductById(id);

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado",
      });
    }

    await deleteProduct(id);

    res.json({
      success: true,
      message: "Producto eliminado correctamente",
    });
  } catch (error: any) {
    console.error("ERROR deleteExistingProduct:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar producto",
    });
  }
};

// PURCHASE PRODUCT
export const purchaseProduct = async (req: Request, res: Response) => {
  try {
    const { productId, quantity, money } = req.body;

    if (
      typeof productId !== "number" ||
      typeof quantity !== "number" ||
      typeof money !== "number"
    ) {
      return res.status(400).json({
        success: false,
        message: "Datos inválidos",
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Cantidad inválida",
      });
    }

    const product = await getProductById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado",
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: "Insuficiencia en el stock",
      });
    }

    const total = product.price * quantity;

    if (money < total) {
      return res.status(400).json({
        success: false,
        message: "Cantidad de dinero incorrecta, dinero insuficuente",
      });
    }

    const change = money - total;

    // Actualizar stock
    const newStock = product.stock - quantity;
    await updateProduct(productId, {
      ...product,
      stock: newStock,
    });

    // Guardar compra
    const purchase = createPurchase({
      productId,
      quantity,
      total,
      money,
      change,
    });

    res.json({
      success: true,
      message: "Compra realizada correctamente",
      data: purchase,
    });
  } catch (error: any) {
    console.error("ERROR purchaseProduct:", error);
    res.status(500).json({
      success: false,
      message: "Error al procesar compra",
    });
  }
};

// HISTORIAL COMPLETO
export const getAllPurchases = (req: Request, res: Response) => {
  try {
    const data = getPurchases();

    res.json({
      success: true,
      total: data.length,
      data,
    });
  } catch (error: any) {
    console.error("ERROR getAllPurchases:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener compras",
    });
  }
};

// COMPRAS DEL DÍA
export const getTodayPurchases = (req: Request, res: Response) => {
  try {
    const purchases = getPurchases();
    const today = new Date();

    const filtered = purchases.filter((p: any) => {
      const d = new Date(p.date);

      return (
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
      );
    });

    res.json({
      success: true,
      total: filtered.length,
      data: filtered,
    });
  } catch (error: any) {
    console.error("ERROR getTodayPurchases:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener compras del día",
    });
  }
};

// COMPRAS POR FECHA
export const getPurchasesByDate = (req: Request, res: Response) => {
  try {
    const { date } = req.query;

    if (!date || typeof date !== "string") {
      return res.status(400).json({
        success: false,
        message: "Debe enviar una fecha válida (YYYY-MM-DD)",
      });
    }

    const purchases = getPurchases();

    const filtered = purchases.filter((p: any) => {
      const purchaseDate = new Date(p.date)
        .toISOString()
        .split("T")[0];

      return purchaseDate === date;
    });

    res.json({
      success: true,
      total: filtered.length,
      data: filtered,
    });
  } catch (error: any) {
    console.error("ERROR getPurchasesByDate:", error);
    res.status(500).json({
      success: false,
      message: "Error al filtrar compras",
    });
  }
};