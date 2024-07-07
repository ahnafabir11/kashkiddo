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
import { redirect, notFound } from "next/navigation";
import TableToolbar from "@/components/table-toolbar";
import TablePagination from "@/components/table-pagination";
import PaymentStatusDropdown from "./payment-status-dropdown";
import { PaginationShchema } from "@/lib/validations/pagination";

export default async function page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Submission Table Pagination
  const result = await PaginationShchema.safeParseAsync(searchParams);

  if (!result.success) {
    redirect(`/dashboard/payments?page=${1}&per_page=${10}`);
  }

  const { page, per_page, search } = result.data;

  // Athentication
  const session = await auth();
  if (!session || !session.user) redirect("/login");
  if (session.user.role !== "ADMIN") notFound();

  // Data Queries
  const paymentCount = await prisma.payment.count({
    where: {
      OR: [
        { userId: { contains: search || "", mode: "insensitive" } },
        { phoneNumber: { contains: search || "", mode: "insensitive" } },
        { user: { name: { contains: search || "", mode: "insensitive" } } },
        { user: { email: { contains: search || "", mode: "insensitive" } } },
      ],
    },
  });

  const payments = await prisma.payment.findMany({
    take: per_page,
    skip: (page - 1) * per_page,
    orderBy: { createdAt: "desc" },
    include: { user: true },
    where: {
      OR: [
        { userId: { contains: search || "", mode: "insensitive" } },
        { phoneNumber: { contains: search || "", mode: "insensitive" } },
        { user: { name: { contains: search || "", mode: "insensitive" } } },
        { user: { email: { contains: search || "", mode: "insensitive" } } },
      ],
    },
  });

  return (
    <main className="space-y-8">
      <TableToolbar />

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
                    status={payment.complete}
                  />
                </TableCell>
                <TableCell>{payment.createdAt.toDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <TablePagination total={paymentCount} page={page} perPage={per_page} />
    </main>
  );
}
