import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, ReactNode, RefAttributes } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AnalyticsCardProps {
  label: string;
  className?: string;
  description: string;
  amount: string | number | ReactNode;
  Icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
}

export default function AnalyticsCard({
  Icon,
  label,
  amount,
  className,
  description,
}: AnalyticsCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{amount}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
