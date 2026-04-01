import { Schema, model, Document } from 'mongoose';
import { Product } from '../types/product';

// Extendemos la interfaz para que Mongoose reconozca los campos de sistema (_id, createdAt)
interface IProduct extends Omit<Product, '_id' | 'id'>, Document {}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true }
  },
  { timestamps: true, versionKey: false }
);

export const ProductModel = model<IProduct>('Product', productSchema);

// --- FUNCIONES DEL MODELO ---

export const getProducts = async (): Promise<IProduct[]> => {
  return await ProductModel.find();
};

export const getProductById = async (id: string): Promise<IProduct | null> => {
  // findById ya maneja la conversión de string a ObjectId automáticamente
  return await ProductModel.findById(id);
};

export const createProduct = async (productData: Product): Promise<IProduct> => {
  const newProduct = new ProductModel(productData);
  return await newProduct.save();
};

export const updateProduct = async (id: string, productData: Partial<Product>): Promise<IProduct | null> => {
  // Devuelve el objeto ya modificado y no el viejo
  return await ProductModel.findByIdAndUpdate(id, productData, { new: true });
};

export const deleteProduct = async (id: string): Promise<IProduct | null> => {
  return await ProductModel.findByIdAndDelete(id);
};