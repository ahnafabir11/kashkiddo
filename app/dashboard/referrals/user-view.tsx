import ReferButton from "@/components/refer-button";
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
import { Badge } from "@/components/ui/badge";

export default async function UserView({
  referredById,
  searchString,
}: {
  referredById: string;
  searchString: string;
}) {
  const referrals = await prisma.referral.findMany({
    include: { referredTo: true },
    where: {
      referredById,
      OR: [
        { referredTo: { name: { contains: searchString } } },
        { referredTo: { email: { contains: searchString } } },
      ],
    },
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-4">
        <TableToolbar />
        <ReferButton referCode={referredById} />
      </div>

      <div className="rounded-md border">
        <Table className="whitespace-nowrap">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Active</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {referrals.map((referral) => (
              <TableRow key={referral.id}>
                <TableCell>
                  <p>{referral.referredTo.name}</p>
                  <small>{referral.referredTo.id}</small>
                </TableCell>
                <TableCell>{referral.referredTo.email}</TableCell>
                <TableCell>
                  <Badge
                    className="uppercase"
                    variant={
                      referral.referredTo.active ? "default" : "secondary"
                    }
                  >
                    {referral.referredTo.active.toString()}
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
