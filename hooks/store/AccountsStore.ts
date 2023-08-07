import { BChannelAccount } from "@/types/backendInterface";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
const initialState: BChannelAccount[] = [];

const reducer = createSlice({
  name: "accounts",
  initialState,
  reducers: {
    addAccountAction: (state, action: PayloadAction<BChannelAccount>) => {
      state.push(action.payload);
    },
    removeAccountAction: (state, action: PayloadAction<number>) => {
      return state.filter((account) => account.id !== action.payload);
    },
  },
});

export default reducer;
export const { addAccountAction, removeAccountAction } = reducer.actions;
