const wildCardPlaceHolderRegex = /\{\$([^\}]+)\}/g;
export const getPlaceHolders = (text: string): string[] | null => {
  let match = text.matchAll(wildCardPlaceHolderRegex);
  let result = Array.from(match, (m) => m[1]);
  return result;
};
export const replacePlaceHolders = (
  parameters: Record<string, string>,
  text: string
): string => {
  return text.replace(wildCardPlaceHolderRegex, (match, key) => {
    return parameters[key] || match;
  });
};
