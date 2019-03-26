import React, { Component } from "react";
import firebase from "firebase/app";
import "firebase/database";

import Item from "./item";

var config = {
  apiKey: "AIzaSyA54lhjIOzHbkKi1rHsiWyVlWQdRhj3kwk",
  authDomain: "shopylist-31adb.firebaseapp.com",
  databaseURL: "https://shopylist-31adb.firebaseio.com",
  projectId: "shopylist-31adb",
  storageBucket: "shopylist-31adb.appspot.com",
  messagingSenderId: "830562930433"
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const database = firebase.database();
let itemsRef = database.ref("items/");

class Items extends Component {
  constructor() {
    super();
    this.state = {
      items: []
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.addItem = this.addItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.deleteAllItems = this.deleteAllItems.bind(this);
    this.crossItem = this.crossItem.bind(this);
  }

  componentDidMount() {
    itemsRef.on("value", snapshot => {
      this.setState({
        items: snapshotToArray(snapshot)
      });
    });
  }

  addItem(name, done) {
    database.ref("items/").push({
      name,
      done: false
    });
  }

  crossItem(id) {
    itemsRef
      .child(id)
      .once("value")
      .then(snapshot =>
        snapshot.val().done
          ? itemsRef.child(id).update({ done: false })
          : itemsRef.child(id).update({ done: true })
      );

    // this.setState({
    //   items: this.state.items.map((e, index) =>
    //     i === index ? (e = { name: e.name, done: !e.done }) : e
    //   )
    // });
  }

  deleteItem(id) {
    database.ref("items/" + id).remove();
    // this.setState({
    //   items: this.state.items.filter((e, index) => index !== i)
    // });
  }

  deleteAllItems() {
    itemsRef.remove();
  }

  handleSubmit(e) {
    e.preventDefault();
    if (e.keyCode === 13) {
      // this.setState({
      //   items: [
      //     ...this.state.items,
      //     { name: this.capFirst(e.target.value), done: false }
      //   ]
      // });
      this.addItem(this.capFirst(e.target.value));
      e.target.value = "";
    }
  }

  capFirst(str) {
    return str[0].toUpperCase() + str.slice(1);
  }

  render() {
    return (
      <main>
        <div className="panel">
          <input
            id="item_input"
            className="item_input"
            placeholder="Item name..."
            onKeyUp={this.handleSubmit}
          />
        </div>

        <div className="item-list-div">
          <ul id="item-list" className="item-list">
            {this.state.items.map((e, i) => (
              <Item
                key={i}
                name={e.name}
                done={e.done}
                id={e.key}
                crossItem={() => this.crossItem(e.key)}
                deleteItem={() => this.deleteItem(e.key)}
              />
            ))}
          </ul>
        </div>

        <div className="stats">
          <p id="entries">Total items: {this.state.items.length}</p>
          <p id="remaining">
            Remaining items:{" "}
            {this.state.items.length -
              this.state.items.filter(e => e.done === true || e.done === "true")
                .length}
          </p>
          <button
            id="clear_Btn"
            className="clear_Btn"
            onClick={this.deleteAllItems}
          >
            Clear all
          </button>
        </div>
      </main>
    );
  }
}

export default Items;

function snapshotToArray(snapshot) {
  var returnArr = [];
  snapshot.forEach(function(childSnapshot) {
    var item = childSnapshot.val();
    item.key = childSnapshot.key;

    returnArr.push(item);
  });
  return returnArr;
}
