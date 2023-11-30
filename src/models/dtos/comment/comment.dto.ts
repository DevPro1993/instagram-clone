import { z } from "zod";

export const CommentDtoSchema = z.object({
    id: z.number(),
    text: z.string(),
    likedByMe: z.boolean()
})

export type CommentDto = z.infer<typeof CommentDtoSchema>;