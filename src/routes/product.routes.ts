import { Router } from "express";
// Importamos todo el controlador
import * as ProductController from "../controllers/product.controller";

const router = Router();

// Asegúrate de que los nombres coincidan con las funciones del controlador
router.get("/", ProductController.getAllProducts);
router.get("/:id", ProductController.getProduct);
router.post("/", ProductController.createNewProduct);
router.put("/:id", ProductController.updateExistingProduct);
router.delete("/:id", ProductController.deleteExistingProduct);

// Rutas de compras (Purchase)
router.post("/purchase", ProductController.purchaseProduct);
router.get("/purchases/all", ProductController.getAllPurchases);

export default router;