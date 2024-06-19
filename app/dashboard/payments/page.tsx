import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import prisma from "@/lib/db";
import TableToolbar from "../users/table-toolbar";
import PaymentStatusDropdown from "./payment-status-dropdown";
import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";

export default async function page({
  searchParams,
}: {
  searchParams: { search: string };
}) {
  const session = await auth();
  if (!session || !session.user) redirect("/login");
  if (session.user.role !== "ADMIN") notFound();

  const payments = await prisma.payment.findMany({
    include: { user: true },
    where: {
      OR: [
        { id: { contains: searchParams.search ?? "" } },
        { userId: { contains: searchParams.search ?? "" } },
        { phoneNumber: { contains: searchParams.search ?? "" } },
        { user: { name: { contains: searchParams.search ?? "" } } },
        { user: { email: { contains: searchParams.search ?? "" } } },
      ],
    },
  });

  return (
    <div>
      <div className="mb-4">
        <TableToolbar />
      </div>

      <div className="rounded-md border">
        <Table className="whitespace-nowrap">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Complete</TableHead>
              <TableHead>Request Date</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>
                  <p>{payment.user.name}</p>
                  <small>{payment.user.id}</small>
                </TableCell>
                <TableCell>{payment.amount}</TableCell>
                <TableCell>{payment.phoneNumber}</TableCell>
                <TableCell>
                  <PaymentStatusDropdown
                    paymentId={payment.id}
                    value={payment.complete}
                  />
                </TableCell>
                <TableCell>{payment.createdAt.toDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}