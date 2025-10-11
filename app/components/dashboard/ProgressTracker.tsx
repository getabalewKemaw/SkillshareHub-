// For showing enrollment progress. UX: Visual progress bar, motivational.
// UI: shadcn Progress, lucide for checkmarks.

import { Progress } from "@/components/ui/progress";
import { CheckCircle } from "lucide-react";

interface ProgressTrackerProps {
  progress: number; // 0-100
}

export function ProgressTracker({ progress }: ProgressTrackerProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Progress</span>
        <span>{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" />
      {progress === 100 && (
        <div className="flex items-center text-green-500">
          <CheckCircle className="mr-2 h-4 w-4" /> Completed!
        </div>
      )}
    </div>
  );
}