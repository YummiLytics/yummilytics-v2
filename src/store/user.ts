import { type StateCreator } from "zustand";
import type { RootStore, UserSlice } from "~/store";

function userState(newUserState: Partial<UserSlice>) {
  return (state: RootStore) => ({
    user: {
      ...state.user,
      ...newUserState,
    },
  });
}

export const createUserSlice: StateCreator<RootStore, [], [], UserSlice> = (
  set
) => ({
  id: undefined,
  clerkId: undefined,
  companyId: undefined,
  setState: (userData: Partial<UserSlice>) => set(userState(userData)),
});
