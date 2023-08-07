import { BChannelAccount } from "@/types/backendInterface";
import { useAppDispatch, useAppSelector } from ".";
import { addAccountAction, removeAccountAction } from "./store/AccountsStore";

export const useAccountStore = () => {
  const accountsStore = useAppSelector((state) => state.accounts);
  const dispatch = useAppDispatch();
  const addAccount = (account: BChannelAccount) => {
    dispatch(addAccountAction(account));
  };
  const removeAccount = (id: number) => {
    dispatch(removeAccountAction(id));
  };
  return {
    accountsStore,
    addAccount,
    removeAccount,
  };
};
