import { BackgroundColor } from "@/components/background-color";

export default function ContactUsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <BackgroundColor color="var(--purple-widow-900)">
      {children}
    </BackgroundColor>
  );
}