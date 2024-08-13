import {
  TemplateContentContentSchema,
  TemplateContentSlug,
} from "./template-content.definition";

export type PageContentSchema = {
  id: string;
  content: TemplateContentContentSchema;
  page_id: string;
  template_content_id: string;
  order: number;
};

export type PageSnippetSchema = {
  id: string;
  name: string;
  content: TemplateContentContentSchema;
  slug: TemplateContentSlug;
};