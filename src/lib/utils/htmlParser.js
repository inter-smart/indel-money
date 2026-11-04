import parse from "html-react-parser";

export const renderHtml = (htmlString) => {
  return parse(htmlString);
};

export const hasVisibleText = (htmlString) => {
  if (!htmlString) return false;
  return htmlString.replace(/<[^>]*>/g, "").trim().length > 0;
};
