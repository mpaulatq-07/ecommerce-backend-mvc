import express from "express";
import productRoutes from "./routes/product.routes";
import connectDB from "./config/db"; 

const app = express();

//Conectar a la base de datos
connectDB(); 

app.use(express.json());
app.use("/api", productRoutes);

export default app;