
type HomeProps = {
    citationNav: () => void;
    notesNav: () => void;
    summarizeNav: () => void;
}

export default function Home(props: HomeProps) {

    return (
        <div className="popup-buttons">
            <button className="popup-button" onClick={props.notesNav}>Notes</button>
            <button className="popup-button" onClick={props.citationNav}>Citation</button>
            <button className="popup-button" onClick={props.summarizeNav}>Summarize</button>
        </div>
    )
}