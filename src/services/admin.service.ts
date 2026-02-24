import { prisma } from '@/lib/prisma'

export class AdminService {
  static async getAllUsers() {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return {
      users: users.map((u) => ({
        id: u.id,
        email: u.email,
        display_name: u.fullName,
        public_key: u.publicKey,
        avatar: u.avatar,
        is_admin: u.isAdmin,
        created_at: u.createdAt.toISOString(),
      })),
    }
  }

  static async getAllQuizzes() {
    const quizzes = await prisma.quiz.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    })

    return {
      quizzes: quizzes.map((q) => ({
        id: q.id,
        title: q.title,
        creator: {
          id: q.user.id,
          display_name: q.user.fullName,
          email: q.user.email,
        },
        created_at: q.createdAt.toISOString(),
      })),
    }
  }

  static async getQuizDetails(quizId: string) {
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        user: true,
        questions: {
          orderBy: { orderIndex: 'asc' },
        },
      },
    })

    if (!quiz) {
      return null
    }

    return {
      quiz: {
        id: quiz.id,
        title: quiz.title,
        creator: {
          id: quiz.user.id,
          display_name: quiz.user.fullName,
          email: quiz.user.email,
        },
        questions: quiz.questions.map((q) => ({
          id: q.id,
          question_text: q.questionText,
          options: JSON.parse(q.options),
          correct_option_index: q.correctOptionIndex,
          order_index: q.orderIndex,
        })),
        created_at: quiz.createdAt.toISOString(),
      },
    }
  }

  static async getAllParticipations() {
    const participations = await prisma.participant.findMany({
      include: { quiz: true },
      orderBy: { completedAt: 'desc' },
    })

    return {
      participations: participations.map((p) => ({
        id: p.id,
        participant_name: p.participantName,
        quiz: {
          id: p.quiz.id,
          title: p.quiz.title,
        },
        score: p.score,
        total_questions: p.totalQuestions,
        percentage: Number(((p.score / p.totalQuestions) * 100).toFixed(2)),
        completed_at: p.completedAt.toISOString(),
      })),
    }
  }
}
