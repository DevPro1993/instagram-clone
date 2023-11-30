import { z } from 'zod';

export const LoginUserDtoSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
})

export type LoginUserDto = z.infer<typeof LoginUserDtoSchema>;
