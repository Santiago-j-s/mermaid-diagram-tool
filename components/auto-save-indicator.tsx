"use client";

import { useEffect, useState } from "react";
import { Check, Cloud } from "lucide-react";

interface AutoSaveIndicatorProps {
  lastSaved?: Date;
}

export function AutoSaveIndicator({ lastSaved }: AutoSaveIndicatorProps) {
  const [timeSinceLastSave, setTimeSinceLastSave] = useState<string>("");

  useEffect(() => {
    if (!lastSaved) return;

    const updateTimestamp = () => {
      const now = new Date();
      const diffMs = now.getTime() - lastSaved.getTime();
      const diffSeconds = Math.floor(diffMs / 1000);
      const diffMinutes = Math.floor(diffSeconds / 60);

      if (diffSeconds < 10) {
        setTimeSinceLastSave("Just now");
      } else if (diffSeconds < 60) {
        setTimeSinceLastSave(`${diffSeconds}s ago`);
      } else if (diffMinutes < 60) {
        setTimeSinceLastSave(`${diffMinutes}m ago`);
      } else {
        setTimeSinceLastSave("Over 1h ago");
      }
    };

    updateTimestamp();
    const interval = setInterval(updateTimestamp, 5000);

    return () => clearInterval(interval);
  }, [lastSaved]);

  if (!lastSaved) return null;

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <Cloud className="w-3 h-3" />
      <span>Auto-saved {timeSinceLastSave}</span>
      <Check className="w-3 h-3 text-green-500" />
    </div>
  );
}

