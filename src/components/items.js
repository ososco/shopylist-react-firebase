import React, { Component } from "react";
import firebase from "firebase";
import "firebase/database";
import Autosuggest from "react-autosuggest";
import AutosuggestHighlightMatch from "autosuggest-highlight/match";
import AutosuggestHighlightParse from "autosuggest-highlight/parse";

import { snapshotToArray } from "../helpers";

import Item from "./item";
import { suggestions } from "../helpers/suggestions.js";

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

function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getSuggestions(value) {
  const escapedValue = escapeRegexCharacters(value.trim());

  if (escapedValue === "") {
    return [];
  }

  const regex = new RegExp("^" + escapedValue, "i");

  return suggestions.filter(item => regex.test(item));
}

function getSuggestionValue(suggestion) {
  return suggestion;
}

function renderSuggestion(suggestion, { query }) {
  const matches = AutosuggestHighlightMatch(suggestion, query);
  const parts = AutosuggestHighlightParse(suggestion, matches);

  return (
    <span>
      {parts.map((part, index) => {
        const className = part.highlight
          ? "react-autosuggest__suggestion-match"
          : null;

        return (
          <span className={className} key={index}>
            {part.text}
          </span>
        );
      })}
    </span>
  );
}

class Items extends Component {
  constructor() {
    super();
    this.state = {
      items: [],
      value: "",
      suggestions: []
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
  }

  deleteItem(id) {
    database.ref("items/" + id).remove();
  }

  deleteAllItems() {
    itemsRef.remove();
  }

  handleSubmit(e) {
    e.preventDefault();
    if (e.keyCode === 13) {
      this.addItem(this.capFirst(e.target.value));
      this.setState({ value: "" });
      // e.target.value = "";
    }
  }

  onChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue
    });
  };

  capFirst(str) {
    return str[0].toUpperCase() + str.slice(1);
  }

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value)
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  onDragStart = (e, index) => {
    this.draggedItem = this.state.items[index];
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.parentNode);
    e.dataTransfer.setDragImage(e.target.parentNode, 20, 20);
  };

  onDragOver = index => {
    const draggedOverItem = this.state.items[index];

    // if the item is dragged over itself, ignore
    if (this.draggedItem === draggedOverItem) {
      return;
    }

    // filter out the currently dragged item
    let items = this.state.items.filter(item => item !== this.draggedItem);

    // add the dragged item after the dragged over item
    items.splice(index, 0, this.draggedItem);

    this.setState({ items });
  };

  onDragEnd = () => {
    this.draggedIdx = null;
  };

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: "Item name...",
      value,
      onChange: this.onChange,
      onKeyUp: this.handleSubmit
    };

    return (
      <main>
        <div className="panel">
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
          />
        </div>

        <div className="item-list-div">
          <ul id="item-list" className="item-list">
            {this.state.items.map((e, i) => (
              <li
                key={i}
                className={e.done ? "crossed" : ""}
                onDragOver={() => this.onDragOver(i)}
              >
                <div
                  className="drag"
                  draggable
                  onDragStart={e => this.onDragStart(e, i)}
                  onDragEnd={this.onDragEnd}
                >
                  <p onClick={() => this.crossItem(e.key)}>{e.name}</p>
                  <button
                    onClick={() => this.deleteItem(e.key)}
                    id="deleteBtn"
                  />
                </div>
              </li>
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
