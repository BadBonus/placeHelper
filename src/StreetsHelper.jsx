import React, {Component} from 'react';
import './style.css'

class PlaceHelper extends React.Component{

    state = {
        inputAdress:'',
        findedData:[],
        choosen:false,
        onLoad:false
    };

    componentDidMount()
    {}
  
    componentDidUpdate()
    {}

    takeData = (address) => {
        fetch(`http://photon.komoot.de/api/?q=${address}&limit=10`)
        .then((data)=>data.json())
        .then(data=>this.setState({findedData:data.features, choosen:false, onLoad:false}));
    }

    checkOfUndef = (data) => data !== undefined ? data : '';
  
    timer = 0;
    render()
    {
       const checkOfUndef = this.checkOfUndef;
      return (
        <div className="Place-helper">
          <input 
          list="Place-helperList"
          value={this.state.inputAdress}
          onChange={(e)=>{
            let value = e.target.value;
                clearTimeout(this.timer);
                this.timer = setTimeout(this.takeData, 800, value);
                this.setState({inputAdress:value, onLoad:true});
            }}
           />
        {
            !this.state.choosen &&
            <ul>
            {
            this.state.findedData.map((el)=>
                {
                    const {country, state, city, street, name, osm_id} = el.properties;
                    const fullData = `${checkOfUndef(country)} ${checkOfUndef(state)} ${checkOfUndef(city)} ${checkOfUndef(street)} ${checkOfUndef(name)}`;
                    return (
                        <li onClick={()=>{this.setState({inputAdress:fullData, choosen:true})}} key={osm_id}>
                            {
                                fullData
                            }
                        </li>)
                }
            )
            }
            </ul>
        }
        {
            this.state.onLoad&& <span>Loading...</span>
        }
        </div>
      );
    }
  }
  
  export default PlaceHelper;