import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import path from "path"
import fs from "fs"

export default (() => {
  function Banner({ fileData }: QuartzComponentProps) {
    const bannerPath = fileData.relativePath?.replace(".md", "")
    const src = `/ressources/${bannerPath}/img-banner.jpg`

    if (fs.existsSync("content" + src)) return <img src={src} alt={bannerPath} />

    return null
  }

  Banner.css = `
  `
  return Banner
}) satisfies QuartzComponentConstructor
