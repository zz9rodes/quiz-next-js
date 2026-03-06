import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('=== Fixing double-serialized JSON data ===\n')

  // Fix questions.options
  const questions = await prisma.question.findMany()
  let fixedQuestions = 0

  for (const q of questions) {
    if (typeof q.options === 'string') {
      try {
        const parsed = JSON.parse(q.options)
        await prisma.question.update({
          where: { id: q.id },
          data: { options: parsed },
        })
        fixedQuestions++
        console.log(`  Fixed question ${q.id}`)
      } catch (e) {
        console.error(`  Failed to parse options for question ${q.id}:`, e)
      }
    }
  }

  console.log(`\nQuestions fixed: ${fixedQuestions}/${questions.length}\n`)

  // Fix participants.answers
  const participants = await prisma.participant.findMany()
  let fixedParticipants = 0

  for (const p of participants) {
    if (typeof p.answers === 'string') {
      try {
        const parsed = JSON.parse(p.answers)
        await prisma.participant.update({
          where: { id: p.id },
          data: { answers: parsed },
        })
        fixedParticipants++
        console.log(`  Fixed participant ${p.id}`)
      } catch (e) {
        console.error(`  Failed to parse answers for participant ${p.id}:`, e)
      }
    }
  }

  console.log(`\nParticipants fixed: ${fixedParticipants}/${participants.length}\n`)
  console.log('=== Done ===')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
