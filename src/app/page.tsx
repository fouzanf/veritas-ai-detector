import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { LandingClient } from "@/components/LandingClient";

export default async function LandingPage() {
  const session = await getServerSession(authOptions);

  return <LandingClient session={session} />;
}
