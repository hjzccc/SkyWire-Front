import { BMessageTemplate } from "@/types/backendInterface";
import { useAppDispatch, useAppSelector } from ".";
import {
  addMessageTemplateAction,
  removeMessageTemplateAction,
} from "./store/MessageTemplateStore";

export const useMessageTemplateStore = () => {
  const messageTemplateStore = useAppSelector(
    (state) => state.messageTemplates
  );
  const dispatch = useAppDispatch();
  const addMessageTemplate = (
    template: Parameters<typeof addMessageTemplateAction>[0]
  ) => {
    dispatch(addMessageTemplateAction(template));
  };
  const removeMessageTemplate = (
    id: Parameters<typeof removeMessageTemplateAction>[0]
  ) => {
    dispatch(removeMessageTemplateAction(id));
  };
  return {
    messageTemplateStore,
    addMessageTemplate,
    removeMessageTemplate,
  };
};
