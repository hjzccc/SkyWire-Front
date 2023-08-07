import {
  BasicResultVo,
  ChannelAccount,
  MessageTemplate,
} from "@/types/backendInterface";
import { features } from "process";
import useSWR from "swr";

export const fetcher = (url: string, options: RequestInit) =>
  fetch(url, options).then((res) => res.json());
export const useAppSWR = <T>(
  url: string,
  token?: string,
  options?: RequestInit
) => {
  const { data, error, isLoading, mutate } = useSWR<T>(
    token ? `${url}` : null,
    (url) =>
      fetcher(`${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`, {
        ...options,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      } as RequestInit)
  );
  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
export const appFetch = async (
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
    const data = await response.json();
    return data;
  } else {
    return null;
  }
};

export const useMessageTempaltes = (access_token?: string) => {
  const { data, mutate } = useAppSWR<BasicResultVo<MessageTemplate[]>>(
    "/api/messageTemplate/list",
    access_token
  );
  return { data: data?.data, mutate };
};
export const useAccounts = (access_token?: string) => {
  const { data, mutate } = useAppSWR<BasicResultVo<ChannelAccount[]>>(
    "/api/channelAccount/list",
    access_token
  );
  return { data: data?.data, mutate };
};
