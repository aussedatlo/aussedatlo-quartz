import { QuartzComponentConstructor } from "./types"
import style from "./styles/linksHeader.scss"

interface Options {
  links: Record<string, string>
}

export default (() => {
  function LinksHeader() {
    return (
      <div id="links-container">
        <div id="links-header">
          <span>
            <img src="/static/icons8-blog-96.png"></img>
            <a href="/">Blog</a>
          </span>
          <span>
            <img src="/static/icons8-octocat-96.png"></img>
            <a href="https://github.com/aussedatlo" target="_blank">
              GitHub
            </a>
          </span>
          <span>
            <img src="/static/icons8-linkedin.svg"></img>
            <a href="https://linkedin.com/in/aussedatlo" target="_blank">
              Linkedin
            </a>
          </span>
          <span>
            <img src="/static/icons8-tools-96.png"></img>
            <a href="/projects">Projects</a>
          </span>
          <span>
            <img src="/static/icons8-cv-96.png"></img>
            <a href="/experiences">Experiences</a>
          </span>
          <hr></hr>
        </div>
      </div>
    )
  }

  LinksHeader.css = style
  return LinksHeader
}) satisfies QuartzComponentConstructor
