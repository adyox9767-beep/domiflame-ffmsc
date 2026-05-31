import { supabase } from "@/lib/supabase";

export const uploadToSupabase = async (
  file: File,
  folder: string
) => {
  const ext = file.name.split(".").pop() || "png";

  const filePath = `${folder}_${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from("ffmsc")
    .upload(filePath, file, {
      upsert: true,
      contentType: file.type || "image/png",
    });

  if (error) {
    console.error("Supabase upload error:", error);
    throw new Error(error.message);
  }

  const { data } = supabase.storage
    .from("ffmsc")
    .getPublicUrl(filePath);

  return data.publicUrl;
};