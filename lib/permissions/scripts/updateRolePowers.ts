import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting script to update role powers...');

  const roles = await prisma.authRole.findMany({
    include: {
      _count: {
        select: {
          rolePermissions: { where: { isActive: true } },
        },
      },
    },
  });

  let updatedCount = 0;
  for (const role of roles) {
    const power = role._count.rolePermissions;
    await prisma.authRole.update({
      where: { id: role.id },
      data: { power: power },
    });
    updatedCount++;
  }

  console.log(`Successfully updated the power for ${updatedCount} roles.`);
}

main()
  .catch((e) => {
    console.error('An error occurred while updating role powers:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('Prisma client disconnected.');
  });