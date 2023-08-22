export interface MessageTemplate {
  id: number;
  sendChannel: number;
  name: string;
  msgContent: string;
  sendAccountId: number;
}
export interface ChannelAccount {
  id: number;
  name: string;
  sendChannel: number;
  accountConfig: string;
}

export interface BasicResultVo<T> {
  status: string;
  msg: string;
  data: T;
}
export interface SendRequest {
  code: string;
  messageTemplateId: number;
  messageParam: Partial<{
    bizId: string;
    receiver: string;
    msgContent: string;
  }>;
}
export interface TraceRecord {
  state: {
    code: number;
    description: string;
  };
  logTimestamp: number;
  simpleTaskInfo: {
    userObj: string;
    messageId: string;
    contentModel: string;
    receiver: string[];
    messageTemplateId: number;
    sendAccountId: number;
  };
}
export interface RegisterRequest {
  username: string;
  password: string;
}
