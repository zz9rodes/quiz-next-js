import { prisma } from '@/lib/prisma'
import { ApiError } from '@/utils/errors'

export class MessageService {
  static async sendMessage(publicKey: string, content: string) {
    const user = await prisma.user.findUnique({
      where: { publicKey },
    })

    if (!user) {
      throw new ApiError(404, 'Utilisateur non trouvé', 'NOT_FOUND')
    }

    const message = await prisma.anonymousMessage.create({
      data: {
        recipientId: user.id,
        content,
      },
    })

    return {
      message: 'Message envoyé avec succès',
      data: {
        id: message.id,
        created_at: message.createdAt.toISOString(),
      },
    }
  }

  static async getMessages(userId: string) {
    const messages = await prisma.anonymousMessage.findMany({
      where: { recipientId: userId },
      orderBy: { createdAt: 'desc' },
    })

    return {
      messages: messages.map((m) => ({
        id: m.id,
        content: m.content,
        created_at: m.createdAt.toISOString(),
      })),
    }
  }

  static async getMessage(messageId: number, userId: string) {
    const message = await prisma.anonymousMessage.findUnique({
      where: { id: messageId },
    })

    if (!message) {
      throw new ApiError(404, 'Message non trouvé', 'NOT_FOUND')
    }

    if (message.recipientId !== userId) {
      throw new ApiError(403, "Vous n'avez pas le droit de voir ce message", 'FORBIDDEN')
    }

    return {
      message: {
        id: message.id,
        content: message.content,
        created_at: message.createdAt.toISOString(),
      },
    }
  }

  static async deleteMessage(messageId: number, userId: string) {
    const message = await prisma.anonymousMessage.findUnique({
      where: { id: messageId },
    })

    if (!message) {
      throw new ApiError(404, 'Message non trouvé', 'NOT_FOUND')
    }

    if (message.recipientId !== userId) {
      throw new ApiError(403, "Vous n'avez pas le droit de supprimer ce message", 'FORBIDDEN')
    }

    await prisma.anonymousMessage.delete({
      where: { id: messageId },
    })

    return { message: 'Message supprimé avec succès' }
  }

  static async getUserMessages(publicKey: string, currentUserId: string, isAdmin: boolean) {
    const user = await prisma.user.findUnique({
      where: { publicKey },
      include: {
        anonymousMessages: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!user) {
      throw new ApiError(404, 'Utilisateur non trouvé', 'NOT_FOUND')
    }

    // Check access: admin or owner only
    if (!isAdmin && currentUserId !== user.id) {
      throw new ApiError(403, 'Accès non autorisé', 'FORBIDDEN')
    }

    return {
      user: {
        id: user.id,
        display_name: user.fullName,
        public_key: user.publicKey,
      },
      messages: user.anonymousMessages.map((m) => ({
        id: m.id,
        content: m.content,
        created_at: m.createdAt.toISOString(),
      })),
    }
  }
}
