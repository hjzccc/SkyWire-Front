import {
  BasicResultVo,
  ChannelAccount,
  MessageTemplate,
  TraceRecord,
} from "@/types/backendInterface";
import { features } from "process";
import useSWR from "swr";

export const fetcher = (url: string, options: RequestInit) =>
  fetch(url, options).then((res) => res.json());
export const useAppSWR = <T>(
  url: string,
  token?: string,
  options?: RequestInit,
  swrOptions?: Parameters<typeof useSWR<T>>[2]
) => {
  const { data, error, isLoading, mutate } = useSWR<T>(
    token ? `${url}` : null,
    (url) =>
      fetcher(`${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`, {
        ...options,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      } as RequestInit),
    swrOptions
  );
  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
export const appFetch = async <T>(
  url: string,
  token?: string,
  options?: RequestInit
) => {
  if (token) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`,
      {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data: BasicResultVo<T> = await response.json();
    return data;
  } else {
    return null;
  }
};
export const simpleAppFetch = async <T>(url: string, options?: RequestInit) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data: BasicResultVo<T> = await response.json();
  return data;
};
export const useMessageTemplates = (access_token?: string) => {
  const { data, mutate, isLoading } = useAppSWR<
    BasicResultVo<MessageTemplate[]>
  >("/api/messageTemplate/list", access_token);
  return { data: data?.data, mutate, isLoading };
};
export const useAccounts = (access_token?: string) => {
  const { data, mutate, isLoading } = useAppSWR<
    BasicResultVo<ChannelAccount[]>
  >("/api/channelAccount/list", access_token);
  return { data: data?.data, mutate, isLoading };
};

export const useTraceInfo = (access_token?: string) => {
  const { data } = useAppSWR<BasicResultVo<string[]>>(
    "/api/trace",
    access_token,
    {},
    {
      dedupingInterval: 60 * 1000,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  const dataRecords: TraceRecord[] | undefined = data?.data?.map((record) =>
    JSON.parse(record)
  );
  const simpleTraceRecord = dataRecords?.reduce<
    Record<
      string,
      {
        id: string;
        logTimeStamp: number;
        state: TraceRecord["state"][];
        contentModel: string;
        receiver: string[];
        messageTemplateId: number;
        sendAccountId: number;
      }
    >
  >((arr, record) => {
    if (!arr[record.simpleTaskInfo.messageId]) {
      arr[record.simpleTaskInfo.messageId] = {
        id: record.simpleTaskInfo.messageId,
        logTimeStamp: record.logTimestamp,
        state: [record.state],
        contentModel: record.simpleTaskInfo.contentModel,
        receiver: record.simpleTaskInfo.receiver,
        messageTemplateId: record.simpleTaskInfo.messageTemplateId,
        sendAccountId: record.simpleTaskInfo.sendAccountId,
      };
    } else {
      arr[record.simpleTaskInfo.messageId].state.push(record.state);
    }
    return arr;
  }, {});
  console.log(simpleTraceRecord);
  const simpleRecordList = Object.entries(simpleTraceRecord ?? {}).map(
    ([name, record]) => record
  );
  return { data: simpleRecordList };
};
