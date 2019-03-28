import React, { Component } from "react";
import ReactDOM from "react-dom";
import firebase from "firebase";
// import "firebase/auth";

import Header from "./components/header";
import Items from "./components/items";
import Login from "./components/login";

import "./styles.css";

const auth = firebase.auth();

class App extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      isLoggedin: false
    };
    // this.handleChange = this.handleChange.bind(this);
    this.login = this.login.bind(this);
  }

  componentDidMount() {
    let logged = localStorage.getItem("isLoggedin");
    logged
      ? this.setState({ isLoggedin: true }) && this.setState({ user: "osama" })
      : this.setState({ isLoggedin: false });
  }

  // handleChange(e) {
  //   this.setState({ [e.target.name]: e.target.value });
  // }

  login(e) {
    e.preventDefault();
    if (e.keyCode === 13) {
      auth
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then((cred, error) => {
          if (error) {
            alert(error.message);
          }
          this.setState({ isLoggedin: true });
          localStorage.setItem("isLoggedin", true);
          this.setState({ email: "", password: "" });
          // localStorage.setItem("user", cred.user.email);
        });
    } else {
      this.setState({ [e.target.name]: e.target.value });
    }

    // if (e.keyCode === 13) {
    //   if (e.target.value === "word") {
    //     this.setState({ isLoggedin: true });
    //     localStorage.setItem("isLoggedin", true);
    //     e.target.value = "";
    //   } else {
    //     e.target.value = "";
    //     this.setState({ isLoggedin: false });
    //   }
    // }
  }

  render() {
    return (
      <>
        {this.state.isLoggedin ? (
          <div className="App">
            <Header />
            <Items />
          </div>
        ) : (
          <Login login={this.login} onChange={this.handleChange} />
        )}
      </>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
