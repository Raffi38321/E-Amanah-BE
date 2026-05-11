import { z } from "zod";

export const laporBarangSchema = z.object({
  name: z.string(),
  kategori: z.string(),
  lokasi: z.string(),
  tanggal: z.date(),
  deskripsiBarang: z.string(),
});
