import { z } from "zod";

export const contactUsSchema = z.object({
  name: z.string().min(1, {
    message: "Please fill your name.",
  }),
  email: z
    .string()
    .email({
      message: "Please fill a valid email.",
    })
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .min(1, {
      message: "Please fill your contact number.",
    })
    .regex(/^[0-9]*$/, {
      message: "Please fill with number only.",
    }),
  company: z.string(),
  interest: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one interest.",
  }),
  budget: z.enum(
    ["< 5.000", "5.000 - 10.000", "10.000 - 30.000", "> 30.000 "],
    {
      required_error: "You need to select a project budget.",
    },
  ),
  timeline: z.enum(["1 Month", "3 Months", "6 Months", "Tentative"], {
    required_error: "You need to select a project timeline.",
  }),
  referral_code: z.string(),
});

export type ContactUsFormState = {
  resetKey: string;
  errors?: {
    [k in keyof z.infer<typeof contactUsSchema>]?: string[] | undefined;
  };
};