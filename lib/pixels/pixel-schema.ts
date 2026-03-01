import z from "zod";

export const pixelSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must be at most 100 characters"),

  file: z
    .instanceof(File, { message: "File is required" })
    .refine((file) => file.size > 0, "File is required")
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "File must be less than 5MB",
    )
    .refine(
      (file) =>
        ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(
          file.type,
        ),
      "",
    ),
});

export const fileSchema = z
  .instanceof(File, { message: "File is required" })
  .refine((f) => f.size > 0, "File is required")
  .refine((f) => f.size <= 5 * 1024 * 1024, "File must be less than 5MB")
  .refine(
    (f) =>
      ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(f.type),
    "Allowed file types: JPEG, PNG, GIF, WEBP",
  );
