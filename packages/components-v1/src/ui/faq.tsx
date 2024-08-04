import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";
import { FAQProps } from "../types/faq";
import { Chip } from "./chip";
import { AutoLinkSentence } from "./auto-link-senctence";

export function FAQ({ caption, faq, headline, tag }: FAQProps) {
  return (
    <section className="pc-flex pc-h-full pc-w-full pc-flex-col pc-items-center pc-px-4 pc-py-10 sm:pc-flex-row sm:pc-items-start sm:pc-px-20 sm:pc-py-20">
      {(tag || headline) && (
        <div className="pc-flex pc-w-full pc-flex-col pc-gap-6 sm:pc-mr-12 sm:pc-w-fit">
          {tag && (
            <div className="pc-flex pc-justify-center pc-gap-1 sm:pc-justify-start">
              <Chip>{tag}</Chip>
            </div>
          )}
          {headline && (
            <h2 className="pc-whitespace-pre-line pc-text-balance pc-text-center pc-text-h2 sm:pc-text-left sm:pc-text-h2-sm">
              {headline}
            </h2>
          )}
        </div>
      )}
      {(faq || caption) && (
        <div className="pc-flex pc-h-full pc-flex-col pc-items-center pc-gap-10 sm:pc-items-start">
          {faq && (
            <Accordion type="single" collapsible>
              {faq.map((faq, faqIndex) => {
                return (
                  <AccordionItem key={faqIndex} value={faqIndex.toString()}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>
                      <div className="pc-mb-6 last:pc-mb-0">
                        <p className="pc-whitespace-pre-line pc-text-balance pc-text-p sm:pc-text-p-sm">
                          <AutoLinkSentence>{faq.answer}</AutoLinkSentence>
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
          {caption && (
            <p className="pc-text-center pc-text-p sm:pc-text-p-sm">
              {caption}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
