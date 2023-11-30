import { z } from 'zod';

export const CreateCommentDtoSchema = z.object({
    text: z.string(),
})

export type CreateCommentDto = z.infer<typeof CreateCommentDtoSchema>;

export const EditCommentDtoSchema = z.object({
    text: z.string().optional(),
})

export type EditCommentDto = z.infer<typeof EditCommentDtoSchema>;
