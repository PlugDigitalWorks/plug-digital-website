import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

export const uploadImage = async (file: File): Promise<string> => {
  try {
    // File'ı ArrayBuffer'a çevir
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Cloudinary'ye yükle
    const result = await cloudinary.uploader.upload(
      `data:${file.type};base64,${buffer.toString("base64")}`,
      {
        folder: "-london",
        resource_type: "auto",
      },
    );

    return result.secure_url;
  } catch (error) {
    console.error("Image upload error:", error);
    throw new Error("Image upload failed");
  }
};

export const uploadMultipleImages = async (
  files: File[],
): Promise<string[]> => {
  try {
    const uploadPromises = files.map((file) => uploadImage(file));
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error("Multiple images upload error:", error);
    throw new Error("Multiple images upload failed");
  }
};
