import { z } from 'zod';
import Gender from '../../shared/enums/gender.enum';

export const CreateUserDtoSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    gender: z.enum([Gender.Female, Gender.Male]),
    password: z.string().min(6),
})

export type CreateUserDto = z.infer<typeof CreateUserDtoSchema>;


export const EditUserDtoSchema = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email().optional(),
    gender: z.enum([Gender.Female, Gender.Male]).optional(),
    password: z.string().min(6).optional()
})

export type EditUserDto = z.infer<typeof EditUserDtoSchema>;
