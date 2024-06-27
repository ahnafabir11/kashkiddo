import {
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  TableHeader,
} from "@/components/ui/table";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import TableToolbar from "@/components/table-toolbar";
import ActiveStatusDropdown from "../users/active-status-dropdown";
import ActiveRequestStatusDropdownProps from "./active-request-status-dropdown";

export default async function page({
  searchParams,
}: {
  searchParams: { search: string };
}) {
  const session = await auth();
  if (!session || !session.user) redirect("/login");
  if (session.user.role !== "ADMIN") notFound();

  const activations = await prisma.activation.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { include: { referredBy: { include: { referredBy: true } } } },
    },
    where: {
      OR: [
        { id: { contains: searchParams.search ?? "" } },
        { userId: { contains: searchParams.search ?? "" } },
        { phoneNumber: { contains: searchParams.search ?? "" } },
        { transactionId: { contains: searchParams.search ?? "" } },
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
              <TableHead>Phone Number</TableHead>
              <TableHead>Tansaction ID</TableHead>
              <TableHead>Referred By</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Complete</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {activations.map((request) => (
              <TableRow key={request.id}>
                <TableCell>
                  <p>{request.user.name}</p>
                  <small>{request.user.id}</small>
                </TableCell>
                <TableCell>{request.phoneNumber}</TableCell>
                <TableCell>{request.transactionId}</TableCell>
                <TableCell>
                  <p>{request.user.referredBy?.referredBy.name}</p>
                  <small>{request.user.referredBy?.referredBy.id}</small>
                </TableCell>
                <TableCell>
                  <ActiveStatusDropdown
                    userId={request.userId}
                    status={request.user.active}
                  />
                </TableCell>
                <TableCell>
                  <ActiveRequestStatusDropdownProps
                    requestId={request.id}
                    status={request.complete}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
