import React, { Component } from 'react';
import Customcard from './customcard';
import leftrow from '../../assets/icons/leftrow.svg'
import rightrow from '../../assets/icons/rightrow.svg'


class Scrollgroupcard extends Component {
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
                                <Customcard  width={"48px"} description={item.description} title={item.name} subtitle={item.function} icon={item.image}  />
                            </div>
                            
                        ))
                    }
                </div>
                <div className="row justify-content-center m-5">
                    <span onClick={this.handleClickLeft} style={{width:"50px", height:"100px"}}><img src={leftrow} alt="" width={"100%"} height={"100%"} /></span>
                    <span onClick={this.handleClickRight} style={{width:"50px", height:"100px"}}><img src={rightrow} alt="" width={"100%"} height={"100%"} /></span>
                </div>
            </div>
        );
    }
}

export default Scrollgroupcard;
