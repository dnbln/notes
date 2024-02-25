import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"


interface Options {
    castPath: string
    castId?: string
}

export default ((opts?: Options) => {
    if (!opts) {
        throw new Error("AsciinemaCast component requires an options object")
    }

    let path = opts.castPath
    let id = opts.castId || "asciicast-cast"

    function AsciinemaCast({ fileData, displayClass }: QuartzComponentProps) {
        return (
            <div className={classNames(displayClass, "asciinema-cast")} id={id}></div>
        );
    }

    AsciinemaCast.afterDom = `
    AsciinemaPlayer.create('${path}', document.getElementById('${id}'));
    `;

    return AsciinemaCast
}) satisfies QuartzComponentConstructor
