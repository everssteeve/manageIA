import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ModuleViewer } from "@/components/skills/ModuleViewer";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import type { Locale } from "@/lib/i18n";

interface Props {
  params: Promise<{ lang: string; slug: string }>;
  searchParams: Promise<{ module?: string }>;
}

export default async function SkillDetailPage({
  params,
  searchParams,
}: Props) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const { module: moduleOrder } = await searchParams;
  const dict = await getDictionary(lang as Locale);

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/auth/signin");

  const skill = await prisma.skill.findUnique({
    where: { slug },
    include: {
      modules: { orderBy: { order: "asc" } },
      prerequisites: { select: { slug: true, title: true } },
      userProgress: { where: { userId: session.user.id }, take: 1 },
    },
  });

  if (!skill) notFound();

  const userProgress = skill.userProgress[0];
  if (!userProgress || userProgress.status === "locked") {
    redirect(`/${lang}/skills`);
  }

  const moduleProgressList = await prisma.userModuleProgress.findMany({
    where: {
      userId: session.user.id,
      moduleId: { in: skill.modules.map((m) => m.id) },
    },
  });

  const completedModuleIds = new Set(
    moduleProgressList.filter((mp) => mp.completedAt).map((mp) => mp.moduleId)
  );

  const completedCount = completedModuleIds.size;
  const totalCount = skill.modules.length;
  const progressPct =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const activeModuleOrder = moduleOrder ? parseInt(moduleOrder) : undefined;
  const activeModule = activeModuleOrder
    ? skill.modules.find((m) => m.order === activeModuleOrder)
    : skill.modules.find((m) => !completedModuleIds.has(m.id)) ??
      skill.modules[0];

  const d = dict.skillDetail;
  const sd = dict.status;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href={`/${lang}/skills`}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            {d.backToSkills}
          </Link>
          <span className="text-gray-300 dark:text-gray-600">/</span>
          <h1 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{skill.title}</h1>
        </div>
        <LanguageSwitcher currentLang={lang as Locale} />
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8 flex gap-8">
        <aside className="w-64 shrink-0 space-y-4">
          <div>
            <Badge
              variant={
                userProgress.status === "completed" ? "success" : "warning"
              }
            >
              {userProgress.status === "completed" ? sd.completed : sd.inProgress}
            </Badge>
            <div className="mt-2">
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                <span>
                  {completedCount}/{totalCount} modules
                </span>
                <span>{progressPct}%</span>
              </div>
              <Progress value={progressPct} className="h-2" />
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">
              {d.modules}
            </p>
            {skill.modules.map((m) => {
              const isCompleted = completedModuleIds.has(m.id);
              const isActive = activeModule?.id === m.id;

              return (
                <Link
                  key={m.id}
                  href={`/${lang}/skills/${slug}?module=${m.order}`}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium"
                      : isCompleted
                      ? "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <span className="w-4 h-4 rounded-full border dark:border-gray-600 flex items-center justify-center text-xs shrink-0">
                    {isCompleted ? "✓" : m.order}
                  </span>
                  <span className="truncate">{m.title}</span>
                </Link>
              );
            })}
          </div>

          <Link
            href={`/${lang}/coach`}
            className="block text-center text-sm text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-md py-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
          >
            {d.askCoach}
          </Link>
        </aside>

        <main className="flex-1 min-w-0">
          {activeModule ? (
            <ModuleViewer
              module={activeModule}
              skillSlug={slug}
              lang={lang as Locale}
              isCompleted={completedModuleIds.has(activeModule.id)}
              nextModule={
                skill.modules.find(
                  (m) => m.order === activeModule.order + 1
                ) ?? null
              }
              isLastModule={
                activeModule.order ===
                skill.modules[skill.modules.length - 1]?.order
              }
              dict={d}
            />
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 py-16">{d.noModules}</div>
          )}
        </main>
      </div>
    </div>
  );
}
