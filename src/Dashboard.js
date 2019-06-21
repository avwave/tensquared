import React, { Component } from 'react';
import Gridbox from './Gridbox'
class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {  };
  }
  render() {
    return (
      <div>
          <Gridbox />
      </div>
    );
  }
}

export default Dashboard;