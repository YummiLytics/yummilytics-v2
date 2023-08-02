import type { Company } from "@prisma/client";

export const defaultCompany: Company = {
  id: -1,
  name: null,
  buildingNumber: null,
  street: null,
  city: null,
  state: null,
  zip: null,
  repFirstName: null,
  repLastName: null,
  repPhone: null,
  repEmail: null,
};
