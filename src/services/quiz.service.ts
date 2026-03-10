import { prisma } from '@/lib/prisma'
import { ApiError } from '@/utils/errors'

export class QuizService {
  static async getAllQuizzesPaginated(page: number = 1, perPage: number = 8) {
    const skip = (page - 1) * perPage

    const where = { isPublic: true }

    const [quizzes, total] = await Promise.all([
      prisma.quiz.findMany({
        where,
        skip,
        take: perPage,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          user: {
            select: { fullName: true,publicKey:true },
          },
          _count: {
            select: { questions: true },
          },
        },
      }),
      prisma.quiz.count({ where }),
    ])

    return {
      quizzes: quizzes.map((q) => ({
        id: q.id,
        title: q.title,
        author_name: q.user.fullName,
        author_public_key: q.user.publicKey,  
        question_count: q._count.questions,
      })),
      pagination: {
        page,
        per_page: perPage,
        total,
        total_pages: Math.ceil(total / perPage),
      },
    }
  }

  static async createQuiz(userId: string, title: string) {
    const quiz = await prisma.quiz.create({
      data: {
        userId,
        title,
      },
    })

    return {
      id: quiz.id,
      title: quiz.title,
      question_count: 0,
      participant_count: 0,
      created_at: quiz.createdAt.toISOString(),
    }
  }

  static async getUserQuizzes(userId: string) {
    const quizzes = await prisma.quiz.findMany({
      where: { userId },
      include: {
        questions: true,
        participants: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return quizzes.map((q) => ({
      id: q.id,
      title: q.title,
      question_count: q.questions.length,
      participant_count: q.participants.length,
      created_at: q.createdAt.toISOString(),
      updated_at: q.updatedAt.toISOString(),
    }))
  }

  static async getQuizById(quizId: string, userId?: string) {
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          orderBy: { orderIndex: 'asc' },
        },
        participants: true,
      },
    })

    if (!quiz) {
      throw new ApiError(404, 'Quiz non trouvé', 'NOT_FOUND')
    }

    if (userId && quiz.userId !== userId) {
      throw new ApiError(403, "Vous n'avez pas accès à ce quiz", 'FORBIDDEN')
    }

    return {
      id: quiz.id,
      title: quiz.title,
      question_count: quiz.questions.length,
      participant_count: quiz.participants.length,
      created_at: quiz.createdAt.toISOString(),
      questions: quiz.questions.map((q) => ({
        id: q.id,
        question_text: q.questionText,
        options: q.options,
        correct_option_index: q.correctOptionIndex,
        order_index: q.orderIndex,
      })),
    }
  }

  static async getQuizForPlay(quizId: string) {
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          orderBy: { orderIndex: 'asc' },
        },
        user: true,
      },
    })

    if (!quiz) {
      throw new ApiError(404, 'Quiz non trouvé', 'NOT_FOUND')
    }

    return {
      id: quiz.id,
      title: quiz.title,
      creator_name: quiz.user.fullName,
      questions: quiz.questions.map((q) => ({
        id: q.id,
        question_text: q.questionText,
        options: q.options,
        correct_option_index:q.correctOptionIndex
        // DO NOT return correct answers!
      })),
    }
  }

  static async updateQuiz(quizId: string, userId: string, title: string) {
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
    })

    if (!quiz) {
      throw new ApiError(404, 'Quiz non trouvé', 'NOT_FOUND')
    }

    if (quiz.userId !== userId) {
      throw new ApiError(403, "Vous n'avez pas le droit de modifier ce quiz", 'FORBIDDEN')
    }

    const updated = await prisma.quiz.update({
      where: { id: quizId },
      data: { title },
    })

    return {
      id: updated.id,
      title: updated.title,
      updated_at: updated.updatedAt.toISOString(),
    }
  }

  static async deleteQuiz(quizId: string, userId: string) {
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
    })

    if (!quiz) {
      throw new ApiError(404, 'Quiz non trouvé', 'NOT_FOUND')
    }

    if (quiz.userId !== userId) {
      throw new ApiError(403, "Vous n'avez pas le droit de supprimer ce quiz", 'FORBIDDEN')
    }

    await prisma.quiz.delete({
      where: { id: quizId },
    })

    return { message: 'Quiz supprimé avec succès' }
  }

  static async getQuizStats(quizId: string, userId: string) {
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        participants: {
          orderBy: { score:'desc' },
        },
        questions: true,
      },
    })

    if (!quiz) {
      throw new ApiError(404, 'Quiz non trouvé', 'NOT_FOUND')
    }

    if (quiz.userId !== userId) {
      throw new ApiError(403, "Vous n'avez pas le droit de voir les statistiques de ce quiz", 'FORBIDDEN')
    }

    // Calculate statistics
    const participantCount = quiz.participants.length
    const totalScore = quiz.participants.reduce((sum, p) => sum + p.score, 0)
    const averageScore = participantCount > 0 ? totalScore / participantCount : 0
    const averagePercentage = participantCount > 0 ? (totalScore / (participantCount * quiz.questions.length)) * 100 : 0

    // Find most missed question
    let mostMissedQuestion = null
    if (quiz.questions.length > 0) {
      const missedCounts = new Map<string, number>()

      console.log("Calculating most missed question...")

      console.log(quiz.participants)

      quiz.participants.forEach((p) => {
        const answers = p.answers as any[]
        answers.forEach((answer: any, index: number) => {
          const question = quiz.questions[index]
          if (question && answer.selected_option_index !== question.correctOptionIndex) {
            missedCounts.set(question.id, (missedCounts.get(question.id) || 0) + 1)
          }
        })
      })

      let maxMissed = 0
      let mostMissedId :any = null
      missedCounts.forEach((count, qId) => {
        if (count > maxMissed) {
          maxMissed = count
          mostMissedId = qId
        }
      })

      if (mostMissedId) {
        const q = quiz.questions.find((q) => q.id === mostMissedId)
        if (q) {
          mostMissedQuestion = {
            id: q.id,
            question_text: q.questionText,
            miss_count: maxMissed,
          }
        }
      }
    }

    return {
      quiz: {
        id: quiz.id,
        title: quiz.title,
      },
      participantCount,
      averageScore: Number(averageScore.toFixed(2)),
      averagePercentage: Number(averagePercentage.toFixed(2)),
      mostMissedQuestion,
      participants: quiz.participants.map((p) => ({
        id: p.id,
        participant_name: p.participantName,
        score: p.score,
        total_questions: p.totalQuestions,
        percentage: Number(((p.score / p.totalQuestions) * 100).toFixed(2)),
        completed_at: p.completedAt.toISOString(),
      })),
    }
  }

  static async getQuizParticipants(quizId: string, userId: string) {
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        participants: {
          orderBy: { completedAt: 'desc' },
        },
      },
    })

    if (!quiz) {
      throw new ApiError(404, 'Quiz non trouvé', 'NOT_FOUND')
    }

    if (quiz.userId !== userId) {
      throw new ApiError(403, "Vous n'avez pas le droit de voir les participants de ce quiz", 'FORBIDDEN')
    }

    return {
      participants: quiz.participants.map((p) => ({
        id: p.id,
        participant_name: p.participantName,
        score: p.score,
        total_questions: p.totalQuestions,
        percentage: Number(((p.score / p.totalQuestions) * 100).toFixed(2)),
        completed_at: p.completedAt.toISOString(),
      })),
    }
  }
}
