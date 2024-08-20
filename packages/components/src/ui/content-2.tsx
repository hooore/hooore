import { cn } from "@repo/utils";
import { Content2Props } from "../types/content-2";

export function Content2(props: Content2Props & { className?: string }) {
  const { headline, content, className } = props;

  return (
    <section
      className={cn(
        "pc-flex pc-h-full pc-w-full pc-flex-col pc-items-center pc-px-4 pc-py-10 sm:pc-flex-row sm:pc-items-start sm:pc-px-20 sm:pc-py-20",
        className,
      )}
    >
      {headline && (
        <div className="pc-flex pc-w-full pc-flex-col pc-gap-6 sm:pc-mr-12 sm:pc-w-fit">
          <h2 className="pc-mb-6 pc-whitespace-pre-line pc-text-balance pc-text-center pc-text-h2 sm:pc-mb-0 sm:pc-text-left sm:pc-text-h2-sm">
            {headline}
          </h2>
        </div>
      )}
      {content && (
        <div className="pc-flex pc-h-full pc-flex-col pc-items-center pc-gap-10 sm:pc-items-start sm:pc-pt-40">
          <div className="pc-flex pc-flex-col pc-overflow-hidden pc-rounded-lg pc-border sm:pc-flex-row">
            {content.map((content, contentIndex) => {
              return (
                <div
                  key={contentIndex}
                  className="pc-flex pc-w-full pc-flex-1 pc-flex-col pc-gap-6 pc-border-b pc-p-6 last:pc-border-b-0 sm:pc-aspect-square sm:pc-gap-10 sm:pc-border-b-0 sm:pc-border-r sm:last:pc-border-b-0 sm:last:pc-border-r-0"
                >
                  {content?.headline && (
                    <h3 className="pc-text-balance pc-text-center pc-text-h2 sm:pc-text-start sm:pc-text-h2-sm">
                      {content.headline}
                    </h3>
                  )}
                  {content?.description && (
                    <p className="pc-text-balance pc-text-center pc-text-p sm:pc-text-start sm:pc-text-p-sm">
                      {content.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}