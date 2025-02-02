import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

export default ((component?: QuartzComponent) => {
  if (component) {
    const Component = component
    const HomepageOnly: QuartzComponent = (props: QuartzComponentProps) => {
        if (props.fileData.slug! === "index") {
            return <Component {...props} />
        } else {
            return <></>
        }
    }

    HomepageOnly.displayName = component.displayName
    HomepageOnly.afterDOMLoaded = component?.afterDOMLoaded
    HomepageOnly.beforeDOMLoaded = component?.beforeDOMLoaded
    HomepageOnly.css = component?.css
    return HomepageOnly
  } else {
    return () => <></>
  }
}) satisfies QuartzComponentConstructor
