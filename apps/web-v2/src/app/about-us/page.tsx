import { Button } from "@/components/button";
import { Chip } from "@/components/chip";
import { Content3 } from "@/components/content3";
import { Content4 } from "@/components/content4";
import { Hero } from "@/components/hero";
import { HoooreLogo } from "@/components/hooore-logo";
import { ServiceCard } from "@/components/service-card";
import { SimpleCard } from "@/components/simple-card";
import { Spotlight } from "@/components/spotlight";
import Link from "next/link";
import servicesList from "../data/services-list.json";

export default function AboutUs() {
  return (
    <>
      <Hero
        header={<Chip>About Us</Chip>}
        title={
          <>
            Welcome to <HoooreLogo className="ss-inline" />
          </>
        }
        description="At Hooore, we are passionate about delivering happiness through technology. We specialize in crafting exceptional applications, designing intuitive user interfaces and experiences, and empowering individuals and teams through comprehensive training and upskilling programs."
        background={
          <div className="ss-absolute ss-left-0 ss-top-0 ss-h-full ss-w-full">
            <Spotlight gradientColor="rgba(var(--page-background))">
              <div className="ss-h-full ss-w-full ss-bg-[url('/robot-team.png')] ss-bg-contain ss-bg-bottom ss-bg-no-repeat ss-fill-none ss-brightness-50 sm:ss-bg-cover sm:ss-bg-[center_65%]"></div>
            </Spotlight>
          </div>
        }
      />
      <Content3
        title="Hooore offers a wide range of services tailored to meet the diverse needs of our clients"
        footer={
          <div className="ss-flex ss-flex-col ss-gap-6 sm:ss-flex-row sm:ss-gap-12">
            {servicesList.services.map(
              ({
                thumbnailUrl,
                thumbnailAlt,
                backgroundColor,
                title,
                description,
                link,
              }) => (
                <ServiceCard
                  key={title}
                  thumbnailUrl={thumbnailUrl}
                  thumbnailAlt={thumbnailAlt}
                  backgroundColor={backgroundColor}
                  className="ss-flex-1"
                  title={title}
                  description={description}
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
      <Content4
        className="ss-border-t-2 ss-border-t-crema-cream-500"
        title="Our Commitment"
        description="Hooore is dedicated to ethical business practices, sustainability, and making a positive impact in the communities we serve. We believe in fostering long-term relationships built on trust, transparency, and mutual respect."
      />
      <Content4
        className="ss-border-t-2 ss-border-t-crema-cream-500"
        title="Why Choose Us?"
        footer={
          <div className="ss-flex ss-flex-col sm:ss-flex-row">
            <SimpleCard
              className="ss-flex-1 ss-bg-green-nyai-500"
              title="Expertise"
              description="With 5+ years of experience in the industry, our team brings deep technical expertise and creativity to every project."
            />
            <SimpleCard
              className="ss-flex-1 ss-bg-blue-clair-700"
              title="Innovation"
              description="We thrive on innovation, constantly exploring new technologies and approaches to deliver cutting-edge solutions."
            />
            <SimpleCard
              className="ss-flex-1 ss-bg-oranje-600"
              title="Customer-Centric"
              description="Our clients' success is our priority. We listen closely to their needs and goals, tailoring solutions that exceed expectations."
            />
          </div>
        }
      />
      <Content4
        className="ss-border-t-2 ss-border-t-crema-cream-500"
        title="Our Agile Approach"
        description={
          "At Hooore, agility is at the core of our operations. We embrace Agile methodologies to ensure flexibility, collaboration, and rapid delivery of high-quality solutions.\n\nBy iterating quickly and responding promptly to changes, we empower our clients to stay ahead in a dynamic environment."
        }
      />
      <section className="ss-border-t-2 ss-border-t-crema-cream-500 ss-px-4 ss-py-10 sm:ss-px-20 sm:ss-py-20">
        <p className="ss-whitespace-pre-line ss-text-center ss-text-xl sm:ss-text-3xl">
          Thank you for considering Hooore as our technology partner.{"\n"}
          Together, let&apos;s create a future where innovation meets happiness.
        </p>
      </section>
    </>
  );
}
