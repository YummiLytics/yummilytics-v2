import { type ComponentType } from "react";
import type { z } from "zod";
import type { UserResource } from "@clerk/types";
import type { User } from "@prisma/client";
import type { CompanySchema } from "./schemas";
import type { SetupPage } from "./enums";

export type SetupFormPage<P = NonNullable<unknown>> = ComponentType<
  {
    setCurrentPage: (page: SetupPage) => void;
    user: UserResource;
    userData: User | null | undefined;
  } & P
>;

export type CompanyType = z.infer<typeof CompanySchema>;
