import { cn } from "@repo/utils";
import { Button } from "./button";
import { FooterProps } from "../types/footer";

const linksClassName =
  "pc-flex pc-w-full pc-flex-wrap pc-items-center pc-justify-center pc-gap-x-6 sm:pc-justify-start";

export function Footer(
  props: FooterProps & {
    socials?: React.ReactNode;
    logo?: React.ReactNode;
    copyright?: string;
    disableLink?: boolean;
    className?: string;
  },
) {
  const {
    link,
    additional_link,
    socials,
    logo,
    copyright,
    className,
    disableLink = false,
  } = props;

  return (
    <footer
      className={cn(
        "pc-bg-black-mamba-500/25 pc-px-4 pc-py-10 sm:pc-px-20 sm:pc-py-20",
        className,
      )}
    >
      <div className="pc-mb-10 pc-flex pc-flex-col pc-items-center pc-justify-between sm:pc-flex-row sm:pc-items-start">
        <div>
          {link && (
            <div className={cn("pc-mb-8 sm:pc-mb-2", linksClassName)}>
              {link.map((link, linkIndex) => {
                return (
                  <Button
                    key={linkIndex}
                    asChild
                    variant="link"
                    className="pc-justify-center"
                  >
                    <a href={disableLink ? undefined : link.link}>
                      {link.label}
                    </a>
                  </Button>
                );
              })}
            </div>
          )}
          {socials && (
            <div className={cn("pc-mb-8 sm:pc-mb-0", linksClassName)}>
              {socials}
            </div>
          )}
        </div>
        {logo}
      </div>
      {additional_link && (
        <div className={cn("pc-text-crema-cream-800", linksClassName)}>
          {additional_link.map((additionalLink, additionalLinkIndex) => {
            return (
              <Button
                key={additionalLinkIndex}
                asChild
                variant="link"
                className="pc-justify-center"
              >
                <a href={disableLink ? undefined : additionalLink.link}>
                  {additionalLink.label}
                </a>
              </Button>
            );
          })}
          {copyright && <p>{copyright}</p>}
        </div>
      )}
    </footer>
  );
}
