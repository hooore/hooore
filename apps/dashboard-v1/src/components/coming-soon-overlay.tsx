import { cn } from "@repo/utils";

export function ComingSoonOverlay<T extends React.ElementType>(
  props: {
    as?: T;
  } & React.ComponentPropsWithoutRef<T>,
) {
  const { as: Comp = "div", children, className, ...restProps } = props;
  return (
    <Comp
      {...restProps}
      className={cn("dd-relative dd-overflow-hidden", className)}
    >
      {children}
      <div className="dd-absolute dd-left-0 dd-top-0 dd-flex dd-h-full dd-w-full dd-cursor-not-allowed dd-items-center dd-justify-center dd-bg-black/50">
        <span className="dd-text-xl dd-font-bold dd-text-white">
          Coming Soon
        </span>
      </div>
    </Comp>
  );
}
