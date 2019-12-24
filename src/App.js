import React from 'react';

import StreetsHelper from './StreetsHelper'

class App extends React.Component{


state={
  x:''
}

check = (x)=>console.log(x);
  
  render()
  {
    return (
      <div className="App">
        <StreetsHelper />
      </div>
    );
  }
}

export default App;
