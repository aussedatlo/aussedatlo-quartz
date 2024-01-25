import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/articleTitle.scss"

function ArticleTitle({ fileData, displayClass }: QuartzComponentProps) {
  const title = fileData.frontmatter?.title
  const icon = fileData.frontmatter?.icon
  const githubPath = "https://github.com/aussedatlo/aussedatlo-notes/commits/main"
  const githubFilePath = fileData.filePath?.replace("content", "")
  if (title) {
    return (
      <div class={`article-title-container ${displayClass ?? ""}`}>
        <h1 class={"article-title"}>
          {icon} {title}
        </h1>
        {}
        {fileData.filePath && (
          <a href={`${githubPath}${githubFilePath}`} target="_blank">
            <div class={"article-title-history "}> 📆 File History</div>
          </a>
        )}
      </div>
    )
  } else {
    return null
  }
}

ArticleTitle.css = style
export default (() => ArticleTitle) satisfies QuartzComponentConstructor
