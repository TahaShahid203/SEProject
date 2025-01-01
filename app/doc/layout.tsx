import LiveBlocksProvider from "@/components/LiveblocksProvider";

export default function PageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <LiveBlocksProvider>{children}</LiveBlocksProvider>;
}
