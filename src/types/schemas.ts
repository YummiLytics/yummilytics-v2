import { z } from "zod";

export const CompanySchema = z.object({
  id: z.number().nullable(),
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

export const UserSchema = z.object({
  id: z.number(),
  clerkId: z.string(),
  companyId: z.number().optional(),
})

export const LocationSchema = z.object({
  id: z.number(),
  companyId: z.number(),
  nickname: z.string(),
  buildingNumber: z.string(),
  street: z.string(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
  index: z.string(),
  zipGroupId: z.number(),
  customGroupId: z.number(),
  categoryId: z.number(),
  segmentId: z.number(),
  startDate: z.date()
})
