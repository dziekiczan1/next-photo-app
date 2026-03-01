export function formDataToObject(formData: FormData) {
  const obj: Record<string, unknown> = {};

  formData.forEach((value, key) => {
    obj[key] = value;
  });

  return obj;
}

export async function getImageDimensions(file: File): Promise<{
  width: number;
  height: number;
}> {
  const imageBitmap = await createImageBitmap(file);
  return {
    width: imageBitmap.width,
    height: imageBitmap.height,
  };
}

export async function compressImage(file: File, maxSize = 512): Promise<File> {
  const bitmap = await createImageBitmap(file);

  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));

  const width = Math.floor(bitmap.width * scale);
  const height = Math.floor(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  ctx.drawImage(bitmap, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", 0.9),
  );

  if (!blob) throw new Error("Compression failed");

  return new File([blob], file.name.replace(/\.\w+$/, ".webp"), {
    type: "image/webp",
  });
}
