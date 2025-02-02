import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

export default ((component?: QuartzComponent) => {
  if (component) {
    const Component = component
    const PrivateOnly: QuartzComponent = (props: QuartzComponentProps) => {
        if (props.fileData.frontmatter?.private === true) {
            return <Component {...props} />
        } else {
            return <></>
        }
    }

    PrivateOnly.displayName = component.displayName
    PrivateOnly.afterDOMLoaded = component?.afterDOMLoaded
    PrivateOnly.beforeDOMLoaded = component?.beforeDOMLoaded
    PrivateOnly.css = component?.css
    return PrivateOnly
  } else {
    return () => <></>
  }
}) satisfies QuartzComponentConstructor
