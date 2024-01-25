import { FullSlug, resolveRelative, simplifySlug } from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"
import { Date, getDate } from "./Date"
import { QuartzComponentProps } from "./types"
import { GlobalConfiguration } from "../cfg"

export function byDateAndAlphabetical(
  cfg: GlobalConfiguration,
): (f1: QuartzPluginData, f2: QuartzPluginData) => number {
  return (f1, f2) => {
    if (f1.dates && f2.dates) {
      // sort descending
      return getDate(cfg, f2)!.getTime() - getDate(cfg, f1)!.getTime()
    } else if (f1.dates && !f2.dates) {
      // prioritize files with dates
      return -1
    } else if (!f1.dates && f2.dates) {
      return 1
    }

    // otherwise, sort lexographically by title
    const f1Title = f1.frontmatter?.title.toLowerCase() ?? ""
    const f2Title = f2.frontmatter?.title.toLowerCase() ?? ""
    return f1Title.localeCompare(f2Title)
  }
}

type Props = {
  limit?: number
} & QuartzComponentProps

export function PageList({ cfg, fileData, allFiles, limit }: Props) {
  let list = allFiles.sort(byDateAndAlphabetical(cfg))
  if (limit) {
    list = list.slice(0, limit)
  }

  return (
    <ul class="section-ul">
      {list.map((page, index) => {
        const desc = page.frontmatter?.description ?? "No description available"
        const tags = page.frontmatter?.tags ?? []
        const icon = page.frontmatter?.icon ?? "✨"
        const title = page.frontmatter?.title ?? ""
        const slug = simplifySlug(page.slug!).replace("posts/", "").replace("/posts/", "")
        const img = "/ressources/" + slug + "/img-small.jpg"

        return (
          <>
            <li class="section-li">
              <a class="container-image" href={resolveRelative(fileData.slug!, page.slug!)}>
                <img src={img} class="centered-image" alt={slug} />
              </a>
              <div class="section">
                <div>
                  <a href={resolveRelative(fileData.slug!, page.slug!)} class="internal">
                    {title}
                  </a>
                </div>
                <div class="meta">
                  <Date date={getDate(cfg, page)!} />
                </div>
                <a
                  class="container-image-mobile"
                  href={resolveRelative(fileData.slug!, page.slug!)}
                >
                  <img src={img} class="centered-image" alt={slug} />
                </a>
                <div class="description">
                  <span class="icon">{icon}</span>
                  {desc}
                </div>
                <div class="tags">
                  {tags.map((tag) => (
                    <a
                      class="internal tag-link"
                      href={resolveRelative(fileData.slug!, `tags/${tag}` as FullSlug)}
                    >
                      #{tag}
                    </a>
                  ))}
                </div>
              </div>
            </li>
            {list.length - 1 > index ? <div class="divider" /> : <></>}
          </>
        )
      })}
    </ul>
  )
}

PageList.css = `
.section h3 {
  margin: 0;
}

.section > .tags {
  margin: 0;
}
`
