import { z } from "zod";

export const PostDtoSchema = z.object({
    id: z.number(),
    text: z.string(),
    likedByMe: z.boolean(),
    bookmarkedByMe: z.boolean(),
    createdAt: z.date()
})

export type PostDto = z.infer<typeof PostDtoSchema>;