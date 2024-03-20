import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { D3Config } from "./quartz/components/Graph";

const explorer = Component.Explorer({
  title: "Knowledge",
  folderClickBehavior: "link",
});

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/dnbln/notes",
    },
  }),
}

const graphOpts: Partial<D3Config> = {
  opacityScale: 4.75,
  focusOnHover: true,
  obsidianLikeFocusOnHover: true,
  fontSize: 0.8,
  repelForce: 2,
}

const graph = Component.Graph({
  localGraph: graphOpts,
  globalGraph: graphOpts,
})

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.DesktopOnly(explorer),
  ],
  right: [
    graph,
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.DesktopOnly(explorer),
  ],
  right: [
    graph,
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}
