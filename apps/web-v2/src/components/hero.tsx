import { OutlineText } from "./outline-text";

export type HeroProps = {
  background?: React.ReactNode;
  header?: React.ReactNode;
  title?: React.ReactNode;
  description?: string;
  footer?: React.ReactNode;
};

export function Hero({
  background,
  header,
  title,
  description,
  footer,
}: HeroProps) {
  return (
    <header className="ss:ss-pb-[calc(var(--navbar-height-desktop)*2)] ss-relative ss-flex ss-h-full ss-px-10 ss-pb-[calc(var(--navbar-height-mobile)*1.5)] ss-pt-[calc(var(--navbar-height-mobile)*2)] sm:ss-min-h-[560px] sm:ss-pb-[calc(var(--navbar-height-desktop))] sm:ss-pt-[calc(var(--navbar-height-desktop)*2)]">
      {background}
      <div className="ss-z-10 ss-flex ss-w-full ss-flex-col ss-gap-6">
        {header && (
          <div className="ss-flex ss-justify-center sm:ss-justify-start">
            {header}
          </div>
        )}
        <h1 className="ss-whitespace-pre-line ss-text-center ss-text-4xl ss-leading-tight sm:ss-text-left sm:ss-text-7xl">
          <OutlineText>{title}</OutlineText>
        </h1>
        {description && (
          <p className="ss-text-center ss-text-xl sm:ss-text-start sm:ss-text-3xl">
            <OutlineText>{description}</OutlineText>
          </p>
        )}
        {footer && <div>{footer}</div>}
      </div>
    </header>
  );
}
