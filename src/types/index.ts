import { type ComponentType } from "react";
import type { Company, User } from "@prisma/client";
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

export type UserWithRelations = User & {
  company: Company | null;
};

