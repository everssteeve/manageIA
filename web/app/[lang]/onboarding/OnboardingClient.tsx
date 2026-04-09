"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Locale } from "@/lib/i18n";

type Step = 1 | 2 | 3;

interface OnboardingDict {
  stepOf: string;
  step1: {
    title: string;
    description: string;
    roles: {
      teamLead: { label: string; description: string };
      middleManager: { label: string; description: string };
      seniorManager: { label: string; description: string };
      individualContributor: { label: string; description: string };
    };
  };
  step2: {
    title: string;
    description: string;
    sizes: {
      s1to5: string;
      s6to20: string;
      s21to100: string;
      s100plus: string;
    };
  };
  step3: {
    title: string;
    description: string;
    levels: {
      none: { label: string; description: string };
      basic: { label: string; description: string };
      intermediate: { label: string; description: string };
      advanced: { label: string; description: string };
    };
  };
  back: string;
  continue: string;
  startLearning: string;
  settingUp: string;
}

interface Props {
  lang: Locale;
  dict: OnboardingDict;
}

export function OnboardingClient({ lang, dict }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [role, setRole] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [aiFamiliarity, setAiFamiliarity] = useState("");
  const [loading, setLoading] = useState(false);

  const roleOptions = [
    { value: "team-lead", ...dict.step1.roles.teamLead },
    { value: "middle-manager", ...dict.step1.roles.middleManager },
    { value: "senior-manager", ...dict.step1.roles.seniorManager },
    {
      value: "individual-contributor",
      ...dict.step1.roles.individualContributor,
    },
  ];

  const teamSizeOptions = [
    { value: "1-5", label: dict.step2.sizes.s1to5 },
    { value: "6-20", label: dict.step2.sizes.s6to20 },
    { value: "21-100", label: dict.step2.sizes.s21to100 },
    { value: "100+", label: dict.step2.sizes.s100plus },
  ];

  const aiFamiliarityOptions = [
    { value: "none", ...dict.step3.levels.none },
    { value: "basic", ...dict.step3.levels.basic },
    { value: "intermediate", ...dict.step3.levels.intermediate },
    { value: "advanced", ...dict.step3.levels.advanced },
  ];

  const handleFinish = async () => {
    setLoading(true);
    try {
      await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, teamSize, aiFamiliarity }),
      });
      router.push(`/${lang}/dashboard`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-lg space-y-6">
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
        <p className="text-sm text-gray-500 text-center">
          {dict.stepOf.replace("{step}", String(step))}
        </p>

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>{dict.step1.title}</CardTitle>
              <CardDescription>{dict.step1.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {roleOptions.map((opt) => (
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
                {dict.continue}
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>{dict.step2.title}</CardTitle>
              <CardDescription>{dict.step2.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {teamSizeOptions.map((opt) => (
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
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStep(1)}
                >
                  {dict.back}
                </Button>
                <Button
                  className="flex-1"
                  disabled={!teamSize}
                  onClick={() => setStep(3)}
                >
                  {dict.continue}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>{dict.step3.title}</CardTitle>
              <CardDescription>{dict.step3.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {aiFamiliarityOptions.map((opt) => (
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
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStep(2)}
                >
                  {dict.back}
                </Button>
                <Button
                  className="flex-1"
                  disabled={!aiFamiliarity || loading}
                  onClick={handleFinish}
                >
                  {loading ? dict.settingUp : dict.startLearning}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
