import type { z } from "zod";
import type { CompanySchema } from "./schemas";

export type CompanyType = z.infer<typeof CompanySchema>

