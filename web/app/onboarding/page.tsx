"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Step = 1 | 2 | 3;

const ROLE_OPTIONS = [
  { value: "team-lead", label: "Team Lead", description: "Leading a small team (2–8 people)" },
  { value: "middle-manager", label: "Middle Manager", description: "Managing team leads or multiple teams" },
  { value: "senior-manager", label: "Senior Manager / Director", description: "Leading an org of managers" },
  { value: "individual-contributor", label: "Individual Contributor", description: "No direct reports, but curious about AI leadership" },
];

const TEAM_SIZE_OPTIONS = [
  { value: "1-5", label: "1–5 people" },
  { value: "6-20", label: "6–20 people" },
  { value: "21-100", label: "21–100 people" },
  { value: "100+", label: "100+ people" },
];

const AI_FAMILIARITY_OPTIONS = [
  { value: "none", label: "None", description: "I haven't used AI tools in my work yet" },
  { value: "basic", label: "Basic", description: "I've tried a few things but don't use it regularly" },
  { value: "intermediate", label: "Intermediate", description: "I use AI tools regularly in my own work" },
  { value: "advanced", label: "Advanced", description: "I actively guide my team's AI adoption" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [role, setRole] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [aiFamiliarity, setAiFamiliarity] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFinish = async () => {
    setLoading(true);
    try {
      await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, teamSize, aiFamiliarity }),
      });
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-lg space-y-6">
        {/* Progress indicator */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-1.5 rounded-full transition-colors ${
                s <= step ? "bg-blue-600" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-gray-500 text-center">Step {step} of 3</p>

        {/* Step 1: Role */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>What&apos;s your role?</CardTitle>
              <CardDescription>
                This helps us tailor the learning path to your situation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {ROLE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setRole(opt.value)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                    role === opt.value
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="font-medium text-gray-900">{opt.label}</div>
                  <div className="text-sm text-gray-500">{opt.description}</div>
                </button>
              ))}
              <Button
                className="w-full mt-2"
                disabled={!role}
                onClick={() => setStep(2)}
              >
                Continue
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Team Size */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>How big is your team?</CardTitle>
              <CardDescription>
                Including direct and indirect reports.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {TEAM_SIZE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setTeamSize(opt.value)}
                    className={`p-4 rounded-lg border-2 transition-colors font-medium ${
                      teamSize === opt.value
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300 text-gray-900"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button className="flex-1" disabled={!teamSize} onClick={() => setStep(3)}>
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: AI Familiarity */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>How familiar are you with AI tools?</CardTitle>
              <CardDescription>
                Be honest — we&apos;ll calibrate the content accordingly.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {AI_FAMILIARITY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setAiFamiliarity(opt.value)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                    aiFamiliarity === opt.value
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="font-medium text-gray-900">{opt.label}</div>
                  <div className="text-sm text-gray-500">{opt.description}</div>
                </button>
              ))}
              <div className="flex gap-2 mt-2">
                <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button
                  className="flex-1"
                  disabled={!aiFamiliarity || loading}
                  onClick={handleFinish}
                >
                  {loading ? "Setting up..." : "Start Learning"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
