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
