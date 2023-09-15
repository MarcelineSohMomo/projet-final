import { useState } from "react";
import { Review } from "../two-side-form";

const SlideShow = (props) =>{
    let [currentReview,setCurrentReview] = useState(props.default || 0);
	const count = props.reviews.length;
	const reviews = props.reviews
	function onNext(){
		setCurrentReview((currentReview+1)%count)
	}
	function onPrev(){
		if(currentReview === 0)
			setCurrentReview(count-1)
		else
			setCurrentReview((currentReview-1)%count)
	}
    const origin = (currentReview === 1) ? "center bottom" : ( currentReview === 2 ? "60% 40%" : "center center") 
	return (
        <div  className='bg-image d-flex align-items-end' style={{background:`url(${reviews[currentReview].src}) transparent no-repeat  ${origin} / cover`, height : "100vh", width: "100%"  }}>
			<Review {...reviews[currentReview]} onNext={onNext} onPrev={onPrev}/>
		</div>
    )
}

export default SlideShow