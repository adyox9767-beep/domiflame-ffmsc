// @ts-ignore
import QRCode from "qrcode";

export const generateQr = async (
  text: string
) => {
  try {
    return await QRCode.toDataURL(text);
  } catch (error) {
    console.error(error);

    return "";
  }
};