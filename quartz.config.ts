import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

const config: QuartzConfig = {
  configuration: {
    pageTitle: "aussedatlo.me",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
      host: "https://plausible.aussedatlo.me",
    },
    baseUrl: "aussedatlo.me",
    ignorePatterns: ["private", "templates", ".obsidian", "ressources/**/*.md"],
    defaultDateType: "created",
    theme: {
      typography: {
        header: "Schibsted Grotesk",
        body: "Source Sans Pro",
        code: "IBM Plex Mono",
      },
      colors: {
        lightMode: {
          light: "#ebebec",
          lightgray: "#d4d4d4",
          gray: "#9ca3af",
          darkgray: "#374151",
          dark: "#1f2937",
          secondary: "#1c64f2",
          tertiary: "#d99706",
          highlight: "rgba(143, 159, 169, 0.15)",
        },
        darkMode: {
          light: "#1f2937",
          lightgray: "#374151",
          gray: "#9ca3af",
          darkgray: "#d4d4d4",
          dark: "#ebebec",
          secondary: "#38bdf8",
          tertiary: "#fbbf24",
          highlight: "rgba(143, 159, 169, 0.15)",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.TableOfContents(),
      Plugin.CreatedModifiedDate({
        // you can add 'git' here for last modified from Git
        // if you do rely on git for dates, ensure defaultDateType is 'modified'
        priority: ["frontmatter", "filesystem"],
      }),
      Plugin.Latex({ renderEngine: "katex" }),
      Plugin.SyntaxHighlighting(),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources({ fontOrigin: "googleFonts" }),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.NotFoundPage(),
    ],
  },
}

export default config
