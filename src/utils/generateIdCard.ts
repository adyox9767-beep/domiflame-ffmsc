import { toPng } from "html-to-image";

export const generateIdCardImage = async (element: HTMLElement) => {
  if (!element) return null;

  const dataUrl = await toPng(element, {
    quality: 1,
    pixelRatio: 2,
    backgroundColor: "#000",
  });

  return dataUrl;
};