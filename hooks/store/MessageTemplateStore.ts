import { SendChannelConfig } from "@/common/configs/AccountConfigs";
import { ParameterType } from "@/types";
import { BMessageTemplate, MessageTemplate } from "@/types/backendInterface";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: BMessageTemplate[] = [];

const reduer = createSlice({
  name: "messageTemplate",
  initialState,
  reducers: {
    addMessageTemplateAction: (
      state,
      action: PayloadAction<BMessageTemplate>
    ) => {
      state.push(action.payload);
    },
    removeMessageTemplateAction: (state, action: PayloadAction<number>) => {
      return state.filter(
        (messageTemplate) => messageTemplate.id !== action.payload
      );
    },
  },
});

export default reduer;
export const { addMessageTemplateAction, removeMessageTemplateAction } =
  reduer.actions;
