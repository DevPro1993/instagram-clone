import Gender from "../../shared/enums/gender.enum";

import { z } from 'zod';

export const AuthResponseDtoSchema = z.object({
    id: z.number(),
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    gender: z.enum([Gender.Female, Gender.Male]),
    token: z.string(),
    success: z.boolean(),
    message: z.string().optional()
})

export type AuthResponseDto = z.infer<typeof AuthResponseDtoSchema>;
