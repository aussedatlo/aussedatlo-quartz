import { QuartzEmitterPlugin } from "../types"
import { QuartzComponentProps } from "../../components/types"
import HeaderConstructor from "../../components/Header"
import BodyConstructor from "../../components/Body"
import { pageResources, renderPage } from "../../components/renderPage"
import { ProcessedContent, defaultProcessedContent } from "../vfile"
import { FullPageLayout } from "../../cfg"
import {
  FilePath,
  FullSlug,
  getAllSegmentPrefixes,
  joinSegments,
  pathToRoot,
} from "../../util/path"
import { defaultListPageLayout, sharedPageComponents } from "../../../quartz.layout"
import { TagContent } from "../../components"
import { write } from "./helpers"

export const TagPage: QuartzEmitterPlugin<FullPageLayout> = (userOpts) => {
  const opts: FullPageLayout = {
    ...sharedPageComponents,
    ...defaultListPageLayout,
    pageBody: TagContent(),
    ...userOpts,
  }

  const { head: Head, header, beforeBody, pageBody, left, right, footer: Footer } = opts
  const Header = HeaderConstructor()
  const Body = BodyConstructor()

  return {
    name: "TagPage",
    getQuartzComponents() {
      return [Head, Header, Body, ...header, ...beforeBody, pageBody, ...left, ...right, Footer]
    },
    async emit(ctx, content, resources): Promise<FilePath[]> {
      const fps: FilePath[] = []
      const allFiles = content.map((c) => c[1].data)
      const cfg = ctx.cfg.configuration

      const tags: Set<string> = new Set(
        allFiles.flatMap((data) => data.frontmatter?.tags ?? []).flatMap(getAllSegmentPrefixes),
      )

      // add base tag
      tags.add("index")

      const tagDescriptions: Record<string, ProcessedContent> = Object.fromEntries(
        [...tags].map((tag) => {
          const title = tag === "index" ? "Tag Index" : `Tag: #${tag}`
          return [
            tag,
            defaultProcessedContent({
              slug: joinSegments("tags", tag) as FullSlug,
              frontmatter: { title, tags: [] },
            }),
          ]
        }),
      )

      for (const [tree, file] of content) {
        const slug = file.data.slug!
        if (slug.startsWith("tags/")) {
          const tag = slug.slice("tags/".length)
          if (tags.has(tag)) {
            tagDescriptions[tag] = [tree, file]
          }
        }
      }

      for (const tag of tags) {
        const slug = joinSegments("tags", tag) as FullSlug
        const [tree, file] = tagDescriptions[tag]

        const allFilesWithTag =
          tag === "index"
            ? allFiles
            : allFiles.filter((file) => file.frontmatter?.tags.includes(tag)).reverse()
        const nbPages = Math.ceil(allFilesWithTag.length / ctx.cfg.configuration.maxPerPage)

        for (let index = 0; index < nbPages; index++) {
          const startIndex = index * ctx.cfg.configuration.maxPerPage
          const stopIndex =
            tag === "index" ? allFilesWithTag.length : startIndex + ctx.cfg.configuration.maxPerPage
          const fileSlug =
            index === 0 ? file.data.slug! : (`${file.data.slug!}/page/${index + 1}` as FullSlug)
          const externalResources = pageResources(pathToRoot(fileSlug), resources)

          const componentData: QuartzComponentProps = {
            fileData: file.data,
            externalResources,
            cfg,
            children: [],
            tree,
            allFiles: allFilesWithTag.slice(startIndex, stopIndex),
            index,
            nbPages,
            nb: allFilesWithTag.length,
          }

          const content = renderPage(slug, componentData, opts, externalResources)
          const fp = await write({
            ctx,
            content,
            slug: fileSlug,
            ext: ".html",
          })

          fps.push(fp)
        }
      }

      return fps
    },
  }
}
