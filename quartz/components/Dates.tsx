import { classNames } from "../util/lang"
import { formatDate, getDate } from "./Date"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"

function Dates({ fileData, displayClass, cfg }: QuartzComponentProps) {
    const { relativePath } = fileData;
    const growthStage = fileData.frontmatter?.["growth-stage"];
    const tendedOrEdited = growthStage && typeof growthStage === "string" ? "Tended" : "Edited";

    const locale = cfg.locale ?? "en-US";
    const updatedDateStr = formatDate(fileData.dates?.modified!, locale);

    const publishedDate = fileData.dates?.published;

    const showHistoryLink = fileData.frontmatter?.private !== true;

    let publishedDateStr;

    if (publishedDate !== undefined) {
        publishedDateStr = formatDate(publishedDate, locale)
    }
    
    if (publishedDateStr && updatedDateStr) {
        return (
            <div class={classNames(displayClass, "dates")}>
                <p><span>Published:</span> {publishedDateStr}{publishedDateStr != updatedDateStr && (<>, <span>Last {tendedOrEdited}:</span> {updatedDateStr}</>)} {showHistoryLink && <>(<a target="_blank" href={`https://github.com/dnbln/notes/commits/v4/content/${relativePath}`}>View History</a>)</>}</p>
            </div>
        )
    } else {
        return null
    }
}

Dates.css = `
.dates {
    margin: 0;
    padding: 0;

    p {
        color: var(--darkgray);
        margin: 0;
        line-height: 1rem;
        font-size: 0.8rem;
    }
}
`

export default (() => Dates) satisfies QuartzComponentConstructor