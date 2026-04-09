import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4">
      <main className="max-w-2xl w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Manager AI Coach
          </h1>
          <p className="text-xl text-gray-600 max-w-lg mx-auto">
            A structured learning path and AI coaching system to help you navigate your team&apos;s transition to AI-augmented work.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="text-2xl mb-2">📚</div>
            <h3 className="font-semibold text-gray-900 mb-1">Learning Path</h3>
            <p className="text-sm text-gray-600">Structured micro-skills for the AI transition, unlocked as you progress.</p>
          </div>
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="text-2xl mb-2">🤖</div>
            <h3 className="font-semibold text-gray-900 mb-1">AI Coach</h3>
            <p className="text-sm text-gray-600">Context-aware coaching conversations tailored to your situation.</p>
          </div>
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="text-2xl mb-2">📈</div>
            <h3 className="font-semibold text-gray-900 mb-1">Progress Tracking</h3>
            <p className="text-sm text-gray-600">See your growth across skills and get recommended next steps.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/auth/signin"
            className="inline-flex items-center justify-center h-11 px-8 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center h-11 px-8 rounded-md border border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Dashboard →
          </Link>
        </div>
      </main>
    </div>
  );
}
