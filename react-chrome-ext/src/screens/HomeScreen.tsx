
type HomeProps = {
    citationNav: () => void;
    notesNav: () => void;
}

export default function Home(props: HomeProps) {

    return (
        <div id="home-page">
            <button id="notes-button" onClick={props.notesNav}>Notes</button>
            <button id="citation-button" onClick={props.citationNav}>Citation</button>
        </div>
    )
}