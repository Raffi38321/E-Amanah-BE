import mongoose, { Document, Schema } from "mongoose";
import Roles from "../utils/Role";

const roles = ["Admin", "Mahasiswa"] as const;
type Role = (typeof roles)[number];
interface UserT extends Document {
  name: string;
  role: Role;
  password: string;
  email: string;
  photo?: string | null;
  NIM: number;
}

const userSchema = new Schema<UserT>(
  {
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: roles,
      default: Roles.Mahasiswa,
    },
    photo: {
      type: String,
      default: null,
    },
    NIM: { type: Number, unique: true },
  },
  { timestamps: true },
);

const User = mongoose.model<UserT>("User", userSchema);

export default User;
