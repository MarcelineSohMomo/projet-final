import StarIcon from '../../assets/icons/star';
import NextIcon from '../../assets/icons/next';
import PrevIcon from '../../assets/icons/prev';
import { useState } from 'react'
export function Review(props) {
	let { text, name, rank, rating, onNext, onPrev } = props;
	return (
	  <div className="d-flex justify-content-center" >
		<article
		  style={{
			background:
			  "linear-gradient(104.17deg, rgba(255, 255, 255, 0.7) 0%, rgba(217, 217, 217, 0) 102.83%, rgba(255, 255, 255, 0) 102.83%)",
		  }}
		  className="text-white d-flex flex-column bg-black mx-5 p-4 mb-3"
		>
		  <p className="">{text}</p>
		  <div className="d-flex justify-content-between">
			<div className="d-flex flex-column gap-1 pb-2">
			  <span className="fs-1 fw-bold">{name}</span>
			  <span>{rank}</span>
			</div>
			<div className="d-flex gap-2">
			  {Array.from(Array(rating), (_, id) => (
				<StarIcon key={id} width="18" height="14" />
			  ))}
			</div>
		  </div>
		  <div className="d-flex flex-row-reverse gap-2">
			<button onClick={onNext}>
			  <NextIcon width="31" height="31" />
			</button>
			<button onClick={onPrev}>
			  <PrevIcon width="31" height="31" />
			</button>
		  </div>
		</article>
	  </div>
	);
  }
  
  export function TwoSideForm(props) {
	let [currentReview, setCurrentReview] = useState(props.default || 0);
	const count = props.reviews.length;
	const reviews = props.reviews;
	function onNext() {
	  setCurrentReview((currentReview + 1) % count);
	}
	function onPrev() {
	  if (currentReview === 0) setCurrentReview(count - 1);
	  else setCurrentReview((currentReview - 1) % count);
	}
  
	return (
	  <div className="row d-flex">
		<div className="col-md-6">{props.children}</div>
		<div className="col-md-6 d-flex align-items-end"style={{margin:"250px"}}>
		  <div
			className="d-flex flex-column h-100 justify-content-end"
			style={{ backgroundColor: "rgba(0, 0, 255, 0.5)" }}
		  >
			<div className="mb-2">
			  <Review {...reviews[currentReview]} onNext={onNext} onPrev={onPrev} />
			</div>
		  </div>
		</div>
	  </div>
	);
  }
  
  

export const defaultReview = 	[
		{
		  id: "1",
			src: "/images/1.png",
			text: "condimentum. Porta arcu nunc mauris non est vulputate quisque.Augue non iaculis erat egestas. Gravida quis nisi, pellentesque sagittis ",
			name: "Andi Lane",
			rank: "CEO Catalog",
			rating: 5,
		},
		{
		  id: "2",
			src: "/images/2.png",
			text: "Augue non iaculis erat egestas. Gravida est vulputate quisququis nisi, pellentesque sagittis condimentum. Porta arcu nunc mauris non e.",
			name: "Tauba Lane",
			rank: "CEO Catalog",
			rating: 4,
		},
		{
		  id: "3",
			src: "/images/3.png",
			text: "Augue non iaculis erat egestas. Gravida qucondimentum. Porta arcu nunc mis nisi, pellentesque sagittis auris non est vulputate quisque.",
			name: "Judy Lane",
			rank: "CEO Catalog",
			rating: 4,
		}
	]