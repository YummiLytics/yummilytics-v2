import { create } from "zustand";
import { createUserSlice } from "./store/user";

export type RootStore = {
  user: UserSlice;
};

export type UserSlice = {
  id?: number;
  clerkId?: string;
  companyId?: number;
  setState: (userData: Partial<UserSlice>) => void;
};

export const useYumStore = create<RootStore>()((...params) => ({
  user: { ...createUserSlice(...params) },
}));
