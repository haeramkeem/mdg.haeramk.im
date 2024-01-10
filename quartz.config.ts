import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

const config: QuartzConfig = {
  configuration: {
    pageTitle: "Madison Digital Garden",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "google",
      tagId: "G-N68CCP1QHG",
    },
    baseUrl: "mdg.haeramk.im",
    ignorePatterns: ["draft", "private", "templates", ".obsidian"],
    defaultDateType: "created",
    theme: {
      typography: {
        header: "Gowun Batang",
        body: "Gowun Dodum",
        code: "IBM Plex Mono",
      },
      colors: {
        lightMode: {
          light: "#E1E2E7",
          lightgray: "rgba(245, 42, 101, 0.6)",
          gray: "#F52A65",
          darkgray: "#587539",
          dark: "#007197",
          secondary: "#6172B0",
          tertiary: "#9854F1",
          highlight: "rgba(46, 125, 233, 0.1)",
        },
        darkMode: {
          light: "#304345",
          lightgray: "#608D94",
          gray: "#859C77",
          darkgray: "#E6E6E6",
          dark: "#FEEFA9",
          secondary: "#9B857B",
          tertiary: "#E1E19E",
          highlight: "rgba(186, 175, 130, 0.1)",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.TableOfContents(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "filesystem"], // you can add 'git' here for last modified from Git but this makes the build slower
      }),
      Plugin.SyntaxHighlighting(),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Latex({ renderEngine: "katex" }),
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
