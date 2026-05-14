import { z } from "zod";
import { status } from "../models/pengajuanKlaim.model";

export const pengajuanKlaimSchema = z.object({
  deskripsiBarang: z.string(),
  idLaporan: z.string(),
});

export const pengajuanKlaimActionSchema = z.object({
  status: z.enum(status),
});
