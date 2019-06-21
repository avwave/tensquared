import React, { Component } from "react";
import socketIOClient from 'socket.io-client'

const ENDPOINT = 'https://tensquared.herokuapp.com/:8010'

const styles = {
  squaregrid: {
    height: "auto",
    display: "grid",
    gridTemplate: "repeat(100, 10px) / repeat(100, 10px)",
    // gridTemplate: "repeat(10, 3vw) / repeat(10, 3vw)",
    gridGap: "1px"
  },
};

class Gridbox extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      cells: new Array(10000).fill(false)
    };
    this.socket = socketIOClient(ENDPOINT)
  }

  componentDidMount() {
    this.socket.on('flip box', ({value, index}) => {
      this.flipCell(value, index)
    })
    this.socket.on('init', ({ cells }) => {
      this.setState({cells})
    })
  }
  send = (value, index) => {
    console.log("TCL: send SOCKET flip box-> value, index", value, index)
    this.socket.emit('flip box', {index, value})
  }

  flipCell = (value, index) => {
    const cells = this.state.cells
    cells[index] = value;
    this.setState({cells})
  }
  renderCells = () => {
    return this.state.cells.map((cell, i) => {
      return (
        <div key={`${i}-${cell?'1':'0'}`}
          className={`${cell ? 'onCell' : 'offCell'}`}
          onClick={() => {
            this.send(!cell, i)
          }}></div>
      )
    })
  }
  render() {
    return (
      <div style={styles.squaregrid}>
        {this.renderCells()}
    </div>
    )
  }
}

export default Gridbox;
