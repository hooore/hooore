import { cn } from "@repo/utils";
import { Button } from "./common/button";
import type { Footer1Props } from "../types/footer-1";
import { renderIcon } from "@repo/icon/map";

const linksClassName =
  "pc-flex pc-w-full pc-flex-wrap pc-items-center pc-justify-center pc-gap-x-6 sm:pc-justify-start";

export function Footer1(
  props: Footer1Props & {
    logo?: string;
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
                    <a href={disableLink ? undefined : link?.link}>
                      {link?.label}
                    </a>
                  </Button>
                );
              })}
            </div>
          )}
          {socials && (
            <div className={cn("pc-mb-8 pc-p-2 sm:pc-mb-0", linksClassName)}>
              {socials.map((social, socialIndex) => {
                return (
                  <a
                    target="_blank"
                    rel="noreferrer noopener"
                    key={socialIndex}
                    href={disableLink ? undefined : social?.link}
                  >
                    {renderIcon(social?.slug || "", { className: "h-4 w-4" })}
                  </a>
                );
              })}
            </div>
          )}
        </div>
        {logo && (
          <img
            src={logo}
            className="pc-h-[28px] pc-w-[89px] sm:pc-h-[48px] sm:pc-w-[152px]"
          />
        )}
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
                <a href={disableLink ? undefined : additionalLink?.link}>
                  {additionalLink?.label}
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