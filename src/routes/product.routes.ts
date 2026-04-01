import { Router } from "express";
import {
  getAllProducts,
  createNewProduct,
  updateExistingProduct,
  deleteExistingProduct,
  getProduct,
  purchaseProduct,
  getAllPurchases,
  getTodayPurchases,      
  getPurchasesByDate,     
} from "../controllers/product.controller";

const router = Router();

// RUTAS ESPECIALES (SIEMPRE ARRIBA)
router.post("/products/purchase", purchaseProduct);

// HISTORIAL
router.get("/products/purchases", getAllPurchases);
router.get("/products/purchases/today", getTodayPurchases);
router.get("/products/purchases/by-date", getPurchasesByDate);

//CRUD
router.get("/products", getAllProducts);
router.get("/products/:id", getProduct);
router.post("/products", createNewProduct);
router.put("/products/:id", updateExistingProduct);
router.delete("/products/:id", deleteExistingProduct);

export default router;