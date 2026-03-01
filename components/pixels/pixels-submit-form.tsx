"use client";

import {
  useRef,
  useState,
  useEffect,
  useActionState,
  FormEvent,
  startTransition,
} from "react";
import { Loader2Icon, SparklesIcon } from "lucide-react";

import { pixelSchema } from "@/lib/pixels/pixel-schema";
import {
  formDataToObject,
  getImageDimensions,
  compressImage,
} from "@/lib/pixels/pixel-helpers";
import { FormState } from "@/types";
import { addPixelAction, getCategories } from "@/lib/pixels/pixel-actions";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { STATIC_CATEGORIES } from "@/lib/pixels/pixel-categories";

type Category = {
  id: number;
  name: string;
  slug: string | null;
  icon: string | null;
  color: string | null;
};

const initialState: FormState = {
  success: false,
  errors: undefined,
  message: "",
};

export const PixelsSubmitForm = () => {
  const [state, formAction, isPending] = useActionState(
    addPixelAction,
    initialState,
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientErrors, setClientErrors] = useState<Record<string, string[]>>(
    {},
  );
  const [categories] = useState<Category[]>(STATIC_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const { errors: serverErrors, message, success } = state;
  const formRef = useRef<HTMLFormElement>(null);

  const getFieldErrors = (field: string): string[] =>
    clientErrors[field] ??
    (serverErrors as Record<string, string[]>)?.[field] ??
    [];

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const formData = new FormData(e.currentTarget);
      const raw = formDataToObject(formData);

      const parsed = pixelSchema.safeParse(raw);

      if (!parsed.success) {
        setClientErrors(parsed.error.flatten().fieldErrors);
        return;
      }

      const { width, height } = await getImageDimensions(parsed.data.file);

      if (width > 512 || height > 512) {
        setClientErrors({ file: ["Image must be max 512x512 pixels"] });
        return;
      }

      const compressedFile = await compressImage(parsed.data.file, 512);
      formData.set("file", compressedFile);

      setClientErrors({});
      startTransition(() => {
        formAction(formData);
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const clearFieldError = (field: string) => {
    setClientErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  useEffect(() => {
    if (success) {
      formRef.current?.reset();
      setSelectedCategory(categories[0]?.id.toString() || "");
    }
  }, [success, categories]);

  return (
    <Card className="max-w-1/2">
      <CardHeader>
        <CardTitle>Submit Pixel</CardTitle>
        <CardDescription>Submit your Pixel</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-6 mt-8"
          ref={formRef}
          onSubmit={handleSubmit}
          noValidate
        >
          {message && (
            <div
              className={cn(
                "p-4 rounded-lg border",
                success
                  ? "bg-primary/10 border-primary text-primary"
                  : "bg-destructive/10 border-destructive text-destructive",
              )}
              role="alert"
              aria-live="polite"
            >
              {message}
            </div>
          )}
          <FormField
            label="Pixel Name"
            name="name"
            id="name"
            placeholder="Pixel Name"
            required
            onChange={() => clearFieldError("name")}
            error={getFieldErrors("name")}
          />
          <div className="space-y-2 mb-8">
            <Label htmlFor="categoryId">Category</Label>
            <Select
              name="categoryId"
              value={selectedCategory}
              onValueChange={setSelectedCategory}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Categories</SelectLabel>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            {getFieldErrors("categoryId").length > 0 && (
              <p className="text-sm text-destructive">
                {getFieldErrors("categoryId")[0]}
              </p>
            )}
          </div>

          <FormField
            label="Choose Pixel"
            name="file"
            id="file"
            type="file"
            placeholder="Choose Pixel"
            required
            onChange={() => clearFieldError("file")}
            error={getFieldErrors("file")}
          />
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isPending || isProcessing}
          >
            {isPending ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <>
                <SparklesIcon className="size-4" />
                Submit Pixel{" "}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
