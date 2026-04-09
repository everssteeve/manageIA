import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import type { Locale } from "@/lib/i18n";

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function DashboardPage({ params }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/auth/signin");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user?.onboardedAt) redirect(`/${lang}/onboarding`);

  const skillsWithProgress = await prisma.skill.findMany({
    orderBy: { order: "asc" },
    include: {
      userProgress: {
        where: { userId: session.user.id },
        take: 1,
      },
      modules: {
        include: {
          progress: {
            where: { userId: session.user.id },
          },
        },
      },
      prerequisites: true,
    },
  });

  const coachingSessions = await prisma.coachingSession.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    take: 3,
    include: { messages: { take: 1, orderBy: { createdAt: "asc" } } },
  });

  const totalSkills = skillsWithProgress.length;
  const completedSkills = skillsWithProgress.filter(
    (s) => s.userProgress[0]?.status === "completed"
  ).length;
  const inProgressSkills = skillsWithProgress.filter(
    (s) => s.userProgress[0]?.status === "in_progress"
  ).length;
  const overallProgress =
    totalSkills > 0 ? Math.round((completedSkills / totalSkills) * 100) : 0;

  const nextSkill = skillsWithProgress.find(
    (s) =>
      s.userProgress[0]?.status === "in_progress" ||
      s.userProgress[0]?.status === "available"
  );

  const d = dict.dashboard;
  const s = dict.status;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <h1 className="font-semibold text-gray-900">{dict.nav.appName}</h1>
        <div className="flex items-center gap-4">
          <Link href={`/${lang}/skills`} className="text-sm text-gray-600 hover:text-gray-900">
            {dict.nav.skills}
          </Link>
          <Link href={`/${lang}/coach`} className="text-sm text-gray-600 hover:text-gray-900">
            {dict.nav.aiCoach}
          </Link>
          <span className="text-sm text-gray-500">
            {session.user.name || session.user.email}
          </span>
          <LanguageSwitcher currentLang={lang as Locale} />
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {d.welcomeBack}
            {session.user.name ? `, ${session.user.name.split(" ")[0]}` : ""}
          </h2>
          <p className="text-gray-600 mt-1">{d.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                {d.overallProgress}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{overallProgress}%</div>
              <Progress value={overallProgress} className="mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                {d.skillsCompleted}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {completedSkills}
                <span className="text-lg text-gray-400">/{totalSkills}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                {d.inProgress}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{inProgressSkills}</div>
            </CardContent>
          </Card>
        </div>

        {nextSkill && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">{d.recommendedNext}</h3>
            <Link href={`/${lang}/skills/${nextSkill.slug}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer border-blue-200 bg-blue-50">
                <CardContent className="py-5 flex items-center justify-between">
                  <div>
                    <Badge variant="default" className="mb-2">
                      {nextSkill.userProgress[0]?.status === "in_progress"
                        ? s.continue
                        : s.start}
                    </Badge>
                    <h4 className="font-semibold text-gray-900">{nextSkill.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{nextSkill.description}</p>
                  </div>
                  <span className="text-2xl ml-4">→</span>
                </CardContent>
              </Card>
            </Link>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">{d.allSkills}</h3>
            <Link href={`/${lang}/skills`} className="text-sm text-blue-600 hover:underline">
              {d.viewSkillTree}
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {skillsWithProgress.map((skill) => {
              const status = skill.userProgress[0]?.status ?? "locked";
              const completedModules = skill.modules.filter(
                (m) => m.progress[0]?.completedAt
              ).length;
              const totalModules = skill.modules.length;
              const moduleProgress =
                totalModules > 0 ? (completedModules / totalModules) * 100 : 0;

              return (
                <Link
                  key={skill.id}
                  href={status !== "locked" ? `/${lang}/skills/${skill.slug}` : "#"}
                >
                  <Card
                    className={`transition-all ${
                      status === "locked"
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:shadow-md cursor-pointer"
                    }`}
                  >
                    <CardContent className="py-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="text-xs text-gray-500 uppercase tracking-wide">
                            {skill.category}
                          </span>
                          <h4 className="font-medium text-gray-900 text-sm mt-0.5">
                            {skill.title}
                          </h4>
                        </div>
                        <StatusBadge status={status} dict={s} />
                      </div>
                      {status !== "locked" && (
                        <div>
                          <Progress value={moduleProgress} className="h-1.5 mt-2" />
                          <p className="text-xs text-gray-500 mt-1">
                            {d.modules
                              .replace("{completed}", String(completedModules))
                              .replace("{total}", String(totalModules))}
                          </p>
                        </div>
                      )}
                      {status === "locked" && (
                        <p className="text-xs text-gray-400 mt-1">
                          {d.completeFirst.replace(
                            "{prerequisites}",
                            skill.prerequisites.map((p) => p.title).join(", ")
                          )}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {coachingSessions.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">{d.recentCoaching}</h3>
              <Link href={`/${lang}/coach`} className="text-sm text-blue-600 hover:underline">
                {d.openCoach}
              </Link>
            </div>
            <div className="space-y-2">
              {coachingSessions.map((sess) => (
                <Link key={sess.id} href={`/${lang}/coach?session=${sess.id}`}>
                  <Card className="hover:shadow-sm transition-shadow cursor-pointer">
                    <CardContent className="py-3">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {sess.title ||
                          sess.messages[0]?.content.slice(0, 60) ||
                          d.coachingSession}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {new Date(sess.updatedAt).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function StatusBadge({
  status,
  dict,
}: {
  status: string;
  dict: { done: string; inProgress: string; available: string; locked: string };
}) {
  const variants: Record<
    string,
    { label: string; variant: "success" | "warning" | "muted" | "default" }
  > = {
    completed: { label: dict.done, variant: "success" },
    in_progress: { label: dict.inProgress, variant: "warning" },
    available: { label: dict.available, variant: "default" },
    locked: { label: dict.locked, variant: "muted" },
  };
  const { label, variant } = variants[status] ?? variants.locked;
  return <Badge variant={variant}>{label}</Badge>;
}
