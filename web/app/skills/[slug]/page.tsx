import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ModuleViewer } from "@/components/skills/ModuleViewer";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ module?: string }>;
}

export default async function SkillDetailPage({ params, searchParams }: Props) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/auth/signin");

  const { slug } = await params;
  const { module: moduleOrder } = await searchParams;

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
    redirect("/skills");
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
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Default to the first incomplete module, or first module if all done
  const activeModuleOrder = moduleOrder ? parseInt(moduleOrder) : undefined;
  const activeModule = activeModuleOrder
    ? skill.modules.find((m) => m.order === activeModuleOrder)
    : skill.modules.find((m) => !completedModuleIds.has(m.id)) ?? skill.modules[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-4 flex items-center gap-4">
        <Link href="/skills" className="text-sm text-gray-500 hover:text-gray-900">← Skills</Link>
        <span className="text-gray-300">/</span>
        <h1 className="font-semibold text-gray-900 truncate">{skill.title}</h1>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8 flex gap-8">
        {/* Sidebar */}
        <aside className="w-64 shrink-0 space-y-4">
          <div>
            <Badge variant={userProgress.status === "completed" ? "success" : "warning"}>
              {userProgress.status === "completed" ? "Completed" : "In Progress"}
            </Badge>
            <div className="mt-2">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>{completedCount}/{totalCount} modules</span>
                <span>{progressPct}%</span>
              </div>
              <Progress value={progressPct} className="h-2" />
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Modules</p>
            {skill.modules.map((m) => {
              const isCompleted = completedModuleIds.has(m.id);
              const isActive = activeModule?.id === m.id;

              return (
                <Link
                  key={m.id}
                  href={`/skills/${slug}?module=${m.order}`}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : isCompleted
                      ? "text-gray-600 hover:bg-gray-100"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="w-4 h-4 rounded-full border flex items-center justify-center text-xs shrink-0
                    ${isCompleted ? 'border-green-500 bg-green-500 text-white' : isActive ? 'border-blue-600' : 'border-gray-300'}">
                    {isCompleted ? "✓" : m.order}
                  </span>
                  <span className="truncate">{m.title}</span>
                </Link>
              );
            })}
          </div>

          <Link
            href="/coach"
            className="block text-center text-sm text-blue-600 border border-blue-200 rounded-md py-2 hover:bg-blue-50 transition-colors"
          >
            💬 Ask your AI coach
          </Link>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {activeModule ? (
            <ModuleViewer
              module={activeModule}
              skillSlug={slug}
              isCompleted={completedModuleIds.has(activeModule.id)}
              nextModule={
                skill.modules.find((m) => m.order === activeModule.order + 1) ?? null
              }
              isLastModule={activeModule.order === skill.modules[skill.modules.length - 1]?.order}
            />
          ) : (
            <div className="text-center text-gray-500 py-16">No modules found.</div>
          )}
        </main>
      </div>
    </div>
  );
}
