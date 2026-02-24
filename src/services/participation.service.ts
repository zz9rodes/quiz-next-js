import { prisma } from '@/lib/prisma'
import { ApiError } from '@/utils/errors'

export interface ParticipationAnswer {
  question_id: string
  selected_option_index: number
}

export class ParticipationService {
  static async submitParticipation(
    quizId: string,
    participantName: string,
    answers: ParticipationAnswer[]
  ) {
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          orderBy: { orderIndex: 'asc' },
        },
      },
    })

    if (!quiz) {
      throw new ApiError(404, 'Quiz non trouvé', 'NOT_FOUND')
    }

    // Calculate score
    let score = 0
    const results: any[] = []
    const processedAnswers: any[] = []

    const questionsMap = new Map(quiz.questions.map((q) => [q.id, q]))

    answers.forEach((answer) => {
      const question = questionsMap.get(answer.question_id)

      if (question) {
        const isCorrect = question.correctOptionIndex === answer.selected_option_index

        if (isCorrect) {
          score++
        }

        results.push({
          question_id: question.id,
          question_text: question.questionText,
          selected_option_index: answer.selected_option_index,
          correct_option_index: question.correctOptionIndex,
          is_correct: isCorrect,
          options: JSON.parse(question.options),
        })

        processedAnswers.push({
          question_id: question.id,
          selected_option_index: answer.selected_option_index,
        })
      }
    })

    const totalQuestions = quiz.questions.length
    const percentage = totalQuestions > 0 ? Number(((score / totalQuestions) * 100).toFixed(2)) : 0

    const participation = await prisma.participant.create({
      data: {
        quizId: quiz.id,
        participantName,
        score,
        totalQuestions,
        answers: JSON.stringify(processedAnswers),
      },
    })

    return {
      id: participation.id,
      quiz_id: quiz.id,
      participant_name: participation.participantName,
      score: participation.score,
      total_questions: participation.totalQuestions,
      percentage,
      completed_at: participation.completedAt.toISOString(),
      results,
    }
  }

  static async getParticipation(participationId: string) {
    const participation = await prisma.participant.findUnique({
      where: { id: participationId },
      include: {
        quiz: {
          include: {
            questions: {
              orderBy: { orderIndex: 'asc' },
            },
          },
        },
      },
    })

    if (!participation) {
      throw new ApiError(404, 'Participation non trouvée', 'NOT_FOUND')
    }

    const questionsMap = new Map(
      participation.quiz.questions.map((q) => [q.id, q])
    )
    const results: any[] = []

    if (Array.isArray(JSON.parse(participation.answers))) {
      const answers = JSON.parse(participation.answers)
      answers.forEach((answer: any) => {
        const question = questionsMap.get(answer.question_id)
        if (question) {
          const isCorrect = question.correctOptionIndex === answer.selected_option_index
          results.push({
            question_id: question.id,
            question_text: question.questionText,
            selected_option_index: answer.selected_option_index,
            correct_option_index: question.correctOptionIndex,
            is_correct: isCorrect,
            options: JSON.parse(question.options),
          })
        }
      })
    }

    const percentage =
      participation.totalQuestions > 0
        ? Number(((participation.score / participation.totalQuestions) * 100).toFixed(2))
        : 0

    return {
      id: participation.id,
      quiz_title: participation.quiz.title,
      participant_name: participation.participantName,
      score: participation.score,
      total_questions: participation.totalQuestions,
      percentage,
      completed_at: participation.completedAt.toISOString(),
      results,
    }
  }

  static async getParticipationDetails(participationId: string, userId: string) {
    const participation = await prisma.participant.findUnique({
      where: { id: participationId },
      include: {
        quiz: {
          include: {
            questions: {
              orderBy: { orderIndex: 'asc' },
            },
          },
        },
      },
    })

    if (!participation) {
      throw new ApiError(404, 'Participation non trouvée', 'NOT_FOUND')
    }

    // Check ownership
    if (participation.quiz.userId !== userId) {
      throw new ApiError(
        403,
        "Vous n'avez pas le droit de voir les détails de cette participation",
        'FORBIDDEN'
      )
    }

    const questionsMap = new Map(
      participation.quiz.questions.map((q) => [q.id, q])
    )
    const results: any[] = []

    if (Array.isArray(JSON.parse(participation.answers))) {
      const answers = JSON.parse(participation.answers)
      answers.forEach((answer: any) => {
        const question = questionsMap.get(answer.question_id)
        if (question) {
          const isCorrect = question.correctOptionIndex === answer.selected_option_index
          results.push({
            question_id: question.id,
            question_text: question.questionText,
            selected_option_index: answer.selected_option_index,
            correct_option_index: question.correctOptionIndex,
            is_correct: isCorrect,
            options: JSON.parse(question.options),
          })
        }
      })
    }

    const percentage =
      participation.totalQuestions > 0
        ? Number(((participation.score / participation.totalQuestions) * 100).toFixed(2))
        : 0

    return {
      id: participation.id,
      quiz_title: participation.quiz.title,
      participant_name: participation.participantName,
      score: participation.score,
      total_questions: participation.totalQuestions,
      percentage,
      completed_at: participation.completedAt.toISOString(),
      results,
    }
  }
}
