"use client";

import { ChevronDownIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { ReactLenis, useLenis } from "@repo/smooth-scroll/lenis";
import { Navbar as NavBarV1 } from "@repo/components-v1/nav-bar";
import { usePathname, useSearchParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@repo/components-v1/dropdown-menu";
import { NavButton, NavButtonProps } from "@repo/components-v1/nav-button";
import { HoooreLogo } from "./hooore-logo";
import Link from "next/link";
import { SocialProps } from "@repo/components-v1/types/social";

function shouldButtonActive(
  href: string,
  pathname?: string,
  startWith?: boolean,
) {
  return (startWith && pathname?.startsWith(href)) || pathname === href;
}

type NavButtonLinkProps = NavButtonProps & {
  href: string;
  pathname?: string;
  startWith?: boolean;
};

function NavButtonLink({
  href,
  pathname,
  startWith,
  children,
  ...props
}: NavButtonLinkProps) {
  return (
    <NavButton
      {...props}
      isActive={shouldButtonActive(href, pathname, startWith)}
    >
      <Link href={href}>{children}</Link>
    </NavButton>
  );
}

export type NavbarProps = {
  socials?: SocialProps[];
};

export function Navbar({ socials }: NavbarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lenis = useLenis();
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    if (isOpen) {
      lenis?.start();
    } else {
      lenis?.stop();
    }

    setIsOpen((isOpen) => {
      return !isOpen;
    });
  };

  useEffect(() => {
    setIsOpen(false);
    lenis?.start();
  }, [pathname, searchParams]);

  return (
    <NavBarV1
      isOpen={isOpen}
      toggleOpen={toggleOpen}
      socials={socials}
      businessLogo={
        <HoooreLogo className="ss-h-[28px] ss-w-[89px] sm:ss-h-[48px] sm:ss-w-[152px]" />
      }
    >
      <ReactLenis className="ss-overflow-scroll sm:ss-overflow-visible">
        <div className="ss-flex ss-flex-[2_2_0%] ss-flex-col ss-gap-2 sm:ss-flex-row sm:ss-gap-6">
          <NavButtonLink href="/" pathname={pathname}>
            Home
          </NavButtonLink>
          <div className="ss-hidden sm:ss-block">
            <DropdownMenu>
              <NavButton
                isActive={shouldButtonActive("/service", pathname, true)}
              >
                <DropdownMenuTrigger>
                  Services
                  <ChevronDownIcon className="ss-h-4 ss-w-4" />
                </DropdownMenuTrigger>
              </NavButton>
              <DropdownMenuContent
                align="start"
                className="ss-flex ss-flex-col"
              >
                <NavButtonLink
                  href="/service/software-development"
                  pathname={pathname}
                >
                  Software Development
                </NavButtonLink>
                <NavButtonLink href="/service/ui-ux-design" pathname={pathname}>
                  UI/UX Design
                </NavButtonLink>
                <NavButtonLink
                  href="/service/training-upskilling"
                  pathname={pathname}
                >
                  Training & Upskilling
                </NavButtonLink>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="ss-block ss-border-2 ss-border-transparent ss-p-2 sm:ss-hidden">
            <NavButton
              isActive={shouldButtonActive("/service", pathname, true)}
            >
              <span className="ss-block ss-w-full">Services</span>
            </NavButton>
            <div className="ss-flex ss-flex-col ss-py-2 ss-pl-8">
              <NavButtonLink
                href="/service/software-development"
                pathname={pathname}
              >
                Software Development
              </NavButtonLink>
              <NavButtonLink href="/service/ui-ux-design" pathname={pathname}>
                UI/UX Design
              </NavButtonLink>
              <NavButtonLink
                href="/service/training-upskilling"
                pathname={pathname}
              >
                Training & Upskilling
              </NavButtonLink>
            </div>
          </div>
          {/* <NavButtonLink href="/portfolio" pathname={pathname}>
            Portfolio
          </NavButtonLink>
          <NavButtonLink href="/blog" pathname={pathname}>
            Blog
          </NavButtonLink> */}
          <NavButtonLink href="/about-us" pathname={pathname}>
            About Us
          </NavButtonLink>
          <NavButtonLink href="/contact-us" pathname={pathname}>
            Contact
          </NavButtonLink>
        </div>
      </ReactLenis>
    </NavBarV1>
  );
}
