import { cn } from "@repo/utils";

export type SideBarItemProps = React.ComponentProps<"div"> & {
  children?: React.ReactNode;
  label?: React.ReactNode;
  parentHeight?: boolean;
};

export function SideBarItem({
  label,
  children,
  parentHeight = false,
  ...restProps
}: SideBarItemProps) {
  return (
    <div {...restProps}>
      <div
        className={cn(
          "dd-relative dd-mb-1 dd-flex dd-select-none dd-overflow-hidden dd-bg-slate-100",
          parentHeight ? "dd-h-full" : "dd-h-[100px]",
        )}
      >
        {children}
        <div className="dd-absolute dd-left-0 dd-top-0 dd-h-full dd-w-full"></div>
      </div>
      <span className="dd-block dd-text-center">{label}</span>
    </div>
  );
}
