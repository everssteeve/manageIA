import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { role, teamSize, aiFamiliarity } = await req.json();

  // Update user profile
  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      role,
      teamSize,
      aiFamiliarity,
      onboardedAt: new Date(),
    },
  });

  // Seed initial skill progress — unlock the first skill(s) with no prerequisites
  const rootSkills = await prisma.skill.findMany({
    where: { prerequisites: { none: {} } },
    orderBy: { order: "asc" },
  });

  for (const skill of rootSkills) {
    await prisma.userSkillProgress.upsert({
      where: {
        userId_skillId: {
          userId: session.user.id,
          skillId: skill.id,
        },
      },
      update: {},
      create: {
        userId: session.user.id,
        skillId: skill.id,
        status: "available",
      },
    });
  }

  // Lock all other skills
  const otherSkills = await prisma.skill.findMany({
    where: { prerequisites: { some: {} } },
  });

  for (const skill of otherSkills) {
    await prisma.userSkillProgress.upsert({
      where: {
        userId_skillId: {
          userId: session.user.id,
          skillId: skill.id,
        },
      },
      update: {},
      create: {
        userId: session.user.id,
        skillId: skill.id,
        status: "locked",
      },
    });
  }

  return NextResponse.json({ success: true });
}
