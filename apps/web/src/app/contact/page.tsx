import { Footer } from "@/components/footer";
import { Section } from "@/components/section";
import {
  ArrowTopRightIcon,
  EnvelopeClosedIcon,
  InstagramLogoIcon,
  LinkedInLogoIcon,
} from "@radix-ui/react-icons";
import { Button } from "@repo/component/button";
import Link from "next/link";

export default function ContactPage() {
  return (
    <>
      <form className="mx-[3vw] mb-2 flex w-[94vw] sm:mx-[5vw] sm:w-[90vw]">
        <Section layout="horiozontal" title="Have a cool project for us?">
          <div>
            <span>I’m interested in</span>
          </div>
          <div>
            <span>Enter your contact info</span>
          </div>
          <div>
            <span>Tell Us About Your Project</span>
          </div>
          <div>
            <span>Your Project Budget</span>
          </div>
          <div>
            <Button>
              Submit <ArrowTopRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Section>
      </form>
      <Footer
        className="mx-[3vw] w-[94vw] sm:mx-[5vw] sm:w-[90vw]"
        links={
          <>
            <Button variant="text" asChild>
              <Link href="/">Beranda</Link>
            </Button>
            <Button variant="text" asChild>
              <Link href="/contact">Kontak</Link>
            </Button>
          </>
        }
        social={
          <>
            <Button variant="text">
              <EnvelopeClosedIcon className="mr-2 h-4 w-4" /> email@email.com
            </Button>
            <Button variant="text">
              <InstagramLogoIcon className="mr-2 h-4 w-4" /> Instagram
            </Button>
            <Button variant="text">
              <LinkedInLogoIcon className="mr-2 h-4 w-4" /> LinkedIn
            </Button>
          </>
        }
      />
    </>
  );
}
