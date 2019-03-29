import React, { Component } from "react";

class Login extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="login-container">
        <div className="illustration-container">
          <div className="illustration" />
          <h1 draggable>Shopylist</h1>
        </div>
        <div className="login-form">
          <form autoComplete="on">
            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={this.props.onChange}
              onKeyUp={this.props.login}
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={this.props.onChange}
              onKeyUp={this.props.login}
            />
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
