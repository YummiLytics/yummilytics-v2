import { type ComponentType } from "react";
import type { Category, Company, Segment, User } from "@prisma/client";
import type { SetupPage } from "./enums";

export type SetupFormPage<P = NonNullable<unknown>> = ComponentType<
  {
    setCurrentPage: (page: SetupPage) => void;
    user: User | null | undefined;
  } & P
>;

export type Must<T> = {
  [P in keyof T]-?: NonNullable<T[P]>
}

export type FullUser = User & {
  company: FullCompany | null;
  locations: (Location | null)[]
};

export type FullCompany = Company & {
  user: User | null;
  locations: (Location | null)[]
}

export type FullSegment = Segment & {
  categories: (Category | null)[]
}

