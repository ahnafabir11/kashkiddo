import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ReferButton from "@/components/refer-button";
import TableToolbar from "@/components/table-toolbar";
import UserReferralTable from "./user-referral-table";
import AdminReferralTable from "./admin-referral-table";
import { PaginationShchema } from "@/lib/validations/pagination";

export default async function page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Submission Table Pagination
  const result = await PaginationShchema.safeParseAsync(searchParams);

  if (!result.success) {
    redirect(`/dashboard/referrals?page=${1}&per_page=${10}`);
  }

  const { page, per_page, search } = result.data;

  // Athentication
  const session = await auth();
  if (!session || !session.user || !session.user.id) redirect("/login");
  const isAdmin = session.user.role === "ADMIN";

  return (
    <main className="space-y-8">
      <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-4">
        <TableToolbar />
        <ReferButton referCode={session.user.id} />
      </div>

      {isAdmin ? (
        <AdminReferralTable
          page={page}
          perPage={per_page}
          searchString={search || ""}
        />
      ) : (
        <UserReferralTable
          page={page}
          perPage={per_page}
          searchString={search || ""}
          referredById={session.user.id}
        />
      )}
    </main>
  );
}
