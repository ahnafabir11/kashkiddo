import type { Editor } from "@tiptap/core";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, ListIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ToolbarButton } from "./toolbar-button";
import { activeItemClass, DropdownMenuItemClass } from "../utils";
import { ShortcutKey } from "./shortcut-key";

export default function SectionThree({ editor }: { editor: Editor }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ToolbarButton
          isActive={
            editor.isActive("bulletList") || editor.isActive("orderedList")
          }
          tooltip="Lists"
          className="w-12"
        >
          <ListIcon className="size-5" />
          <ChevronDownIcon className="size-5" />
        </ToolbarButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-full">
        <DropdownMenuItem
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(DropdownMenuItemClass, {
            [activeItemClass]: editor.isActive("orderedList"),
          })}
          aria-label="Numbered list"
        >
          <span className="grow">Numbered list</span>
          <ShortcutKey keys={["mod", "shift", "7"]} />
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(DropdownMenuItemClass, {
            [activeItemClass]: editor.isActive("bulletList"),
          })}
          aria-label="Bullet list"
        >
          <span className="grow">Bullet list</span>
          <ShortcutKey keys={["mod", "shift", "8"]} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
