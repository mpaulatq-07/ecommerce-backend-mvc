import express from "express";
import productRoutes from "./routes/product.routes";

const app = express();

app.use(express.json()); // Permite leer JSON

app.use("/api", productRoutes);

export default app;