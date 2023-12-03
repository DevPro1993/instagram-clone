import { z } from 'zod';

export const CreatePostDtoSchema = z.object({
    text: z.string(),
    imageTitles: z.array(z.object({ fileId: z.string(), url: z.string() })).optional()
})

export type CreatePostDto = z.infer<typeof CreatePostDtoSchema>;

export const EditPostDtoSchema = z.object({
    text: z.string().optional(),
})

export type EditPostDto = z.infer<typeof EditPostDtoSchema>;
