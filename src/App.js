import React from 'react';
import logo from './logo.svg';

import StreetsHelper from './StreetsHelper'
import './App.css';

class App extends React.Component{


state={
  x:''
}

check = (x)=>console.log(x);
  
  render()
  {
    return (
      <div className="App">
        <StreetsHelper 
        customInput={()=><input className='test'/>}
        returnedDataList={this.check}
        />
      </div>
    );
  }
}

export default App;
