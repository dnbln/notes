import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

export default ((component?: QuartzComponent) => {
  if (component) {
    const Component = component
    const NoPrivateOnly: QuartzComponent = (props: QuartzComponentProps) => {
        if (props.fileData.frontmatter?.private === true) {
            return <></>
        } else {
            return <Component {...props} />
        }
    }

    NoPrivateOnly.displayName = component.displayName
    NoPrivateOnly.afterDOMLoaded = component?.afterDOMLoaded
    NoPrivateOnly.beforeDOMLoaded = component?.beforeDOMLoaded
    NoPrivateOnly.css = component?.css
    return NoPrivateOnly
  } else {
    return () => <></>
  }
}) satisfies QuartzComponentConstructor
