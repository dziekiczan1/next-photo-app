"use server";

import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { uploadToOci } from "@/lib/oci-client";
import { formDataToObject } from "@/lib/pixels/pixel-helpers";
import { pixelSchema } from "@/lib/pixels/pixel-schema";
import { FormState } from "@/types";

type ValidationError = Record<string, string[]>;

interface ActionError {
  success: false;
  message: string;
  errors?: ValidationError;
}

interface ActionSuccess {
  success: true;
  message: string;
  errors?: never;
}

type ActionResult = ActionError | ActionSuccess;

async function validateAuth(): Promise<string> {
  const { userId } = await auth();
  if (!userId) throw new Error("You must be logged in to perform this action.");
  return userId;
}

function validateFile(file: File | null): asserts file is File {
  if (!file || file.size === 0) {
    throw new Error("File is required.");
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("File must be less than 5MB.");
  }
  if (
    !["image/jpeg", "image/png", "image/gif", "image/webp"].includes(file.type)
  ) {
    throw new Error("Allowed file types: JPEG, PNG, GIF, WEBP.");
  }
}

async function validateFormData(formData: FormData): Promise<{
  name: string;
  categoryId: number;
}> {
  const raw = formDataToObject(formData);

  const validated = pixelSchema.safeParse(raw);
  if (!validated.success) {
    throw new ValidationErrorObject(validated.error.flatten().fieldErrors);
  }

  const categoryIdRaw = formData.get("categoryId")?.toString() ?? "";
  const categoryId = Number(categoryIdRaw);

  if (isNaN(categoryId) || categoryId <= 0) {
    throw new ValidationErrorObject({
      categoryId: ["Category is required."],
    });
  }

  const categoryExists = await prisma.category.findUnique({
    where: { id: categoryId },
    select: { id: true },
  });

  if (!categoryExists) {
    throw new ValidationErrorObject({
      categoryId: ["Category not found."],
    });
  }

  return { name: validated.data.name, categoryId };
}

class ValidationErrorObject extends Error {
  constructor(public errors: ValidationError) {
    super("Validation failed");
  }
}

export const addPixelAction = async (
  prevState: FormState,
  formData: FormData,
): Promise<ActionResult> => {
  try {
    const userId = await validateAuth();

    const file = formData.get("file") as File | null;
    validateFile(file);

    const { name, categoryId } = await validateFormData(formData);

    const buffer = Buffer.from(await file.arrayBuffer());
    const imageUrl = await uploadToOci(
      buffer,
      file.name,
      file.type || "image/webp",
    );

    await prisma.post.create({
      data: {
        userId,
        title: name,
        imagePath: imageUrl,
        categoryId,
      },
    });

    return {
      success: true,
      message: "Pixel was added successfully!",
    };
  } catch (error) {
    console.error("addPixelAction error:", error);

    if (error instanceof ValidationErrorObject) {
      return {
        success: false,
        message:
          "Provided data is invalid. Please correct the errors and try again.",
        errors: error.errors,
      };
    }

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Validation failed. Please correct the errors and try again.",
        errors: error.flatten().fieldErrors,
      };
    }

    return {
      success: false,
      message: "Could not add pixel. Please try again later.",
    };
  }
};

export async function getCategories() {
  try {
    return await prisma.category.findMany({
      orderBy: { order: "asc" },
    });
  } catch (err) {
    console.error("Categories fetch error:", err);
    return [];
  }
}

export async function getPostsByCategoryId(categoryId: number) {
  return prisma.post.findMany({
    where: { categoryId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAllPixels({
  page = 1,
  perPage = 12,
}: {
  page?: number;
  perPage?: number;
} = {}) {
  const skip = (page - 1) * perPage;

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      skip,
      take: perPage,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            clerkId: true,
            firstName: true,
            lastName: true,
            imageUrl: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            color: true,
            slug: true,
          },
        },
      },
    }),

    prisma.post.count(),
  ]);

  return {
    posts,
    pagination: {
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
      hasNext: page * perPage < total,
      hasPrev: page > 1,
    },
  };
}
