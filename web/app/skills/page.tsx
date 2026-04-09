import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";

export default async function SkillsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/auth/signin");

  const skills = await prisma.skill.findMany({
    orderBy: { order: "asc" },
    include: {
      userProgress: { where: { userId: session.user.id }, take: 1 },
      modules: {
        include: {
          progress: { where: { userId: session.user.id } },
        },
      },
      prerequisites: { select: { id: true, title: true, slug: true } },
      dependents: { select: { id: true, title: true } },
    },
  });

  const byCategory = skills.reduce<Record<string, typeof skills>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-4 flex items-center gap-4">
        <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-900">← Dashboard</Link>
        <h1 className="font-semibold text-gray-900">Skill Tree</h1>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your Learning Path</h2>
          <p className="text-gray-600 mt-1">Complete skills to unlock new ones. Click any available skill to begin.</p>
        </div>

        {Object.entries(byCategory).map(([category, categorySkills]) => (
          <section key={category}>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">{category}</h3>
            <div className="space-y-3">
              {categorySkills.map((skill) => {
                const status = skill.userProgress[0]?.status ?? "locked";
                const completedModules = skill.modules.filter((m) => m.progress[0]?.completedAt).length;
                const totalModules = skill.modules.length;
                const isAccessible = status !== "locked";

                return (
                  <Link
                    key={skill.id}
                    href={isAccessible ? `/skills/${skill.slug}` : "#"}
                    className={isAccessible ? "" : "pointer-events-none"}
                  >
                    <Card className={`transition-all ${!isAccessible ? "opacity-50" : "hover:shadow-md"}`}>
                      <CardContent className="py-5">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 mt-0.5
                            ${status === 'completed' ? 'bg-green-100' : status === 'in_progress' ? 'bg-blue-100' : status === 'available' ? 'bg-gray-100' : 'bg-gray-50'}">
                            {status === "completed" ? "✓" : status === "locked" ? "🔒" : skill.order}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900">{skill.title}</h4>
                              <SkillStatusBadge status={status} />
                            </div>
                            <p className="text-sm text-gray-600">{skill.description}</p>

                            {status !== "locked" && (
                              <div className="mt-3">
                                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                                  <span>{completedModules}/{totalModules} modules completed</span>
                                  {totalModules > 0 && (
                                    <span>{Math.round((completedModules / totalModules) * 100)}%</span>
                                  )}
                                </div>
                                <Progress value={(completedModules / Math.max(totalModules, 1)) * 100} className="h-1.5" />
                              </div>
                            )}

                            {status === "locked" && skill.prerequisites.length > 0 && (
                              <p className="text-xs text-gray-400 mt-2">
                                Requires: {skill.prerequisites.map((p) => p.title).join(", ")}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}

function SkillStatusBadge({ status }: { status: string }) {
  if (status === "completed") return <Badge variant="success">Completed</Badge>;
  if (status === "in_progress") return <Badge variant="warning">In Progress</Badge>;
  if (status === "available") return <Badge variant="outline">Available</Badge>;
  return <Badge variant="muted">Locked</Badge>;
}
