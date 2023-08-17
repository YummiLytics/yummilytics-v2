import type { FullUser, FullCompany } from ".";

export const defaultCompany: FullCompany = {
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
  user: null,
  locations: []
};

export const defaultUser: FullUser = {
  id: -1,
  clerkId: null,
  companyId: null,
  company: defaultCompany,
  locations: []
}
