import { z } from "zod";

export const pengajuanKlaimSchema = z.object({
  deskripsiBarang: z.string(),
});
