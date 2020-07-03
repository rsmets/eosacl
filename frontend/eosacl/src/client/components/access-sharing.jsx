import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Nav } from "./nav";
import { inputName, inputTextarea, selectOption, passwordName } from "../actions";
import custom from "../styles/custom.css"; // eslint-disable-line no-unused-vars
// import demoStyle from "../styles/demo1.css"; // eslint-disable-line no-unused-vars
import ApiService from '../services/ApiService';

class AccessSharing extends Component {
  constructor(props) {
    super(props);

    this.state = {
    //   username: { value: "" },
    //   passwordVal: { value: "" },
      textarea: { value: "" },
    //   selectedOption: { value: "0-13" },
    //   lockId: { value: "" },
    };

    this.claimlock = this.claimlock.bind(this);
  }

  handleSubmit(event) {
    alert (this.state.textarea)
  }

  sharekey() {
    // alert("hi");
    ApiService.sharekey('bob', 'alice', 2, 20).then(() => {
      debugger;
      console.log('done!')
    }).catch(error => {
      debugger;
      console.log(`error ${error}`);
    });
  }

  claimlock() {
    // alert("hi");
    debugger;
    const lockId = this.state.textarea;
    ApiService.claimlock('bob', lockId).then(() => {
      debugger;
      console.log('done!')
    }).catch(error => {
      debugger;
      console.log(`error ${error}`);
    });
  }

  render() {
    // const { dispatch } = this.props;
    return (
      <div styleName="custom.container">
        <Nav {...this.props} />
        <div styleName="demoStyle.container">
          <h2>Login</h2>
          {/* <form onSubmit={this.test}> */}
          <form>
          {/* <fieldset>
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
                placholder="Rays Dick Size"
                id="passwordField"
                value={this.props.passwordVal}
                onChange={e => {
                  dispatch(passwordName(e.target.value));
                }}
              />
              <input type="submit" value="Send" onClick={this.claimlock}/>
            </fieldset> */}
            {/* <input type="submit" value="Send" onClick={this.claimlock}/> */}
            <input type="submit" value="ShareKey" onClick={this.sharekey}/>
          </form>
          <form>
          <input
                type="text"
                // type="password"
                // placholder="Rays Dick Size"
                // id="passwordField"
                id = "lockIdInput"
                value={this.props.textarea}
                // value={this.state.textarea}
                onChange={e => {
                //   dispatch(inputTextarea(e.target.value));
                  this.setState({textarea: e.target.textarea})
                }}
              />
            <input type="submit" value="ClaimLock" onClick={this.claimlock}/>
            {/* <input type="submit" value="ClaimLock"/> */}
            </form>
        </div>
      </div>
    );
  }
}

// Lock.propTypes = {
//   username: PropTypes.string,
//   textarea: PropTypes.string,
//   selectedOption: PropTypes.string,
//   dispatch: PropTypes.func.isRequired
// };

// const mapStateToProps = state => {
//   return {
//     username: state.username.value,
//     textarea: state.textarea.value,
//     selectedOption: state.selectedOption.value
//   };
// };

// export default connect(
//   mapStateToProps,
//   dispatch => ({ dispatch })
// )(Demo1);
