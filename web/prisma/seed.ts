import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { SKILLS_SEED } from "../lib/skills-data";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding skills and modules...");

  // First pass: create all skills without prerequisites
  for (const skillData of SKILLS_SEED) {
    const { modules, prerequisites, ...skill } = skillData;

    await prisma.skill.upsert({
      where: { slug: skill.slug },
      update: { ...skill },
      create: { ...skill },
    });

    for (const moduleData of modules) {
      const module = await prisma.module.findFirst({
        where: { skillId: (await prisma.skill.findUnique({ where: { slug: skill.slug } }))!.id, order: moduleData.order },
      });

      const skillRecord = await prisma.skill.findUnique({ where: { slug: skill.slug } });
      if (!skillRecord) continue;

      if (!module) {
        await prisma.module.create({
          data: {
            ...moduleData,
            skillId: skillRecord.id,
          },
        });
      } else {
        await prisma.module.update({
          where: { id: module.id },
          data: { title: moduleData.title, body: moduleData.body },
        });
      }
    }
  }

  // Second pass: set prerequisites
  for (const skillData of SKILLS_SEED) {
    if (skillData.prerequisites.length === 0) continue;

    const skill = await prisma.skill.findUnique({ where: { slug: skillData.slug } });
    if (!skill) continue;

    const prereqSlugs = skillData.prerequisites;
    const prereqs = await prisma.skill.findMany({
      where: { slug: { in: prereqSlugs } },
    });

    await prisma.skill.update({
      where: { id: skill.id },
      data: {
        prerequisites: {
          set: prereqs.map((p) => ({ id: p.id })),
        },
      },
    });
  }

  console.log(`Seeded ${SKILLS_SEED.length} skills.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
