import { QuartzEmitterPlugin } from "../types"
import { QuartzComponentProps } from "../../components/types"
import HeaderConstructor from "../../components/Header"
import BodyConstructor from "../../components/Body"
import { pageResources, renderPage } from "../../components/renderPage"
import { ProcessedContent, defaultProcessedContent } from "../vfile"
import { FullPageLayout } from "../../cfg"
import path from "path"
import {
  FilePath,
  FullSlug,
  SimpleSlug,
  _stripSlashes,
  joinSegments,
  pathToRoot,
  simplifySlug,
} from "../../util/path"
import { defaultListPageLayout, sharedPageComponents } from "../../../quartz.layout"
import { FolderContent } from "../../components"
import { write } from "./helpers"

export const FolderPage: QuartzEmitterPlugin<FullPageLayout> = (userOpts) => {
  const opts: FullPageLayout = {
    ...sharedPageComponents,
    ...defaultListPageLayout,
    pageBody: FolderContent(),
    ...userOpts,
  }

  const { head: Head, header, beforeBody, pageBody, left, right, footer: Footer } = opts
  const Header = HeaderConstructor()
  const Body = BodyConstructor()

  return {
    name: "FolderPage",
    getQuartzComponents() {
      return [Head, Header, Body, ...header, ...beforeBody, pageBody, ...left, ...right, Footer]
    },
    async emit(ctx, content, resources): Promise<FilePath[]> {
      const fps: FilePath[] = []
      const allFiles = content.map((c) => c[1].data)
      const cfg = ctx.cfg.configuration

      const folders: Set<SimpleSlug> = new Set(
        allFiles.flatMap((data) => {
          const slug = data.slug
          const folderName = path.dirname(slug ?? "") as SimpleSlug
          if (slug && folderName !== "." && folderName !== "tags") {
            return [folderName]
          }
          return []
        }),
      )

      const folderDescriptions: Record<string, ProcessedContent> = Object.fromEntries(
        [...folders].map((folder) => [
          folder,
          defaultProcessedContent({
            slug: joinSegments(folder, "index") as FullSlug,
            frontmatter: { title: `Folder: ${folder}`, tags: [] },
          }),
        ]),
      )

      for (const [tree, file] of content) {
        const slug = _stripSlashes(simplifySlug(file.data.slug!)) as SimpleSlug
        if (folders.has(slug)) {
          folderDescriptions[slug] = [tree, file]
        }
      }

      for (const folder of folders) {
        const slug = joinSegments(folder, "index") as FullSlug
        const allFolderFiles = allFiles.filter((file) => file.slug?.startsWith(folder))
        const nbPages = Math.ceil(allFolderFiles.length / 5)

        for (let index = 0; index < nbPages; index++) {
          const [tree, file] = folderDescriptions[folder]
          const slugCustom = index === 0 ? slug : (`${slug}-${index}` as FullSlug)
          const externalResources = pageResources(pathToRoot(slugCustom), resources)
          const startIndex = index * 8
          const endIndex = startIndex + 8
          const files = [...allFolderFiles].reverse().slice(startIndex, endIndex)

          const componentData: QuartzComponentProps = {
            fileData: file.data,
            externalResources,
            cfg,
            children: [],
            tree,
            allFiles: files,
            nbPages,
            currentPage: index,
          }

          const content = renderPage(slugCustom, componentData, opts, externalResources)
          const fp = await write({
            ctx,
            content,
            slug: slugCustom,
            ext: ".html",
          })

          fps.push(fp)
        }
      }
      return fps
    },
  }
}
