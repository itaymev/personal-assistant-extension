
type HomeProps = {
    citationNav: () => void;
    notesNav: () => void;
    summarizeNav: () => void;
}

export default function Home(props: HomeProps) {

    return (
        <div id="home-page">
            <button id="notes-button" onClick={props.notesNav}>Notes</button>
            <button id="citation-button" onClick={props.citationNav}>Citation</button>
            <button id="citation-button" onClick={props.summarizeNav}>Summarize</button>
        </div>
    )
}