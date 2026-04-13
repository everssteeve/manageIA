import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import type { Locale } from "@/lib/i18n";

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function SkillsPage({ params }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

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

  const byCategory = skills.reduce<Record<string, typeof skills>>(
    (acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    },
    {}
  );

  const d = dict.skills;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href={`/${lang}/dashboard`}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            {d.backToDashboard}
          </Link>
          <h1 className="font-semibold text-gray-900 dark:text-gray-100">{d.title}</h1>
        </div>
        <LanguageSwitcher currentLang={lang as Locale} />
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{d.learningPath}</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{d.description}</p>
        </div>

        {Object.entries(byCategory).map(([category, categorySkills]) => (
          <section key={category}>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              {category}
            </h3>
            <div className="space-y-3">
              {categorySkills.map((skill) => {
                const status = skill.userProgress[0]?.status ?? "locked";
                const completedModules = skill.modules.filter(
                  (m) => m.progress[0]?.completedAt
                ).length;
                const totalModules = skill.modules.length;
                const isAccessible = status !== "locked";

                return (
                  <Link
                    key={skill.id}
                    href={isAccessible ? `/${lang}/skills/${skill.slug}` : "#"}
                    className={isAccessible ? "" : "pointer-events-none"}
                  >
                    <Card
                      className={`transition-all ${
                        !isAccessible ? "opacity-50" : "hover:shadow-md"
                      }`}
                    >
                      <CardContent className="py-5">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 mt-0.5 dark:text-gray-300">
                            {status === "completed"
                              ? "✓"
                              : status === "locked"
                              ? "🔒"
                              : skill.order}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                {skill.title}
                              </h4>
                              <SkillStatusBadge status={status} dict={dict.status} />
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {skill.description}
                            </p>

                            {status !== "locked" && (
                              <div className="mt-3">
                                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                                  <span>
                                    {d.modulesCompleted
                                      .replace(
                                        "{completed}",
                                        String(completedModules)
                                      )
                                      .replace("{total}", String(totalModules))}
                                  </span>
                                  {totalModules > 0 && (
                                    <span>
                                      {Math.round(
                                        (completedModules / totalModules) * 100
                                      )}
                                      %
                                    </span>
                                  )}
                                </div>
                                <Progress
                                  value={
                                    (completedModules /
                                      Math.max(totalModules, 1)) *
                                    100
                                  }
                                  className="h-1.5"
                                />
                              </div>
                            )}

                            {status === "locked" &&
                              skill.prerequisites.length > 0 && (
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                                  {d.requires.replace(
                                    "{prerequisites}",
                                    skill.prerequisites
                                      .map((p) => p.title)
                                      .join(", ")
                                  )}
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

function SkillStatusBadge({
  status,
  dict,
}: {
  status: string;
  dict: { completed: string; inProgress: string; available: string; locked: string };
}) {
  if (status === "completed") return <Badge variant="success">{dict.completed}</Badge>;
  if (status === "in_progress") return <Badge variant="warning">{dict.inProgress}</Badge>;
  if (status === "available") return <Badge variant="outline">{dict.available}</Badge>;
  return <Badge variant="muted">{dict.locked}</Badge>;
}
