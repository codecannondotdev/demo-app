import { defineConfig } from "vitepress";
import llmstxt from "vitepress-plugin-llms";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  vite: {
    plugins: [llmstxt()],
  },
  title: "codecannon docs",
  description:
    "Guides and reference for every file Codecannon generates: Laravel API, Vue UI, Docker, CI/CD.",
  ignoreDeadLinks: [/^https?:\/\/localhost/],
  head: [
    ["link", { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
    ["link", { rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    [
      "link",
      {
        rel: "icon",
        type: "image/png",
        sizes: "96x96",
        href: "/favicon-96x96.png",
      },
    ],
    [
      "link",
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
    ],
    ["meta", { name: "theme-color", content: "#eeff01" }],
    ["link", { rel: "preconnect", href: "https://fonts.googleapis.com" }],
    [
      "link",
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossorigin: "",
      },
    ],
    [
      "link",
      {
        href: "https://fonts.googleapis.com/css2?family=Funnel+Display:wght@300..800&family=Funnel+Sans:ital,wght@0,300..800;1,300..800&family=JetBrains+Mono:wght@400;500;700&display=swap",
        rel: "stylesheet",
      },
    ],
  ],
  markdown: {
    theme: { light: "github-light", dark: "github-dark" },
  },
  themeConfig: {
    logo: { src: "/logo.svg", alt: "codecannon" },
    siteTitle: false,
    search: {
      provider: "local",
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      {
        text: "Docs",
        link: "/getting-started/generating-applications",
        activeMatch:
          "^/(getting-started|essentials|frontend|backend|generated-files|api)/",
      },
      { text: "Website", link: "https://codecannon.dev", noIcon: true },
      { text: "Blog", link: "https://codecannon.dev/blog", noIcon: true },
      { text: "Open app", link: "https://app.codecannon.dev", noIcon: true },
    ],
    socialLinks: [
      { icon: "discord", link: "https://discord.gg/BKrcjeaBdv" },
      { icon: "x", link: "https://x.com/codecannondev" },
    ],
    outline: { label: "On this page" },
    docFooter: { prev: "Previous", next: "Next" },

    sidebar: [
      {
        text: "Getting Started",
        items: [
          {
            text: "Generating Applications",
            link: "/getting-started/generating-applications",
          },
          { text: "Local Setup", link: "/getting-started/local-setup" },
        ],
      },
      {
        text: "Essentials",
        items: [
          {
            text: "Architecture Overview",
            link: "/essentials/architecture-overview",
          },
          { text: "Authentication", link: "/essentials/authentication" },
          { text: "User Management", link: "/essentials/user-management" },
          {
            text: "Login/Registration",
            link: "/essentials/login-registration",
          },
          { text: "Linters", link: "/essentials/linters" },
          { text: "Formatters", link: "/essentials/formatters" },
          { text: "Testing", link: "/essentials/testing" },
          { text: "CI/CD", link: "/essentials/ci-cd" },
          { text: "Docker", link: "/essentials/docker" },
          {
            text: "Kubernetes",
            link: "/essentials/kubernetes",
          },
        ],
      },
      {
        text: "Frontend",
        items: [
          {
            text: "Model",
            link: "/frontend/model",
          },
          {
            text: "APIs",
            link: "/frontend/apis",
          },
          {
            text: "States",
            link: "/frontend/states",
          },
          {
            text: "Form Utils",
            link: "/frontend/form-utils",
          },
          {
            text: "Query Builder",
            link: "/frontend/query-builder",
          },
          {
            text: "Components",
            link: "/frontend/components",
          },
          {
            text: "PrimeVue",
            link: "/frontend/primevue",
          },
        ],
      },
      {
        text: "Backend",
        items: [
          {
            text: "CRUD Controllers",
            link: "/backend/crud-controllers",
          },
          {
            text: "CRUDControllerHelper",
            link: "/backend/crud-controller-helper",
          },
          {
            text: "FilterHelper",
            link: "/backend/filter-helper",
          },
          {
            text: "RelationHelper",
            link: "/backend/relation-helper",
          },
          {
            text: "UpdateRelationsHelper",
            link: "/backend/update-relations-helper",
          },
          {
            text: "SeederHelper",
            link: "/backend/seeder-helper",
          },
          {
            text: "Searchable",
            link: "/backend/searchable",
          },
        ],
      },
      {
        text: "Generated Files",
        items: [
          {
            text: "Frontend",
            items: [
              {
                text: "Views",
                items: [
                  {
                    text: "List",
                    link: "/generated-files/frontend/views/list",
                  },
                  {
                    text: "Edit",
                    link: "/generated-files/frontend/views/edit",
                  },
                ],
              },
              {
                text: "Components",
                items: [
                  {
                    text: "Form",
                    link: "/generated-files/frontend/components/form",
                  },
                  {
                    text: "Relation Widgets",
                    link: "/generated-files/frontend/components/relation-widgets",
                  },
                  {
                    text: "Relation Inputs",
                    link: "/generated-files/frontend/components/relation-inputs",
                  },
                  {
                    text: "Relation Add Dialogs",
                    link: "/generated-files/frontend/components/relation-add-dialogs",
                  },
                ],
              },
              {
                text: "Business Logic",
                items: [
                  {
                    text: "Model",
                    link: "/generated-files/frontend/business-logic/model",
                  },
                  {
                    text: "Api",
                    link: "/generated-files/frontend/business-logic/api",
                  },
                  {
                    text: "States",
                    link: "/generated-files/frontend/business-logic/states",
                  },
                ],
              },
              {
                text: "Other",
                items: [
                  {
                    text: "Enums",
                    link: "/generated-files/frontend/other/enums",
                  },
                ],
              },
            ],
          },
          {
            text: "Backend",
            items: [
              {
                text: "Migrations",
                link: "/generated-files/backend/migrations",
              },
              {
                text: "Routes",
                link: "/generated-files/backend/routes",
              },
              {
                text: "Models",
                link: "/generated-files/backend/models",
              },
              {
                text: "Controllers",
                link: "/generated-files/backend/controllers",
              },
              {
                text: "Requests",
                link: "/generated-files/backend/requests",
              },
              {
                text: "Factories",
                link: "/generated-files/backend/factories",
              },
              {
                text: "Seeders",
                link: "/generated-files/backend/seeders",
              },
              {
                text: "Enums",
                link: "/generated-files/backend/enums",
              },
            ],
          },
        ],
      },
      {
        text: "API",
        items: [
          {
            text: "Frontend",
            items: [
              {
                text: "Api",
                link: "/api/frontend/api",
              },
              {
                text: "QueryBuilder",
                link: "/api/frontend/query-builder",
              },
              {
                text: "Models",
                link: "/api/frontend/models",
              },
              {
                text: "DetailsState",
                link: "/api/frontend/details-state",
              },
              {
                text: "ListState",
                link: "/api/frontend/list-state",
              },
              {
                text: "useForm",
                link: "/api/frontend/use-form",
              },
              {
                text: "useApiTable",
                link: "/api/frontend/use-api-table",
              },
              {
                text: "useDataTable",
                link: "/api/frontend/use-data-table",
              },
              {
                text: "AuthApi",
                link: "/api/frontend/auth-api",
              },
              {
                text: "AuthStore",
                link: "/api/frontend/auth-store",
              },
              {
                text: "FormInput",
                link: "/api/frontend/form-input",
              },
              {
                text: "ModelSelect",
                link: "/api/frontend/model-select",
              },
              {
                text: "ApiTable",
                link: "/api/frontend/api-table",
              },
              {
                text: "ApiTableRemoveButton",
                link: "/api/frontend/api-table-remove-button",
              },
              {
                text: "ApiTableLinkButton",
                link: "/api/frontend/api-table-link-button",
              },
              {
                text: "FormContainer",
                link: "/api/frontend/form-container",
              },
              {
                text: "List Search",
                link: "/api/frontend/list-search",
              },
              {
                text: "Header",
                link: "/api/frontend/header",
              },
              {
                text: "HeaderLoader",
                link: "/api/frontend/header-loader",
              },
            ],
          },
          {
            text: "Backend",
            items: [
              {
                text: "CRUDControllerHelper",
                link: "/api/backend/crud-controller-helper",
              },
              {
                text: "FilterHelper",
                link: "/api/backend/filter-helper",
              },
              {
                text: "RelationHelper",
                link: "/api/backend/relation-helper",
              },
              {
                text: "UpdateRelationsHelper",
                link: "/api/backend/update-relations-helper",
              },
              {
                text: "SeederHelper",
                link: "/api/backend/seeder-helper",
              },
            ],
          },
        ],
      },
    ],
  },
});
