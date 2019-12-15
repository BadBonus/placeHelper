import React, {Component} from 'react';
import './style.css'

class PlaceHelper extends React.Component{

    state = {
        inputAdress:'',
        findedData:[]
    };

    componentDidMount()
    {}
  
    componentDidUpdate()
    {}

    takeData = (address) => {
        fetch(`http://photon.komoot.de/api/?q=${address}&limit=10`)
        .then((data)=>data.json())
        .then(data=>this.setState({findedData:data.features}));
    }
  
    timer = 0;
    render()
    {
        
      return (
        <div className="Place-helper">
          <input 
          list="Place-helperList"
          value={this.state.inputAdress}
          onChange={(e)=>{
            let value = e.target.value;
                clearTimeout(this.timer);
                this.timer = setTimeout(this.takeData, 800, value);
            this.setState({inputAdress:value});
            }}
           />
        <ul>
        {
        this.state.findedData.map((el)=>
            {
                const {country, state, city, street, name, osm_id} = el.properties;
                const fullData = `${country !== undefined && country} ${state !== undefined && state} ${city !== undefined && city} ${street !== undefined && street} ${name !== undefined && name}`;
                return (
                    <li onClick={()=>{this.setState({inputAdress:fullData})}} key={osm_id}>
                        {
                            fullData
                        }
                    </li>)
            }
        )
        }
        </ul>
        </div>
      );
    }
  }
  
  export default PlaceHelper;