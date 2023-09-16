import type { Company } from "@prisma/client";
import type { FullCompany } from "~/types";

export function getStreetAddress(company: Company | FullCompany): string {
  return `${company.buildingNumber ?? ""} ${company.street ?? ""}`;
}

export function getFullAddress(company: Company | FullCompany): string {
  if (
    company == null ||
    company.buildingNumber == null ||
    company.street == null ||
    company.city == null ||
    company.state == null ||
    company.zip == null
  ) {
    return "Could not get company address...";
  }

  return `${getStreetAddress(company)}, ${company.city ?? ""}, ${
    company.state ?? ""
  } ${company.zip ?? ""}`;
}

export function getPhoneFormatted(company: Company | FullCompany): string {
  if (company == null || company.repPhone == null) {
    return "Could not get phone number..."
  }

  const rawPhone = ((company.repPhone ?? "").match(/\d+/) ?? []).join("");
  return (
    "(" +
    rawPhone.substring(rawPhone.length - 10, rawPhone.length - 7) +
    ") " +
    rawPhone.substring(rawPhone.length - 7, rawPhone.length - 4) +
    "-" +
    rawPhone.substring(rawPhone.length - 4, rawPhone.length)
  );
}
