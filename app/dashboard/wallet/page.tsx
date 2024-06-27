import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from "@/components/ui/table";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import AnalyticsCard from "@/components/analytics-card";
import { lastDayOfMonth, startOfMonth } from "date-fns";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import WithdrawRequestDialog from "@/components/withdraw-request-dialog";

export default async function page() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) redirect("/login");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });

  const withdrawRequests = await prisma.payment.findMany({
    where: {
      userId: session.user.id,
      createdAt: {
        gte: startOfMonth(new Date()),
        lte: lastDayOfMonth(new Date()),
      },
    },
  });

  const transactions = await prisma.tansaction.findMany({
    where: {
      userId: session.user.id,
      createdAt: {
        gte: startOfMonth(new Date()),
        lte: lastDayOfMonth(new Date()),
      },
    },
  });

  const earningCount = transactions
    .filter((transaction) => transaction.type === "INCOME")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const withdrawCount = transactions
    .filter((transaction) => transaction.reason === "WITHDRAW")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <AnalyticsCard
          label="Balance"
          Icon={DollarSign}
          amount={user?.balance ?? 0}
          description="Current Balance"
          className="flex-1"
        />
        <AnalyticsCard
          label="Earnings"
          Icon={TrendingUp}
          amount={earningCount}
          description="Earnings this month"
          className="flex-1"
        />
        <AnalyticsCard
          Icon={TrendingDown}
          label="Withdrawals"
          amount={withdrawCount}
          description="Withdrawals this month"
          className="flex-1"
        />
      </div>

      <div className="flex justify-end mb-4">
        <WithdrawRequestDialog
          className="w-full sm:w-auto"
          balance={user?.balance || 0}
          withdrawCount={withdrawRequests.length}
        />
      </div>

      <div className="rounded-md border">
        <Table className="whitespace-nowrap">
          <TableHeader>
            <TableRow>
              <TableHead>Requeted At</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Approved</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {withdrawRequests.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.createdAt.toDateString()}</TableCell>
                <TableCell>{payment.amount}</TableCell>
                <TableCell>{payment.phoneNumber}</TableCell>
                <TableCell>
                  <Badge
                    className="uppercase"
                    variant={payment.complete ? "default" : "outline"}
                  >
                    {payment.complete ? "Approved" : "Pending"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
