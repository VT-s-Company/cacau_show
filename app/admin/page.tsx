import { redirect } from "next/navigation";
import { ADMIN_ROUTE_HASH } from "@/lib/admin-config";

export default function AdminRootPage() {
  redirect(`/admin/${ADMIN_ROUTE_HASH}/login`);
}
