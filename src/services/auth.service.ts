import { prisma } from '@/lib/prisma'
import { hashPassword, comparePasswords, generateToken } from '@/lib/auth'
import { ApiError } from '@/utils/errors'
import crypto from 'crypto'

export class AuthService {
  static async signup(email: string, password: string, fullName: string) {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingUser) {
      throw new ApiError(400, 'Cet email est déjà utilisé', 'DUPLICATE_EMAIL')
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Generate public key
    const publicKey = `user${Math.random().toString(36).substr(2, 9)}`

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        fullName,
        publicKey,
      },
    })

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    })

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        display_name: user.fullName,
        public_key: user.publicKey,
        avatar: user.avatar,
        is_admin: user.isAdmin,
      },
    }
  }

  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!user) {
      throw new ApiError(401, 'Email ou mot de passe incorrect', 'INVALID_CREDENTIALS')
    }

    const passwordMatch = await comparePasswords(password, user.passwordHash)
    if (!passwordMatch) {
      throw new ApiError(401, 'Email ou mot de passe incorrect', 'INVALID_CREDENTIALS')
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    })

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        display_name: user.fullName,
        public_key: user.publicKey,
        avatar: user.avatar,
        is_admin: user.isAdmin,
      },
    }
  }

  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new ApiError(404, 'Utilisateur non trouvé', 'NOT_FOUND')
    }

    return {
      id: user.id,
      email: user.email,
      display_name: user.fullName,
      public_key: user.publicKey,
      avatar: user.avatar,
      is_admin: user.isAdmin,
      created_at: user.createdAt.toISOString(),
    }
  }

  static async updateProfile(userId: string, displayName?: string, avatar?: string) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(displayName && { fullName: displayName }),
        ...(avatar && { avatar }),
      },
    })

    return {
      id: user.id,
      email: user.email,
      display_name: user.fullName,
      public_key: user.publicKey,
      avatar: user.avatar,
      is_admin: user.isAdmin,
    }
  }

  static async getPublicProfile(publicKey: string) {
    const user = await prisma.user.findUnique({
      where: { publicKey },
    })

    if (!user) {
      throw new ApiError(404, 'Utilisateur non trouvé', 'NOT_FOUND')
    }

    return {
      display_name: user.fullName,
      public_key: user.publicKey,
      avatar: user.avatar,
    }
  }
}
