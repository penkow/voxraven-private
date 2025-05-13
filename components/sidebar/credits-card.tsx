"use client";

import { useState, useEffect } from "react";
import { Coins, Gift } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/app/(providers)/auth-provider";

interface CreditsCardProps {}

export function CreditsCard({}: CreditsCardProps) {
  const [progressValue, setProgressValue] = useState(0);
  const [totalCredits, setTotalCredits] = useState(0);
  const [usedCredits, setUsedCredits] = useState(0);
  const [bonusCredits, setBonusCredits] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    const totalCredits = user?.totalCredits || 0;
    const usedCredits = user?.usedCredits || 0;
    const bonusCredits = user?.bonusCredits || 0;

    setTotalCredits(totalCredits);
    setUsedCredits(usedCredits);
    setBonusCredits(bonusCredits);

    const percentage =
      100 -
      ((totalCredits - usedCredits + bonusCredits) /
        (totalCredits + bonusCredits)) *
        100;
    setProgressValue(percentage);
  }, [user?.totalCredits, user?.usedCredits, user?.bonusCredits]);

  return (
    <Card className="w-full bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Credits</span>
          </div>
        </div>

        <div className="mt-1 mb-3">
          <Progress value={progressValue} className="h-2" />
        </div>

        <div className="text-sm text-gray-600">
          <span className="font-medium">{usedCredits}</span> of {totalCredits}{" "}
          credits used
        </div>

        {/* Bonus credits section */}
        {bonusCredits > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
            <Gift className="h-4 w-4 text-pink-500" />
            <span className="text-xs font-medium text-gray-700">
              +{bonusCredits} bonus credits
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
