import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { D3Config } from "./quartz/components/Graph"
import { SimpleSlug } from "./quartz/util/path"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [
    Component.NoPrivateOnly(Component.Comments({
      provider: "giscus",
      options: {
        // from data-repo
        repo: 'dnbln/notes',
        // from data-repo-id
        repoId: 'R_kgDOLXjHig',
        // from data-category
        category: 'Posts',
        // from data-category-id
        categoryId: 'DIC_kwDOLXjHis4CpOt-',
        mapping: 'og:title',
      },
    }))
  ],
  footer: Component.OwnFooter({
    links: {
      'Mail me': "mailto:dinu@dnbln.dev",
      'This site': "https://github.com/dnbln/notes",
      GitHub: "https://github.com/dnbln",
      LinkedIn: "https://www.linkedin.com/in/dnbln/",
    },
  }),
}

const graphOpts: Partial<D3Config> = {
  opacityScale: 1,
  focusOnHover: true,
  fontSize: 0.8,
  repelForce: 2,
  removeTags: ["projects"],
}

const graphPrivate = Component.Graph({
  localGraph: { ...graphOpts, depth: 1 },
  globalGraph: { ...graphOpts, depth: 3 },
})

const graph = Component.Graph({
  localGraph: { ...graphOpts, depth: 1 },
  globalGraph: { ...graphOpts, depth: -1 },
})

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.NoPrivateOnly(Component.NonHomepageOnly(
      Component.Breadcrumbs())),
    Component.NonHomepageOnly(
      Component.ArticleTitle()),
    // Component.Description(),
    // Component.ContentMeta(),
    Component.NonHomepageOnly(
      Component.Row({
        hasSpacedBetweenJustification: true,
        components: [
          Component.Dates(),
          Component.GrowthStage(),
          Component.ReadingTime(),
        ]
      })),
    Component.TagList(),
  ],
  left: [
    Component.NoPrivateOnly(Component.PageTitle()),
    Component.MobileOnly(Component.Spacer()),
    Component.NoPrivateOnly(Component.Search()),
    Component.Darkmode(),
    Component.NoPrivateOnly(
      Component.HomepageOnly(
        Component.DesktopOnly(
          Component.RecentNotes({
            title: "Recent Writing",
            limit: 2,
            filter: (f) => {
              console.log(f.slug)
              return f.slug!.startsWith("blog/") && !f.slug!.endsWith("/index") && !f.frontmatter?.noindex
            },
            linkToMore: "blog/" as SimpleSlug,
          }),
        ))),
    Component.HomepageOnly(
      Component.DesktopOnly(
        Component.RecentNotes({
          title: "Recent Notes",
          limit: 2,
          filter: (f) => f.slug!.startsWith("daily-notes/") && f.slug !== "daily-notes/index",
          linkToMore: "daily-notes/" as SimpleSlug,
        }),
      )),
    Component.NonHomepageOnly(
      Component.DesktopOnly(Component.TableOfContents())),
  ],
  right: [
    Component.PrivateOnly(graphPrivate),
    Component.NoPrivateOnly(graph),

    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [
    Component.NoPrivateOnly(Component.Breadcrumbs()), Component.ArticleTitle(), Component.ContentMeta(),
    Component.GrowthStage(),
  ],
  left: [
    Component.NoPrivateOnly(Component.PageTitle()),
    Component.MobileOnly(Component.Spacer()),
    Component.NoPrivateOnly(Component.Search()),
    Component.Darkmode(),
    Component.DesktopOnly(Component.TableOfContents()),
  ],
  right: [
    Component.PrivateOnly(graphPrivate),
    Component.NoPrivateOnly(graph),

    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}
