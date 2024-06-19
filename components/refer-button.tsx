import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "./ui/input";
import { Button } from "@/components/ui/button";
import { referralBonus } from "@/lib/constants";
import CopyToClipboardButton from "./copy-to-clipboard-button";

interface ReferButtonProps {
  referCode: string;
}

export default function ReferButton({ referCode }: ReferButtonProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button>Refer Code</Button>
      </PopoverTrigger>

      <PopoverContent align="end">
        <div className="flex flex-col space-y-2 text-center sm:text-left mb-4">
          <h3 className="text-lg font-semibold">Refer and Earn</h3>
          <p className="text-sm text-muted-foreground">
            Share your refer code to your friend and earn money. {referralBonus}
            TK per refer
          </p>
        </div>

        <div className="flex space-x-2">
          <Input value={referCode} readOnly />
          <CopyToClipboardButton
            className="shrink-0"
            tooltip="Copy your refer code"
            text={referCode}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
