import mongoose, { Document, Schema, Types } from "mongoose";

const status = ["Pending", "Success", "Rejected"] as const;
export const statusKlaim = {
  Pending: "Pending",
  Success: "Success",
  Rejeted: "Rejected",
};
interface klaimT extends Document {
  photo: string;
  status: string;
  deskripsiBarang: string;
  klaimBy: Types.ObjectId;
  idLaporan: Types.ObjectId;
}

const klaimSchema = new Schema<klaimT>(
  {
    photo: { type: String, required: true },
    deskripsiBarang: { type: String, required: true },
    klaimBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    idLaporan: { type: Schema.Types.ObjectId, ref: "Lapor", required: true },
    status: {
      type: String,
      enum: status,
      default: statusKlaim.Pending,
    },
  },
  { timestamps: true },
);

const Klaim = mongoose.model<klaimT>("Klaim", klaimSchema);

export default Klaim;
