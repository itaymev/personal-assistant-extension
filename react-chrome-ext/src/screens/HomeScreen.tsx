
type homeProps = {
    onClick: () => void;
}

export default function Home(props: homeProps) {

    return (
        <div id="home-page">
            <button id="notes-button" onClick={props.onClick}>Notes</button>
            <button id="citation-button" onClick={props.onClick}>Citation</button>
        </div>
    )
}