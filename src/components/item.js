import React, { Component } from "react";

class Item extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <li className={this.props.done ? "crossed" : ""}>
        <p onClick={this.props.crossItem}>{this.props.name}</p>
        <button onClick={this.props.deleteItem} id="deleteBtn" />
      </li>
    );
  }
}

export default Item;
