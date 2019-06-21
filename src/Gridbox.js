import React, { Component } from "react";

const styles = {
  squaregrid: {
    height: "auto",
    display: "grid",
    gridTemplate: "repeat(10, 3vw) / repeat(10, 3vw)",
    gridGap: "1px"
  },
  onCell: {
    background: "#c00",
    
  },
  offCell: {
    background: "#0c0",
    
  }
};

class Gridbox extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      cells: new Array(100).fill(false)
    };
  }
  flipCell = (cell, i) => {
    const cells = this.state.cells
    cells[i] = !cell;
    this.setState({cells})
  }
  renderCells = () => {
    return this.state.cells.map((cell, i) => {
      return (
        <div key={i}
          style={cell?styles.onCell:styles.offCell}
          onClick={() => {
            this.flipCell(cell, i)
          }}></div>
      )
    })
  }
  render() {
    console.log("TCL: Gridbox -> render -> this.state", this.state)
    return (
      <div style={styles.squaregrid}>
        {this.renderCells()}
    </div>
    )
  }
}

export default Gridbox;
