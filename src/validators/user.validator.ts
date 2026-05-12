import { z } from "zod";
import Roles from "../utils/Role";

export const employeeSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string().min(6, "minimal 6 karakter buat password"),
  role: z.enum([Roles.Admin, Roles.Mahasiswa]).optional(),
  NIM: z.coerce.number().optional(),
});
