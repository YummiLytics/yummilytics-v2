import { type ComponentType } from "react";
import type { User } from "@prisma/client";
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
