import { PlopTypes } from "@turbo/gen";
import { execSync } from "node:child_process";
import { readdir } from "node:fs/promises";

function clearExtensions(fileName: string) {
  const lastDotIndex = fileName.lastIndexOf(".");
  return lastDotIndex === -1 ? fileName : fileName.slice(0, lastDotIndex);
}

async function modifyPageCotent(plop: PlopTypes.NodePlopAPI) {
  const files = await readdir("packages/components/src/types/template-types");

  const lines: string[] = [];

  for (const file of files) {
    const cleanFileName = clearExtensions(file);
    const pascalFileName = plop
      .getHelper("pascalCase")(cleanFileName)
      .replaceAll("_", "");
    lines.push(
      `import type { ${pascalFileName}Props, ${pascalFileName}Slug } from "./template-types/${cleanFileName}"`,
    );
  }

  lines.push("");
  for (const file of files) {
    const cleanFileName = clearExtensions(file);
    const pascalFileName = plop
      .getHelper("pascalCase")(cleanFileName)
      .replaceAll("_", "");
    lines.push(`export type ${pascalFileName}Component = {`);
    lines.push(`  slug: ${pascalFileName}Slug;`);
    lines.push(`  content: ${pascalFileName}Props;`);
    lines.push("};");
    lines.push("");
  }

  lines.push("export type PageContentComponentProps =");
  for (const file of files) {
    const cleanFileName = clearExtensions(file);
    const pascalFileName = plop
      .getHelper("pascalCase")(cleanFileName)
      .replaceAll("_", "");
    lines.push(`  | ${pascalFileName}Component`);
  }

  lines.push("");
  lines.push(
    'export type PageContentComponentSlug = PageContentComponentProps["slug"];',
  );
  lines.push(
    'export type PageContentComponentContent = PageContentComponentProps["content"];',
  );
  lines.push("");
  lines.push(
    "export type PageContent = { id: string } & PageContentComponentProps;",
  );

  return lines.join("\n");
}

async function modifyPageRenderer(plop: PlopTypes.NodePlopAPI) {
  const lines: string[] = [
    'import type { PageContentComponentSlug } from "../types/page-content";',
    'import type { ComponentRenderer, PageRendererComponentProps } from "./types";',
  ];

  const files = await readdir("packages/components/src/ui/template");
  for (const file of files) {
    if (!file.includes("-meta.")) {
      continue;
    }
    const cleanFileName = clearExtensions(file);
    lines.push(
      `import { ${plop.getHelper("constantCase")(cleanFileName)} } from "./template/${cleanFileName}"`,
    );
  }

  lines.push("");
  lines.push("export const COMPONENTS = [");
  for (const file of files) {
    if (!file.includes("-meta.")) {
      continue;
    }
    const cleanFileName = clearExtensions(file);
    lines.push(`  ${plop.getHelper("constantCase")(cleanFileName)},`);
  }
  lines.push("] satisfies ComponentRenderer<");
  lines.push("  PageContentComponentSlug,");
  lines.push("  PageRendererComponentProps");
  lines.push(">[];");

  return lines.join("\n");
}

async function modifyFormRenderer(plop: PlopTypes.NodePlopAPI) {
  const lines: string[] = ['import type { FormFields } from "./types";'];

  const files = await readdir(
    "apps/dashboard/src/components/components-form/content-schemas",
  );
  for (const file of files) {
    const cleanFileName = clearExtensions(file);
    lines.push(
      `import { ${plop.getHelper("constantCase")(cleanFileName)}_SCHEMA } from "./content-schemas/${cleanFileName}";`,
    );
  }

  lines.push("");
  lines.push("export const SCHEMAS = [");
  for (const file of files) {
    const cleanFileName = clearExtensions(file);
    lines.push(`${plop.getHelper("constantCase")(cleanFileName)}_SCHEMA,`);
  }
  lines.push("] satisfies FormFields[];");

  return lines.join("\n");
}

export function contentTemplate(plop: PlopTypes.NodePlopAPI) {
  plop.setGenerator("content-template", {
    description: "Create new content template",
    prompts: [
      {
        type: "input",
        name: "templateName",
        message: "What is the name of the new content template?",
        validate: (input: string) => {
          if (!new RegExp(/^[A-Za-z0-9 ]+$/).test(input)) {
            return "template name should pass the [A-Za-z0-9 ] pattern";
          }
          return true;
        },
      },
    ],
    actions: (data) => {
      const name = data
        ? plop.getHelper("pascalCase")(data.templateName).replace(/_/g, "")
        : "Foo";

      return [
        {
          type: "add",
          data: { name },
          path: "packages/components/src/ui/template/{{ dashCase templateName }}.tsx",
          templateFile: "templates/content-template-component.hbs",
        },
        {
          type: "add",
          data: { name },
          path: "packages/components/src/ui/template/{{ dashCase templateName }}-meta.tsx",
          templateFile: "templates/content-template-component-meta.hbs",
        },
        {
          type: "add",
          data: { name },
          path: "apps/dashboard/src/components/components-form/content-schemas/{{ dashCase templateName }}-form.tsx",
          templateFile: "templates/content-template-form.hbs",
        },
        {
          type: "add",
          data: { name },
          path: "packages/components/src/types/template-types/{{ dashCase templateName }}.ts",
          templateFile: "templates/content-template-type.hbs",
        },
        {
          type: "modify",
          path: "packages/components/src/types/page-content.ts",
          async transform() {
            return await modifyPageCotent(plop);
          },
        },
        {
          type: "modify",
          path: "packages/components/src/ui/page-renderer-components.ts",
          async transform() {
            return await modifyPageRenderer(plop);
          },
        },
        {
          type: "modify",
          path: "apps/dashboard/src/components/components-form/form-renderer-schemas.ts",
          async transform() {
            return await modifyFormRenderer(plop);
          },
        },
        function customAction() {
          execSync(`pnpm prettier . --write --ignore-unknown`);
          return "New content template added";
        },
      ];
    },
  });
}
