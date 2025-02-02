import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/footer.scss"
import { version } from "../../package.json"
import { i18n } from "../i18n"

interface Options {
  links: Record<string, string>,
}

export default ((opts?: Options) => {
  const Footer: QuartzComponent = ({ displayClass, cfg, fileData }: QuartzComponentProps) => {
    const year = new Date().getFullYear()
    const links = opts?.links ?? []
    const copyrightYears = fileData.frontmatter?.copyrightYears ?? <>2023-{year}</>
    const copyright = fileData.frontmatter?.copyright ?? "Dinu Blanovschi"
    const rmLinks = fileData.frontmatter?.private === true
    return (
      <footer class={`${displayClass ?? ""}`}>
        <hr />
        {/* <p>
          {i18n(cfg.locale).components.footer.createdWith}{" "}
          <a href="https://quartz.jzhao.xyz/">Quartz v{version}</a> © {year}
        </p> */}
        <p>
          <b>Copyright © {copyrightYears} {copyright}.</b> All rights reserved.
          {/* All content is licensed under <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</a>, unless otherwise noted. <br />
          Source code is licensed under <a href="https://opensource.org/license/mit">the MIT License</a>, unless otherwise noted. */}
        </p>
        <ul>
          {rmLinks === false && Object.entries(links).map(([text, link]) => (
            <li>
              <a href={link}>{text}</a>
            </li>
          ))}
        </ul>
      </footer>
    )
  }

  Footer.css = style
  return Footer
}) satisfies QuartzComponentConstructor
