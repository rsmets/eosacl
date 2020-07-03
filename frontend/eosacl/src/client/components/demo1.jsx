import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Nav } from "./nav";
import { inputName, inputTextarea, selectOption, passwordName, updateAdminLockIds, updateUserLockIds, setUser } from "../actions";
import custom from "../styles/custom.css"; // eslint-disable-line no-unused-vars
import demoStyle from "../styles/demo1.css"; // eslint-disable-line no-unused-vars
import ApiService from '../services/ApiService';
import AccessSharing from './access-sharing';
import axios from 'axios';
import Demo2 from "./demo2"

class Demo1 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: { value: "" },
      passwordVal: { value: "" },
      adminLockIds: { value: [] },
      userLockIds: { value: [] },
      textarea: { value: "" },
      selectedOption: { value: "0-13" },
      lockId: { value: "" },
    };

    this.claimlock = this.claimlock.bind(this);
    this.test = this.test.bind(this);
  //   this.loadUser = this.loadUser.bind(this);
  //   // Call `loadUser` before mounting the app
  //   this.loadUser();
  // }

  // // Get latest user object from blockchain
  // loadUser() {
  //   // Extract `setUser` of `UserAction` and `user.name` of UserReducer from redux
  //   // const { setUser, username } = this.props;
  //   const { dispatch } = this.props;
  //   const { username } = this.props;
  //   debugger;
  //   // Send request the blockchain by calling the ApiService,
  //   // Get the user object and store the `win_count`, `lost_count` and `game_data` object
  //   return ApiService.getUserByName(username).then(user => {
  //     debugger;
  //     dispatch(inputName(user.username));
  //     dispatch(adminLockIds(user.lock_ids));
  //     dispatch(userLockIds(user.access_only_lock_ids));
  //     // setUser({
  //     //   lock_ids: user.lock_ids,
  //     //   access_only_lock_ids: user.access_only_lock_ids,
  //     //   win_count: user.win_count,
  //     //   lost_count: user.lost_count,
  //     //   game: user.game_data,
  //     // });
  //   });
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
      const errorMessage = `Error: ${error.message}}`
      console.log(`error ${errorMessage}`);
      alert(errorMessage)
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
            <h2>Access Management</h2>
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
          <Demo2
            username= {this.props.username}
            adminLockIds= {this.props.adminLockIds}
            userLockIds= {this.props.userLockIds}
          />
        </div>
      );
    }
  }

Demo1.propTypes = {
  username: PropTypes.string,
  // adminLockIds: PropTypes.array,
  // userLockIds: PropTypes.array,
  textarea: PropTypes.string,
  selectedOption: PropTypes.string,
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    username: state.username.value,
    setUser,
    // adminLockIds: state.adminLockIds.value,
    // userLockIds: state.userLockIds.value,
    textarea: state.textarea.value,
    selectedOption: state.selectedOption.value
  };
};

export default connect(
  mapStateToProps,
  dispatch => ({ dispatch })
)(Demo1);
