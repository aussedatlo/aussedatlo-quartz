import { pathToRoot } from "../util/path"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"

function PageTitle({ fileData, cfg, displayClass }: QuartzComponentProps) {
  const title = cfg?.pageTitle ?? "Untitled Quartz"
  const baseDir = pathToRoot(fileData.slug!)
  const ogImagePath = `/static/favicon.ico`

  return (
    <div>
      <a href={baseDir} class={`page-title ${displayClass ?? ""}`}>
        <img src={ogImagePath} />
        <div class={"page-title-text"}>{title}</div>
      </a>
    </div>
  )
}

PageTitle.css = `
.page-title {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
}

.page-title-text {
  margin: 10px;
  font-size: 1.5em;
}
`

export default (() => PageTitle) satisfies QuartzComponentConstructor
