import { z } from "zod";

export const PostDtoSchema = z.object({
    id: z.number(),
    text: z.string(),
    likedByMe: z.boolean(),
    bookmarkedByMe: z.boolean(),
    likes: z.number(),
    comments: z.number(),
    createdAt: z.date(),
    imageUrls: z.array(z.object({ fileId: z.string(), url: z.string() })).optional()
})

export type PostDto = z.infer<typeof PostDtoSchema>;