import { prisma } from '@/lib/prisma'
import { ApiError } from '@/utils/errors'

export class QuestionService {
  static async createQuestion(
    quizId: string,
    userId: string,
    questionText: string,
    options: string[],
    correctOptionIndex: number
  ) {
    // Verify quiz ownership
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
    })

    if (!quiz) {
      throw new ApiError(404, 'Quiz non trouvé', 'NOT_FOUND')
    }

    if (quiz.userId !== userId) {
      throw new ApiError(403, "Vous n'avez pas le droit d'ajouter des questions à ce quiz", 'FORBIDDEN')
    }

    // Get max order index
    const lastQuestion = await prisma.question.findFirst({
      where: { quizId },
      orderBy: { orderIndex: 'desc' },
    })

    const orderIndex = (lastQuestion?.orderIndex || -1) + 1

    const question = await prisma.question.create({
      data: {
        quizId,
        questionText,
        options: JSON.stringify(options),
        correctOptionIndex,
        orderIndex,
      },
    })

    return {
      id: question.id,
      quiz_id: question.quizId,
      question_text: question.questionText,
      options: JSON.parse(question.options),
      correct_option_index: question.correctOptionIndex,
      order_index: question.orderIndex,
    }
  }

  static async updateQuestion(
    questionId: string,
    userId: string,
    questionText?: string,
    options?: string[],
    correctOptionIndex?: number
  ) {
    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: { quiz: true },
    })

    if (!question) {
      throw new ApiError(404, 'Question non trouvée', 'NOT_FOUND')
    }

    if (question.quiz.userId !== userId) {
      throw new ApiError(403, "Vous n'avez pas le droit de modifier cette question", 'FORBIDDEN')
    }

    const updated = await prisma.question.update({
      where: { id: questionId },
      data: {
        ...(questionText && { questionText }),
        ...(options && { options: JSON.stringify(options) }),
        ...(correctOptionIndex !== undefined && { correctOptionIndex }),
      },
    })

    return {
      id: updated.id,
      question_text: updated.questionText,
      options: JSON.parse(updated.options),
      correct_option_index: updated.correctOptionIndex,
    }
  }

  static async deleteQuestion(questionId: string, userId: string) {
    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: { quiz: true },
    })

    if (!question) {
      throw new ApiError(404, 'Question non trouvée', 'NOT_FOUND')
    }

    if (question.quiz.userId !== userId) {
      throw new ApiError(403, "Vous n'avez pas le droit de supprimer cette question", 'FORBIDDEN')
    }

    await prisma.question.delete({
      where: { id: questionId },
    })

    return { message: 'Question supprimée avec succès' }
  }
}
