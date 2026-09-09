// Helper function to generate Cloudinary signature
async function generateCloudinarySignature(
  params: string,
  apiSecret: string,
): Promise<string> {
  const signatureString = params + apiSecret;
  const encoder = new TextEncoder();
  const data = encoder.encode(signatureString);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Helper function to convert File to base64 in chunks (to avoid stack overflow)
async function fileToBase64(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  // Process in chunks to avoid stack overflow
  const chunkSize = 8192;
  let binaryString = "";

  for (let i = 0; i < uint8Array.length; i += chunkSize) {
    const chunk = uint8Array.slice(i, i + chunkSize);
    // Convert chunk to string character by character to avoid stack overflow
    for (let j = 0; j < chunk.length; j++) {
      binaryString += String.fromCharCode(chunk[j]);
    }
  }

  return btoa(binaryString);
}

// Edge Runtime uyumlu Cloudinary client
export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  try {
    // Cloudinary API credentials
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error("Cloudinary credentials not configured");
    }

    console.log(`📤 Uploading image: ${file.name} (${file.size} bytes)`);

    // Generate timestamp and public_id
    const timestamp = Math.floor(Date.now() / 1000);
    // public_id should be just the filename, folder is separate
    const publicId = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const folder = "plug-digital/products";

    // Create signature string (parameters must be alphabetically sorted)
    // IMPORTANT: Do NOT URL encode in signature string! Cloudinary expects raw values
    // Signature includes: folder, public_id, timestamp (NOT file or api_key)
    const signatureParams = [
      `folder=${folder}`, // No encodeURIComponent here!
      `public_id=${publicId}`, // No encodeURIComponent here!
      `timestamp=${timestamp}`,
    ].join("&");

    console.log(`🔐 Signature params: ${signatureParams}`);

    const signature = await generateCloudinarySignature(
      signatureParams,
      apiSecret,
    );

    console.log(`🔑 Generated signature: ${signature}`);

    // Create FormData with File object directly (Cloudinary accepts File objects)
    // Note: In Edge Runtime, FormData can handle File objects
    const formData = new FormData();
    formData.append("file", file); // Send File object directly, not base64
    formData.append("folder", folder);
    formData.append("public_id", publicId);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp.toString());
    formData.append("signature", signature);

    console.log(`🚀 Sending request to Cloudinary: ${cloudName}/image/upload`);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Cloudinary upload error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
      throw new Error(`Upload failed: ${response.status} ${errorText}`);
    }

    const result = (await response.json()) as { secure_url: string };
    console.log(`✅ Image uploaded successfully: ${result.secure_url}`);
    return result.secure_url;
  } catch (error) {
    console.error("❌ Image upload error:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error instanceof Error ? error : new Error("Image upload failed");
  }
};

export const uploadMultipleImagesToCloudinary = async (
  files: File[],
): Promise<string[]> => {
  try {
    if (!files || files.length === 0) {
      console.log("⚠️ No files to upload");
      return [];
    }

    console.log(`📦 Uploading ${files.length} image(s)...`);
    const uploadPromises = files.map((file, index) => {
      console.log(
        `📤 [${index + 1}/${files.length}] Starting upload: ${file.name}`,
      );
      return uploadImageToCloudinary(file);
    });

    const urls = await Promise.all(uploadPromises);
    console.log(`✅ Successfully uploaded ${urls.length} image(s)`);
    return urls;
  } catch (error) {
    console.error("❌ Multiple images upload error:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      fileCount: files?.length || 0,
    });
    throw error instanceof Error
      ? error
      : new Error("Multiple images upload failed");
  }
};
