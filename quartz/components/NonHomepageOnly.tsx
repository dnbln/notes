import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

export default ((component?: QuartzComponent) => {
  if (component) {
    const Component = component
    const NonHomepageOnly: QuartzComponent = (props: QuartzComponentProps) => {
        if (props.fileData.slug! === "index") {
            return <></>
        } else {
            return <Component {...props} />
        }
    }

    NonHomepageOnly.displayName = component.displayName
    NonHomepageOnly.afterDOMLoaded = component?.afterDOMLoaded
    NonHomepageOnly.beforeDOMLoaded = component?.beforeDOMLoaded
    NonHomepageOnly.css = component?.css
    return NonHomepageOnly
  } else {
    return () => <></>
  }
}) satisfies QuartzComponentConstructor
