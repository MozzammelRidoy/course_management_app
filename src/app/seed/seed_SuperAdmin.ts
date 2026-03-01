import bcrypt from 'bcryptjs'
import { prisma } from '../shared/prisma'
import config from '../config'

// Super Admin seeding function
export const seed_SuperAdmin_Create = async () => {
  const hashedPassword = await bcrypt.hash(
    config.admin_password,
    config.bcrypt_salt_rounds
  )

  // Define User Payload
  const superAdminPayload = {
    email: config.admin_email,
    password: hashedPassword,
    role: 'SUPER_ADMIN' as const,
    isActive: true,
    isDeleted: false
  }

  // Define Profile Payload
  const superAdminProfile = {
    name: 'Super Admin'
  }

  // Perform Upsert
  await prisma.users.upsert({
    where: { email: config.admin_email },

    // User exists
    update: {
      ...superAdminPayload,
      profile: {
        upsert: {
          create: superAdminProfile,
          update: superAdminProfile
        }
      }
    },

    // User does not exist
    create: {
      ...superAdminPayload,
      profile: {
        create: superAdminProfile
      }
    },

    include: {
      profile: true
    }
  })

  return { message: 'Super Admin seeded successfully' }
}
