import { type Paragraph as ParagraphType } from "@/types/paragraph";
import { List } from "./list";
import { AutoLinkSentence } from "./auto-link-senctence";

export function Paragraph<T extends React.ElementType = "div">(
  props: { as?: T } & React.ComponentPropsWithoutRef<T> &
    Partial<ParagraphType>,
) {
  const { as: Comp = "div", title, contents } = props;
  return (
    <Comp>
      {title && (
        <h2 className="ss-mb-6 ss-text-balance ss-text-h2 sm:ss-text-h2-sm">
          {title}
        </h2>
      )}
      {contents?.map((content, contentIndex) => {
        return (
          <div key={contentIndex} className="ss-mb-6 last:ss-mb-0">
            <p className="ss-whitespace-pre-line ss-text-balance ss-text-p sm:ss-text-p-sm">
              <AutoLinkSentence>{content.paragraph}</AutoLinkSentence>
            </p>
            <List type={content.list?.type} items={content.list?.items} />
          </div>
        );
      })}
    </Comp>
  );
}