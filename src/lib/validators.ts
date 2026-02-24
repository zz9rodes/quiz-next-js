import { z } from 'zod'

// Auth Validators
export const signupValidator = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit faire au moins 6 caractères'),
  display_name: z.string().min(2, 'Le nom doit faire au moins 2 caractères').max(100),
})

export const loginValidator = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
})

export const updateProfileValidator = z.object({
  display_name: z.string().min(2).max(100).optional(),
  avatar: z.string().url().max(500).optional(),
})

// Quiz Validators
export const createQuizValidator = z.object({
  title: z.string().min(3, 'Le titre doit faire au moins 3 caractères').max(255),
})

export const updateQuizValidator = z.object({
  title: z.string().min(3).max(255).optional(),
})

// Question Validators
export const createQuestionValidator = z.object({
  question_text: z.string().min(5, 'La question doit faire au moins 5 caractères').max(500),
  options: z.array(z.string().min(1).max(200)).length(4, 'Il faut exactement 4 options'),
  correct_option_index: z.number().min(0).max(3, 'Index entre 0 et 3'),
})

export const updateQuestionValidator = z.object({
  question_text: z.string().min(5).max(500).optional(),
  options: z.array(z.string().min(1).max(200)).length(4).optional(),
  correct_option_index: z.number().min(0).max(3).optional(),
})

// Participation Validators
export const participateValidator = z.object({
  participant_name: z.string().min(2, 'Le nom doit faire au moins 2 caractères').max(100),
  answers: z.array(
    z.object({
      question_id: z.string(),
      selected_option_index: z.number().min(0).max(3),
    })
  ),
})

// Message Validators
export const createMessageValidator = z.object({
  content: z.string().min(1, 'Le message ne peut pas être vide').max(1000),
})

export type SignupInput = z.infer<typeof signupValidator>
export type LoginInput = z.infer<typeof loginValidator>
export type UpdateProfileInput = z.infer<typeof updateProfileValidator>
export type CreateQuizInput = z.infer<typeof createQuizValidator>
export type UpdateQuizInput = z.infer<typeof updateQuizValidator>
export type CreateQuestionInput = z.infer<typeof createQuestionValidator>
export type UpdateQuestionInput = z.infer<typeof updateQuestionValidator>
export type ParticipateInput = z.infer<typeof participateValidator>
export type CreateMessageInput = z.infer<typeof createMessageValidator>
