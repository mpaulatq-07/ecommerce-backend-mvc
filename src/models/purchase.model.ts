import { Schema, model, Document } from 'mongoose';

//Definimos la interfaz para TypeScript
export interface Purchase {
  productId: string; 
  quantity: number;
  total: number;
  money: number;
  change: number;
  date?: Date;
}

//Definimos el Esquema de Mongoose
const purchaseSchema = new Schema<Purchase>({
  productId: { 
    type: String, 
    required: true 
  },
  quantity: { type: Number, required: true },
  total: { type: Number, required: true },
  money: { type: Number, required: true },
  change: { type: Number, required: true },
  date: { type: Date, default: Date.now }
}, { 
  timestamps: true,
  versionKey: false 
});

//Creamos el Modelo
export const PurchaseModel = model<Purchase>('Purchase', purchaseSchema);

// --- FUNCIONES DEL SERVICIO ---

export const createPurchase = async (data: Purchase) => {
  const newPurchase = new PurchaseModel(data);
  return await newPurchase.save();
};

export const getPurchases = async () => {
  return await PurchaseModel.find().sort({ createdAt: -1 }); // Trae las más recientes primero
};