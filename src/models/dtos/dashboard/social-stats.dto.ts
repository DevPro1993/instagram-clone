import { z } from "zod";

export const SocialStatsDtoSchema = z.object({
    followers: z.number(),
    following: z.number(),
    posts: z.number()
})

export type SocialStatsDto = z.infer<typeof SocialStatsDtoSchema>;