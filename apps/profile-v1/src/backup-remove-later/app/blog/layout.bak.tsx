import { BackgroundColor } from "@/backup-remove-later/components/background-color";

export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <BackgroundColor color="var(--black-mamba-400)">{children}</BackgroundColor>
  );
}
