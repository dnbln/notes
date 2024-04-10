import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const Description: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
    const descritpion = fileData.frontmatter?.description

    if (descritpion) {
        return <div id="description-container"><p>{descritpion}</p></div>
    } else {
        return null
    }
}

export default (() => Description) satisfies QuartzComponentConstructor
