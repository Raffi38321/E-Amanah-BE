import mongoose, { Document, Schema } from "mongoose";
interface LaporBarangT extends Document {
  name: string;
  kategori: string;
  lokasi: string;
  tanggal: Date;
  photo: string;
  deskripsiBarang: string;
}

const laporBarangSchema = new Schema<LaporBarangT>(
  {
    name: { type: String, required: true },
    kategori: { type: String, required: true },
    lokasi: { type: String, required: true },
    tanggal: { type: Date, required: true },
    photo: { type: String, required: true },
    deskripsiBarang: { type: String, required: true },
  },
  { timestamps: true },
);

const LaporBarang = mongoose.model<LaporBarangT>("Product", laporBarangSchema);

export default LaporBarang;
