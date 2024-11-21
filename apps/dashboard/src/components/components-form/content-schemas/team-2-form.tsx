import type {
  Team2Props,
  Team2Slug,
} from "@repo/components/types/template-types/team-2";
import type { FormFields } from "../types";

export const TEAM_2_FORM_SCHEMA: FormFields<Team2Slug, Team2Props> = {
  slug: "team-2",
  fields: [
    {
      type: "textarea",
      name: "headline",
      label: "Headline",
      placeholder: "Enter the headline here",
    },
    {
      type: "textarea",
      name: "description",
      label: "Description",
      placeholder: "Enter the description here",
    },
    {
      type: "field-array",
      name: "teams",
      addFieldText: "Add Team",
      labelPrefix: "Team",
      fields: [
        {
          type: "input-file",
          name: "image",
          label: "Image",
        },
        {
          type: "input-text",
          name: "name",
          label: "Name",
          placeholder: "Enter the name here",
        },
        {
          type: "input-text",
          name: "position",
          label: "Position",
          placeholder: "Enter the position here",
        },
        {
          type: "field-group",
          name: "",
          label: "Social Media",
          fields: [
            {
              type: "field-sortable-array",
              name: "socials",
              addFieldText: "Add Social Media",
              sortitem: {
                initialCollapseFields: ["slug", "link"],
                labelField: "slug",
                labelIcon: true,
                fields: [
                  {
                    type: "iconpicker",
                    name: "slug",
                    label: "Icon",
                  },
                  {
                    type: "autocomplete-link",
                    name: "link",
                    label: "Link",
                    placeholder: "Enter the link here",
                  },
                ],
              },
            },
          ],
        },
      ],
    },
  ],
};
