import { QuartzComponentConstructor, QuartzComponentProps } from "../types"

import style from "../styles/listPage.scss"
import { PageList } from "../PageList"
import { _stripSlashes } from "../../util/path"
import { Root } from "hast"
import { pluralize } from "../../util/lang"
import { htmlToJsx } from "../../util/jsx"

function FolderContent(props: QuartzComponentProps) {
  const { tree, fileData, allFiles } = props
  const { index, nbPages, nb } = props

  const listProps = {
    ...props,
    allFiles,
  }

  const content =
    (tree as Root).children.length === 0
      ? fileData.description
      : htmlToJsx(fileData.filePath!, tree)

  return (
    <div class="popover-hint">
      <article>
        <p>{content}</p>
      </article>
      <p>{pluralize(nb, "item")} under this folder.</p>
      <div>
        <PageList {...listProps} />
      </div>
      {nbPages > 0 && (
        <div class="see-more">
          {index === 0 && <a />}
          {index === 1 && index <= nbPages && (
            <a href={"../"} class="previous">
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
          {index === 0 && index <= nbPages && (
            <a href={`/${fileData.slug?.replace("/index", "")}/page/2`} class="next">
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

FolderContent.css = style + PageList.css
export default (() => FolderContent) satisfies QuartzComponentConstructor
