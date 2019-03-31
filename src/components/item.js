import React, { Component } from "react";

class Item extends Component {
  constructor() {
    super();
  }

  render() {
    const { name, done, crossItem, deleteItem } = this.props;
    return (
      <li draggable className={done ? "crossed" : null}>
        <p onClick={crossItem}>{name}</p>
        <button onClick={deleteItem} id="deleteBtn" />
      </li>
    );
  }
}

export default Item;
