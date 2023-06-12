import { z } from "zod";

export const CompanySchema = z.object({
  id: z.number(),
  name: z.string(),
  buildingNumber: z.string(),
  street: z.string(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
  repFirstName: z.string(),
  repLastName: z.string(),
  repPhone: z.string(),
  repEmail: z.string(),
})

export type CompanySchemaType = z.infer<typeof CompanySchema>
