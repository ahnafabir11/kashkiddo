import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

interface TaskSubmissionProps {
  screenshots: string[];
  description: null | string;
}

export default function TaskSubmission({
  screenshots,
  description,
}: TaskSubmissionProps) {
  return (
    <div>
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight text-center">
        Your Submission
      </h4>

      <div className="grid gap-2 mb-4">
        <Label>Description</Label>
        <Textarea readOnly value={description || ""} />
      </div>

      <div className="grid gap-2">
        <Label>Screenshots</Label>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-2">
          {screenshots.map((url, idx) => (
            <AspectRatio
              key={idx}
              ratio={9 / 16}
              className="bg-muted border rounded-md"
            >
              <Image
                fill
                src={url}
                alt="Task screentshot"
                className="rounded-md object-center"
              />
            </AspectRatio>
          ))}
        </div>
      </div>
    </div>
  );
}
