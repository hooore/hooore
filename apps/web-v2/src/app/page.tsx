import { AirbnbLogo } from "@/components/airbnb-logo";
import { AmazonLogo } from "@/components/amazon-logo";
import { AsanaLogo } from "@/components/asana-logo";
import { Button } from "@/components/button";
import { Chip } from "@/components/chip";
import { Content3 } from "@/components/content3";
import { Content4 } from "@/components/content4";
import { CTA } from "@/components/cta";
import { EvernoteLogo } from "@/components/evernote-logo";
import { FramerLogo } from "@/components/framer-logo";
import { Hero } from "@/components/hero";
import { Marquee } from "@/components/marquee";
import { ServiceCard } from "@/components/service-card";
import { SocialMediaLinks } from "@/components/social-media-links";
import { UpworkLogo } from "@/components/upwork-logo";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/accordion";
import Link from "next/link";
import { BackgroundColor } from "@/components/background-color";
import servicesList from "./data/services-list.json";
import faqJSON from "./data/faq.json";
import { Paragraph as ParagraphType } from "@/types/paragraph";
import { Paragraph } from "@/components/paragraph";
import { Fragment } from "react";
import { Spotlight } from "@/components/spotlight";

const faqs = faqJSON as ParagraphType[];

export default function Home() {
  return (
    <BackgroundColor color="var(--black-mamba-400)">
      <Hero
        background={
          <div className="ss-absolute ss-left-0 ss-top-0 ss-h-full ss-w-full">
            <Spotlight gradientColor="rgba(var(--page-background))">
              <div className="ss-h-full ss-w-full ss-bg-[url('/sunrise.png')] ss-bg-cover ss-bg-[center_65%] ss-bg-no-repeat ss-fill-none ss-brightness-75"></div>
            </Spotlight>
          </div>
        }
        header={<span className="ss-text-2xl">Hooore /ho·re/ /horé/</span>}
        title={"Turning Tech Dreams\ninto Happy Realities"}
        footer={
          <div className="ss-flex ss-flex-wrap ss-justify-center ss-gap-x-6 sm:ss-justify-start">
            <SocialMediaLinks />
          </div>
        }
      />
      <section className="ss-flex ss-h-[100px] ss-w-full ss-items-center">
        <Marquee>
          {[
            { component: AirbnbLogo, alt: "Airbnb Logo" },
            { component: AmazonLogo, alt: "Amazon Logo" },
            { component: AsanaLogo, alt: "Asana Logo" },
            { component: EvernoteLogo, alt: "Evernote Logo" },
            { component: FramerLogo, alt: "Framer Logo" },
            { component: UpworkLogo, alt: "Upwork Logo" },
          ].map((logo, logoIndex) => {
            const LogoComponent = logo.component;
            return (
              <LogoComponent
                key={logoIndex}
                alt={logo.alt}
                width={150}
                height={50}
                className="ss-h-full ss-w-full"
              />
            );
          })}
        </Marquee>
      </section>
      <Content3
        className="ss-border-t-2 ss-border-t-crema-cream-500"
        header={<Chip>Services</Chip>}
        title="Where the joy meets technology."
        description="We believe in the power of innovation to bring happiness and excitement to our clients. Our mission is to deliver exceptional digital solutions that exceed expectations and inspire delight."
        footer={
          <div className="ss-flex ss-flex-col ss-gap-6 sm:ss-flex-row sm:ss-gap-12">
            {servicesList.services.map(
              ({
                thumbnailUrl,
                thumbnailAlt,
                backgroundColor,
                title,
                items,
                link,
              }) => (
                <ServiceCard
                  key={title}
                  thumbnailUrl={thumbnailUrl}
                  thumbnailAlt={thumbnailAlt}
                  backgroundColor={backgroundColor}
                  className="ss-flex-1"
                  title={title}
                  items={items}
                  footer={
                    <Button
                      asChild
                      variant="outline"
                      className="ss-justify-center sm:ss-w-fit"
                    >
                      <Link href={link}>Learn More</Link>
                    </Button>
                  }
                />
              ),
            )}
          </div>
        }
      />
      <CTA />
      <Content4
        header={<Chip>FAQ</Chip>}
        title="Questions and Some Answers"
        pushContent={false}
        footer={
          <p className="ss-text-center ss-text-xl sm:ss-text-left">
            Still have any question? Feel free to reach out hi@hooore.com
          </p>
        }
        content={
          <Accordion type="single" collapsible>
            {faqs.map((faq, faqIndex) => {
              return (
                <AccordionItem key={faqIndex} value={faqIndex.toString()}>
                  <AccordionTrigger>{faq.title}</AccordionTrigger>
                  <AccordionContent>
                    <Paragraph as={Fragment} contents={faq.contents} />
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        }
      />
    </BackgroundColor>
  );
}
