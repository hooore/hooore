import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/login");
  }

  if (user.email === "admin@admin.com") {
    return redirect("/first-setup");
  }

  return children;
}
