import RoomProvider from "@/components/RoomProvider";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function PageLayout({
  children,
  params: { id },
}: Readonly<{
  children: React.ReactNode;
    params: {
        id: string;
    };
}>) {
  const protectedActionsRedirectUrl =
    "https://immense-caiman-80.accounts.dev/sign-in";

  const { sessionClaims } = await auth();
  if (!sessionClaims) redirect(protectedActionsRedirectUrl);
  return <RoomProvider roomId={id}>{children}</RoomProvider>;
}
