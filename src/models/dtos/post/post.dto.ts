import { z } from "zod";

export const PostDtoSchema = z.object({
    id: z.number(),
    text: z.string(),
    likedByMe: z.boolean()
})

export type PostDto = z.infer<typeof PostDtoSchema>;