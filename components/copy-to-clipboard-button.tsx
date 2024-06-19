"use client";
import { useEffect, useState } from "react";
import { Button, ButtonProps } from "./ui/button";
import { Clipboard, Check } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CopyToClipboardButtonProps extends ButtonProps {
  text: string;
  tooltip: string;
}

export default function CopyToClipboardButton({
  text,
  tooltip,
  ...props
}: CopyToClipboardButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyText = () => {
    setCopied(!copied);
    navigator.clipboard.writeText(text);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setCopied(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            onClick={handleCopyText}
            {...props}
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Clipboard className="w-4 h-4" />
            )}
          </Button>
        </TooltipTrigger>

        <TooltipContent align="end">
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
