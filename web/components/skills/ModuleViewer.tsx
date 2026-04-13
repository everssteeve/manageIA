"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import type { Locale } from "@/lib/i18n";

interface Module {
  id: string;
  title: string;
  body: string;
  order: number;
}

interface ModuleDict {
  module: string;
  completed: string;
  marking: string;
  markComplete: string;
  completeSkill: string;
  nextModule: string;
  backToSkillsList: string;
}

interface Props {
  module: Module;
  skillSlug: string;
  lang: Locale;
  isCompleted: boolean;
  nextModule: Module | null;
  isLastModule: boolean;
  dict: ModuleDict;
}

export function ModuleViewer({
  module,
  skillSlug,
  lang,
  isCompleted,
  nextModule,
  isLastModule,
  dict,
}: Props) {
  const router = useRouter();
  const [marking, setMarking] = useState(false);
  const [done, setDone] = useState(isCompleted);

  const handleComplete = async () => {
    if (done) return;
    setMarking(true);
    try {
      await fetch("/api/skills/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleId: module.id }),
      });
      setDone(true);
      if (nextModule) {
        router.push(`/${lang}/skills/${skillSlug}?module=${nextModule.order}`);
        router.refresh();
      } else {
        router.refresh();
      }
    } finally {
      setMarking(false);
    }
  };

  return (
    <article className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-8">
      <div className="mb-6">
        <p className="text-sm text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">
          {dict.module.replace("{order}", String(module.order))}
        </p>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{module.title}</h2>
        {done && (
          <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400 text-sm mt-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            {dict.completed}
          </span>
        )}
      </div>

      <div className="prose prose-gray max-w-none dark:prose-invert">
        <ReactMarkdown
          components={{
            h1: ({ children }) => (
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-6 mb-3">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-5 mb-2">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-4 mb-2">
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{children}</p>
            ),
            ul: ({ children }) => (
              <ul className="list-disc list-inside space-y-1 mb-4 text-gray-700 dark:text-gray-300">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside space-y-1 mb-4 text-gray-700 dark:text-gray-300">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="text-gray-700 dark:text-gray-300">{children}</li>
            ),
            strong: ({ children }) => (
              <strong className="font-semibold text-gray-900 dark:text-gray-100">{children}</strong>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-blue-400 dark:border-blue-600 pl-4 py-1 my-4 text-gray-600 dark:text-gray-400 italic">
                {children}
              </blockquote>
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto my-4">
                <table className="w-full border-collapse text-sm">
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className="bg-gray-50 dark:bg-gray-700">{children}</thead>
            ),
            th: ({ children }) => (
              <th className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-left font-semibold text-gray-900 dark:text-gray-100">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-gray-700 dark:text-gray-300">
                {children}
              </td>
            ),
            code: ({ children, className }) => {
              const isInline = !className;
              if (isInline)
                return (
                  <code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm font-mono text-gray-800 dark:text-gray-200">
                    {children}
                  </code>
                );
              return (
                <code className="block bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto my-4">
                  {children}
                </code>
              );
            },
            pre: ({ children }) => <>{children}</>,
            hr: () => <hr className="border-gray-200 dark:border-gray-700 my-6" />,
          }}
        >
          {module.body}
        </ReactMarkdown>
      </div>

      <div className="flex items-center justify-between pt-6 mt-6 border-t dark:border-gray-700">
        <div />
        <div className="flex items-center gap-3">
          {!done && (
            <Button onClick={handleComplete} disabled={marking}>
              {marking
                ? dict.marking
                : isLastModule
                ? dict.completeSkill
                : dict.markComplete}
            </Button>
          )}
          {done && nextModule && (
            <Button
              variant="outline"
              onClick={() =>
                router.push(
                  `/${lang}/skills/${skillSlug}?module=${nextModule.order}`
                )
              }
            >
              {dict.nextModule}
            </Button>
          )}
          {done && isLastModule && (
            <Button
              variant="outline"
              onClick={() => router.push(`/${lang}/skills`)}
            >
              {dict.backToSkillsList}
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
