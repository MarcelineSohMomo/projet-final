import { TwoSideForm } from "."

function App(){
	const reviews = [
		{
			src: "/images/1.png",
			text: "condimentum. Porta arcu nunc mauris non est vulputate quisque.Augue non iaculis erat egestas. Gravida quis nisi, pellentesque sagittis ",
			name: "Andi Lane",
			rank: "CEO Catalog",
			rating: 5,
		},
		{
			src: "/images/2.png",
			text: "Augue non iaculis erat egestas. Gravida est vulputate quisququis nisi, pellentesque sagittis condimentum. Porta arcu nunc mauris non e.",
			name: "Tauba Lane",
			rank: "CEO Catalog",
			rating: 4,
		},
		{
			src: "/images/3.png",
			text: "Augue non iaculis erat egestas. Gravida qucondimentum. Porta arcu nunc mis nisi, pellentesque sagittis auris non est vulputate quisque.",
			name: "Judy Lane",
			rank: "CEO Catalog",
			rating: 4,
		}
	]
	return <TwoSideForm reviews={reviews}>
		My awesome Form
	</TwoSideForm>
}
export default App
