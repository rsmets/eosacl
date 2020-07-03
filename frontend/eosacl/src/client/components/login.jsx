import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Nav } from "./nav";
import { inputName, inputTextarea, selectOption, passwordName, setUser } from "../actions";
import custom from "../styles/custom.css"; // eslint-disable-line no-unused-vars
import demoStyle from "../styles/demo1.css"; // eslint-disable-line no-unused-vars
import ApiService from '../services/ApiService';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: { value: "" },
      passwordVal: { value: "" },
      textarea: { value: "" },
      selectedOption: { value: "0-13" }
    };
//   }
    this.loadUser = this.loadUser.bind(this);
    // Call `loadUser` before mounting the app
    // this.loadUser();
  }

  // Get latest user object from blockchain
  loadUser(event) {
    event.preventDefault();
    // Extract `setUser` of `UserAction` and `user.name` of UserReducer from redux
    // const { setUser, username } = this.props;
    const { dispatch } = this.props;
    const { username } = this.props;
    debugger;
    // Send request the blockchain by calling the ApiService,
    // Get the user object and store the `win_count`, `lost_count` and `game_data` object
    return ApiService.getUserByName(username).then(user => {
      debugger;
    //   dispatch(inputName(user.username));
    //   dispatch(adminLockIds(user.lock_ids));
    //   dispatch(userLockIds(user.access_only_lock_ids));
      dispatch(setUser({
        lock_ids: user.lock_ids,
        access_only_lock_ids: user.access_only_lock_ids,
      }));
    });

}

  render() {
    const { dispatch } = this.props;
    return (
      <div styleName="custom.container">
        <Nav {...this.props} />
        <div styleName="demoStyle.container">
          <h2>Login</h2>
          <form onSubmit={this.loadUser}>
          {/* <form> */}
            <fieldset>
              <label htmlFor="nameField">Name</label>
              <input
                type="text"
                placeholder="Electrode User"
                id="nameField"
                value={this.props.username}
                onChange={event => {
                  dispatch(inputName(event.target.value));
                }}
              />
              <label htmlFor="ageRangeField">Password</label>
              <input
                type="password"
                id="passwordField"
                value={this.props.passwordVal}
                onChange={e => {
                  dispatch(passwordName(e.target.value));
                }}
              />
              {/* <input type="submit" value="Send" onClick={this.loadUser}/> */}
              <input type="submit" value="Send"/>
            </fieldset>
          </form>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  username: PropTypes.string,
  textarea: PropTypes.string,
  selectedOption: PropTypes.string,
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    username: state.username.value,
    textarea: state.textarea.value,
    selectedOption: state.selectedOption.value
  };
};

export default connect(
  mapStateToProps,
  dispatch => ({ dispatch })
)(Login);
