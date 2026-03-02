import { z } from "zod";

export const NewSeriesSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: "Title must be at least 2 characters.",
    })
    .max(100, {
      message: "Title must be at most 100 characters.",
    }),
  language: z.enum(["english"]),
  rating: z.enum(["teens", "adults"]),
  description: z
    .string()
    .min(5, {
      message: "Description must be at least 5 characters.",
    })
    .max(500, {
      message: "Description must be at most 500 characters.",
    }),
  genre: z.array,
});

export const comicSeriesSchema = z.object({
  title: z
    .string()
    .min(1, "Series title is required")
    .max(100, "Series title must be less than 100 characters"),

  language: z.string().min(1, "Language is required"),

  contentRating: z.string().min(1, "Content rating is required"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must be less than 2000 characters"),

  genres: z
    .array(z.string())
    .min(1, "At least one genre is required")
    .max(5, "Maximum 5 genres allowed"),

  tags: z
    .array(z.string())
    .refine(
      (tags) => tags.every((tag) => tag.length >= 2 && tag.length <= 30),
      "Each tag must be between 2 and 30 characters",
    ),

  coverImage: z
    .string({ message: "Cover image must be a string URL." })
    .url({ message: "Invalid URL format." }),
});

export type ComicSeriesFormData = z.infer<typeof comicSeriesSchema>;

export const chapterSchema = z
  .object({
    chapterTitle: z
      .string()
      .min(1, "Chapter title is required.")
      .max(100, "Chapter title must be less than 100 characters."),
    chapterNumber: z
      .number()
      .int()
      .min(1, "Chapter number must be at least 1."),
    summary: z.string().optional(),
    chapterPages: z.array(z.any()).nonempty("At least one page is required."),
    chapterType: z.enum(["free", "paid"]),
    price: z.number().optional(),
    scheduledDate: z
      .date()
      .optional()
      .refine(
        (date) => {
          if (!date) return true;

          // Get the start of the current day to ignore time differences
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return date >= today;
        },
        {
          message: "Date cannot be in the past.",
        },
      ),
  })
  .superRefine((data, ctx) => {
    // Check if chapterType is 'paid' and if price is missing or invalid
    if (
      data.chapterType === "paid" &&
      (data.price === undefined || data.price <= 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Price is required for paid chapters and must be a positive number.",
        path: ["price"],
      });
    }
  });

export type ChapterFormData = z.infer<typeof chapterSchema>;

export const nftFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(100, { message: "Name must be at most 100 characters." }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." })
    .max(1000, { message: "Description must be at most 1000 characters." }),
  supply: z.number().min(1, { message: "Supply must be at least 1." }),
  // price: z.number().nonnegative({ message: "Price cannot be negative." }),
  properties: z.array(
    z.object({
      type: z.string().optional(),
      name: z.string().optional(),
    }),
  ),
  tags: z
    .array(z.string())
    .min(1, { message: "Please add at least one tag." })
    .max(10, { message: "You can add up to 10 tags." }),
  coverImage: z
    .string({ message: "Cover image is required." })
    .min(1, { message: "Cover image is required." }),
});

export type NFTFormData = z.infer<typeof nftFormSchema>;
