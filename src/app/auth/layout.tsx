import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (session) return redirect("/dashboard");
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
