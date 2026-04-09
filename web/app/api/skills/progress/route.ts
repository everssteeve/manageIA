import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// Mark a module as complete
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { moduleId } = await req.json();
  const userId = session.user.id;

  const module = await prisma.module.findUnique({
    where: { id: moduleId },
    include: {
      skill: {
        include: {
          dependents: true,
          modules: true,
        },
      },
    },
  });

  if (!module) {
    return NextResponse.json({ error: "Module not found" }, { status: 404 });
  }

  // Mark module complete
  await prisma.userModuleProgress.upsert({
    where: { userId_moduleId: { userId, moduleId } },
    update: { completedAt: new Date() },
    create: { userId, moduleId, completedAt: new Date() },
  });

  // Check if all modules in the skill are complete
  const skill = module.skill;
  const completedModules = await prisma.userModuleProgress.count({
    where: {
      userId,
      moduleId: { in: skill.modules.map((m) => m.id) },
      completedAt: { not: null },
    },
  });

  const skillComplete = completedModules >= skill.modules.length;

  if (skillComplete) {
    // Mark skill as completed
    await prisma.userSkillProgress.upsert({
      where: { userId_skillId: { userId, skillId: skill.id } },
      update: { status: "completed", completedAt: new Date() },
      create: { userId, skillId: skill.id, status: "completed", completedAt: new Date() },
    });

    // Unlock dependent skills where all prerequisites are now met
    for (const dependent of skill.dependents) {
      const dependentSkill = await prisma.skill.findUnique({
        where: { id: dependent.id },
        include: { prerequisites: true },
      });
      if (!dependentSkill) continue;

      const completedPrereqs = await prisma.userSkillProgress.count({
        where: {
          userId,
          skillId: { in: dependentSkill.prerequisites.map((p) => p.id) },
          status: "completed",
        },
      });

      if (completedPrereqs >= dependentSkill.prerequisites.length) {
        await prisma.userSkillProgress.upsert({
          where: { userId_skillId: { userId, skillId: dependent.id } },
          update: { status: "available" },
          create: { userId, skillId: dependent.id, status: "available" },
        });
      }
    }
  } else {
    // Mark skill as in_progress
    await prisma.userSkillProgress.upsert({
      where: { userId_skillId: { userId, skillId: skill.id } },
      update: { status: "in_progress", startedAt: new Date() },
      create: { userId, skillId: skill.id, status: "in_progress", startedAt: new Date() },
    });
  }

  return NextResponse.json({ success: true, skillComplete });
}
