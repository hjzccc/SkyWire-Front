import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./AccountsStore";
import messageTemplateReducer from "./MessageTemplateStore";
export const store = configureStore({
  reducer: {
    accounts: accountReducer.reducer,
    messageTemplates: messageTemplateReducer.reducer,
  },
});
