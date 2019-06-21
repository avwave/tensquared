import React, { Component } from "react";
import socketIOClient from 'socket.io-client'

let ENDPOINT = '/';
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  ENDPOINT = 'http://localhost:8081'
}

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
      onColor: 'red',
      offColor: 'green',
      cells: Array(100).fill().map(() => Array(100).fill({col:'green'}))
    };
    this.socket = socketIOClient(ENDPOINT)
  }

  componentDidMount() {
    this.socket.on('flip box', ({value, x, y}) => {
      this.flipCell(value, x, y)
    })
    this.socket.on('init', ({ cells }) => {
      console.log("TCL: Gridbox -> cells", cells)
      this.setState({cells})
    })
  }
  send = (value, x, y) => {
    const currentCell = this.state.cells[x][y]
    let color = this.state.onColor;
    if (currentCell.col === this.state.onColor) {
      color = this.state.offColor
    }
    console.log("TCL: send SOCKET flip box-> ", value, color, x, y)
    this.socket.emit('flip box', {color, x, y})
  }

  flipCell = (col, x, y) => {
    console.log("TCL: flipCell -> col, x, y", col, x, y)
    const cells = this.state.cells
    cells[x][y] = { ...col };
    this.setState({cells})
  }

  renderCells = () => {
    return this.state.cells.map((row, x) => {
      return (
        row.map((cell, y) => {
          return (
            <div key={`${x}-${y}-${cell.col}`}
              style={{backgroundColor:cell.col}}
              onClick={() => {
                this.send(cell.col, x, y)
            }}></div>
          )
        })
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
