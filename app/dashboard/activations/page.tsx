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
import StatusDropdown from "../users/status-dropdown";
import ActivationStatusDropdown from "./activation-status-dropdown";
import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";

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
                  <StatusDropdown
                    type="active"
                    userId={request.userId}
                    value={request.user.active}
                  />
                </TableCell>
                <TableCell>
                  <ActivationStatusDropdown
                    requestId={request.id}
                    value={request.complete}
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
