"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, RotateCcw } from "lucide-react";
import { ErrorHandlerService } from "@/services/errorHandler";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const errorService = ErrorHandlerService.getInstance();

  useEffect(() => {
    errorService.logError(error, "GlobalError");
  }, [error, errorService]);

  const errorContent = errorService.getErrorContent("error");

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <Alert variant={errorContent.variant} className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{errorContent.subtitle}</AlertDescription>
      </Alert>
      <Button onClick={reset} className="flex items-center gap-2">
        <RotateCcw className="w-4 h-4" />
        {errorContent.buttonText}
      </Button>
    </div>
  );
}
