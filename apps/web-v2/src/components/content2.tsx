import { cn } from "@repo/utils";

export type Content2Item = {
  title?: string;
  description?: string;
};

export type Content2Props = {
  number?: number;
  title?: string;
  items?: Content2Item[];
  className?: string;
};

export function Content2({ items, number, title, className }: Content2Props) {
  return (
    <div
      className={cn(
        "ss-flex ss-flex-col ss-gap-6 ss-px-4 ss-py-10 sm:ss-flex-row sm:ss-gap-12 sm:ss-px-20 sm:ss-py-20",
        className,
      )}
    >
      {number && (
        <span className="ss-w-full ss-flex-1 ss-text-7xl sm:ss-w-1/4 sm:ss-text-9xl">
          {number}
        </span>
      )}
      {title && (
        <h3
          className={cn(
            "ss-text-4xl",
            items
              ? "ss-w-full ss-flex-1 sm:ss-w-1/4"
              : "ss-flex-2 ss-w-full sm:ss-w-3/4",
          )}
        >
          {title}
        </h3>
      )}
      {items && (
        <div className="ss-flex-2 ss-grid ss-w-full ss-grid-cols-1 ss-gap-6 sm:ss-w-2/4 sm:ss-grid-cols-2 sm:ss-gap-12">
          {items.map((item, index) => {
            return (
              <div key={index}>
                <h4 className="ss-text-lg ss-font-semibold">{item.title}</h4>
                <p>{item.description}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
