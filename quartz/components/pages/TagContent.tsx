import { QuartzComponentConstructor, QuartzComponentProps } from "../types"
import style from "../styles/listPage.scss"
import { PageList } from "../PageList"
import { FullSlug, getAllSegmentPrefixes, simplifySlug } from "../../util/path"
import { QuartzPluginData } from "../../plugins/vfile"
import { Root } from "hast"
import { pluralize } from "../../util/lang"
import { htmlToJsx } from "../../util/jsx"

const numPages = 10
function TagContent(props: QuartzComponentProps) {
  const { tree, fileData, allFiles } = props
  const slug = fileData.slug

  if (!(slug?.startsWith("tags/") || slug === "tags")) {
    throw new Error(`Component "TagContent" tried to render a non-tag page: ${slug}`)
  }

  const tag = simplifySlug(slug.slice("tags/".length) as FullSlug)
  const allPagesWithTag = (tag: string) =>
    allFiles.filter((file) =>
      (file.frontmatter?.tags ?? []).flatMap(getAllSegmentPrefixes).includes(tag),
    )

  const content =
    (tree as Root).children.length === 0
      ? fileData.description
      : htmlToJsx(fileData.filePath!, tree)

  if (tag === "/") {
    const tags = [
      ...new Set(
        allFiles.flatMap((data) => data.frontmatter?.tags ?? []).flatMap(getAllSegmentPrefixes),
      ),
    ].sort((a, b) => a.localeCompare(b))
    const tagItemMap: Map<string, QuartzPluginData[]> = new Map()
    for (const tag of tags) {
      tagItemMap.set(tag, allPagesWithTag(tag))
    }

    return (
      <div class="popover-hint">
        <article>
          <p>{content}</p>
        </article>
        <p>Found {tags.length} total tags.</p>
        <div>
          <div className="all-tags">
            {Object.entries(
              allFiles.reduce((tagCount: { [tag: string]: number }, curr) => {
                const tags = curr.frontmatter?.tags ?? []
                tags.forEach((tag) => {
                  tagCount[tag] = (tagCount[tag] || 0) + 1
                })
                return tagCount
              }, {}),
            )
              .sort((a, b) => b[1] - a[1]) // Sort tags by occurrence count in descending order
              .map(([tag, count]) => (
                <a className="internal tag-link" href={`/tags/${tag}`} key={tag}>
                  #{tag} ({count})
                </a>
              ))}
          </div>
        </div>
      </div>
    )
  } else {
    const pages = allPagesWithTag(tag)
    const { index, nbPages, nb } = props
    const listProps = {
      ...props,
      allFiles: pages,
    }

    return (
      <div class="popover-hint">
        <article>{content}</article>
        <p>{pluralize(nb, "item")} with this tag.</p>
        <div>
          <PageList {...listProps} />
        </div>
        {nbPages > 1 && (
          <div class="see-more">
            {index === 0 && <a />}
            {index === 1 && (
              <a href={`/${slug}`} class="previous">
                Previous
              </a>
            )}
            {index > 1 && index <= nbPages && (
              <a href={index} class="previous">
                Previous
              </a>
            )}
            <div>
              {index + 1} of {nbPages}
            </div>
            {index === 0 && (
              <a href={`/${slug}/page/2`} class="next">
                Next
              </a>
            )}
            {index > 0 && index < nbPages - 1 && (
              <a href={index + 2} class="next">
                Next
              </a>
            )}
            {index === nbPages - 1 && <a />}
          </div>
        )}
      </div>
    )
  }
}

TagContent.css = style + PageList.css
export default (() => TagContent) satisfies QuartzComponentConstructor
