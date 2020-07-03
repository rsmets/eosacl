import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Nav } from "./nav";
import { inputName, inputTextarea, selectOption, passwordName } from "../actions";
import custom from "../styles/custom.css"; // eslint-disable-line no-unused-vars
import demoStyle from "../styles/demo1.css"; // eslint-disable-line no-unused-vars
import ApiService from '../services/ApiService';
import AccessSharing from './access-sharing';
import axios from 'axios';

class Demo1 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: { value: "" },
      passwordVal: { value: "" },
      textarea: { value: "" },
      selectedOption: { value: "0-13" },
      lockId: { value: "" },
    };

    this.claimlock = this.claimlock.bind(this);
    this.test = this.test.bind(this);
  }

  handleSubmit(event) {
    // alert (this.state.textarea)
    debugger;
    event.preventDefault();
    debugger;
    this.claimlock();
  }

  test() {
    // const body = {
    //   requestingUser,
    //   groupId,
    //   targetLockIds: lockIdsToRemove,
    // }
  
    // const httpsAgent = new https.Agent({ rejectUnauthorized: process.env.NODE_ENV != 'local' , servername: '*.nexkey.com'});
    // send request to external UserGroup Service
    // return axios.post('localhost:1337' + "/rest/func", JSON.stringify(body), {
    return axios.get('https://google.com')
    .then(async (response) => {
      if(response && response.status == 200) {
        console.log(`goog yes`)
      }
    }).catch(e => {
      console.log(e);
    })
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

  claimlock(event) {
    // alert("hi");
    // debugger;
    event.preventDefault();
    this.test().then(e => {console.log('asld;j')})
    const lockId = parseInt(this.props.textarea);
    // const lockId = parseInt(this.state.textarea);
    ApiService.claimlock('bob', lockId).then(() => {
      debugger;
      console.log('done!')
    }).catch(error => {
      debugger;
      console.log(`error ${error}`);
    });
  }

  // render() {
  //   // const { dispatch } = this.props;
  //   return (
  //     <div styleName="custom.container">
  //       HI
  //       <AccessSharing></AccessSharing>
  //     </div>
  //   );
  // }
// }

render() {
      const { dispatch } = this.props;
      return (
        <div styleName="custom.container">
          <Nav {...this.props} />
          <div styleName="demoStyle.container">
            <h2>Login</h2>
            {/* <form onSubmit={this.test}> */}
            {/* <form>
              <input type="submit" value="ShareKey" onClick={this.sharekey}/>
            </form> */}
            {/* <form> */}
            <form onSubmit={this.claimlock}>
            <input
                  type="text"
                  // type="password"
                  // placholder="Rays Dick Size"
                  // id="passwordField"
                  // id = "lockIdInput"
                  value={this.props.textarea}
                  // value={this.state.textarea}
                  onChange={e => {
                    // debugger;
                    dispatch(inputTextarea(e.target.value));
                    // this.setState({textarea: e.target.value})
                  }}
                />
              {/* <input type="submit" value="ClaimLock" onClick={this.claimlock}/> */}
              <input type="submit" value="ClaimLock"/>
              </form>
          </div>
        </div>
      );
    }
  }

Demo1.propTypes = {
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
)(Demo1);
