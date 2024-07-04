"use client";

import { useBackgroundColor } from "@/hooks/use-background-color";

export type BackgroundColorProps = {
  color?: string;
  children?: React.ReactNode;
};
export function BackgroundColor({ color, children }: BackgroundColorProps) {
  useBackgroundColor(color);
  return children;
}
