import { Hero } from "@repo/components-v1/hero";
import { Paragraph } from "@repo/components-v1/paragraph";
import { Divider } from "@repo/components-v1/divider";
import { BackgroundColor } from "@/components/background-color";
import { getPrivacyPolicyAction } from "@/actions/privacy-policy";
import { redirect } from "next/navigation";
import { formatMMMM_D__YYYY } from "@/utils/date";

export default async function PrivacyPolicyPage() {
  const privacyPolicy = await getPrivacyPolicyAction();

  if (!privacyPolicy) {
    return redirect("/not-found");
  }

  return (
    <BackgroundColor color="var(--black-mamba-400)">
      <Hero
        tag="Privacy Policy"
        headline={privacyPolicy.title}
        meta={formatMMMM_D__YYYY(privacyPolicy.last_updated.toString())}
      />
      <Divider />
      <main className="ss-flex ss-flex-col ss-gap-10 ss-px-4 ss-py-10 sm:ss-max-w-[70vw] sm:ss-px-10 sm:ss-py-10">
        {privacyPolicy.contents.map((privacyPolicy, privacyPolicyIndex) => {
          return (
            <Paragraph
              as="article"
              key={privacyPolicyIndex}
              title={privacyPolicy.title}
              contents={privacyPolicy.contents}
            />
          );
        })}
      </main>
    </BackgroundColor>
  );
}
