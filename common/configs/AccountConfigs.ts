export const EmailAccountExample = {
  host: "smtp.gmail.com",
  port: "465",
  user: "username",
  pass: "passwd",
  from: "example@gmail.com",
};
export const EmailMessageExample = {
  title: "title",
  content: "content",
};
export const SendChannelConfig = {
  email: {
    accountTEmpalte: EmailAccountExample,
    messageTemplate: EmailMessageExample,
    id: 40,
  },
};
