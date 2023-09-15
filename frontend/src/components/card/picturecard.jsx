import React, { Component } from 'react';
import leftrow from '../../assets/icons/leftrow.svg'
import rightrow from '../../assets/icons/rightrow.svg'

class Picturecard extends Component {

    constructor(props) {
      super(props)
      this.myRef = React.createRef(null);
    }
    handleClickLeft=() =>{
        this.myRef.current.scrollLeft -= this.myRef.current.clientWidth;
    }
    handleClickRight=() =>{
        this.myRef.current.scrollLeft += this.myRef.current.clientWidth;
    }
    render() {
        return (
            <div>
                <div ref={this.myRef} className='row flex-nowrap' style={{width:"100%", overflowX:"scroll"}}>
                    { 
                        this.props.data.map((item, key) =>(
                            <div key={key} className="m-3" style={{width : "250px"}}>
                                <div className="d-flex align-items-end" style={{borderRadius:"1rem" ,background:`url(${item.img}) center center no-repeat` ,width: `${this.props.imgWidth}`, height: `${this.props.imgHeight}`}}>
                                    <div className="bg-white " style={{width:"fit-content",borderRadius:"1rem", padding : ".5rem 1rem", margin : "1rem"}}>
                                        {item.name}
                                    </div>
                                </div>
                            </div>
                            
                        ))
                    }
                </div>
                <div className="row justify-content-center m-2">
                    <span onClick={this.handleClickLeft} style={{width:"50px", height:"100px"}}><img src={leftrow} alt="" width={"100%"} height={"100%"} /></span>
                    <span onClick={this.handleClickRight} style={{width:"50px", height:"100px"}}><img src={rightrow} alt="" width={"100%"} height={"100%"} /></span>
                </div>
            </div>
        );
    }
}
export default Picturecard;
