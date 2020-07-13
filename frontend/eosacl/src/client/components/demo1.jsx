import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Nav } from "./nav";
import { inputName, inputTextarea, selectOption, passwordName, updateAdminLockIds, updateUserLockIds, setUser, updateTargetUsername, updateTargetRole, updateAuthenticated } from "../actions";
import custom from "../styles/custom.css"; // eslint-disable-line no-unused-vars
import demoStyle from "../styles/demo1.css"; // eslint-disable-line no-unused-vars
import ApiService from '../services/ApiService';
import AccessSharing from './access-sharing';
import axios from 'axios';
import Demo2 from "./demo2"

const networkJson = {
  blockchain:'eos',
  host:'localhost',
  port:8888,
  protocol:'http',
  chainId:'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f'
};

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
      targetUsername: { value: ""},
      targetRole: { value: 10},
    };

    this.claimlock = this.claimlock.bind(this);
    this.sharekey = this.sharekey.bind(this);
    this.test = this.test.bind(this);
    this.logout = this.logout.bind(this);
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
    event.preventDefault();
    const {username, targetUsername, targetRole, textarea} = this.props;
    const lockId = textarea;
    
    debugger;
    // ApiService.sharekey('bob', 'alice', 2, 20).then(() => {
    ApiService.sharekey(username, targetUsername, lockId, targetRole).then((result) => {
      debugger;
      console.log('done!')
    }).catch(error => {
      debugger;
      const errorMessage = `Error: ${error.message}`
      console.log(`error ${errorMessage}`);
      alert(errorMessage)
    });
  }

  claimlock(event) {
    // alert("hi");
    // debugger;
    event.preventDefault();
    this.test().then(e => {console.log('asld;j')})
    const lockId = parseInt(this.props.textarea);
    // const lockId = parseInt(this.state.textarea);
    ApiService.claimlock('bob', lockId).then((result) => {
      debugger;
      console.log('done!')
    }).catch(error => {
      debugger;
      const errorMessage = `Error: ${error.message}`
      console.log(`error ${errorMessage}`);
      alert(errorMessage)
    });
  }

  logout(event) {
    event.preventDefault();
    // debugger;
    // const account = ScatterService.scatterConnect();

    const { dispatch, username } = this.props;
    const network = ScatterJS.Network.fromJson(networkJson);
    // return ScatterJS.scatter.connect("bob", {network}).then(connected => {
    // return ScatterJS.scatter.connect(username, {network}).then(connected => {
      return ScatterJS.logout().then(result => {
        if (!result) {
          alert(`issue logging out`)
        }

        dispatch(updateAuthenticated(false));
        dispatch(inputName(''));
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
          <h2>{`${this.props.username}'s`} Access Management</h2>
            {/* <form onSubmit={this.test}> */}
            {/* <form>
              <input type="submit" value="ShareKey" onClick={this.sharekey}/>
            </form> */}
            <form>
            {/* <form onSubmit={this.claimlock}> */}
            <label htmlFor="lockIdField">Lock ID</label>
            <input
                  type="text"
                  // type="password"
                  placeholder="Lock ID"
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
              {/* <input type="submit" value="ClaimLock"/> */}

              {/* <fieldset> */}
              <label htmlFor="nameField">Target User</label>
              <input
                type="text"
                placeholder="EOS Account Username"
                id="targetUserField"
                value={this.props.targetUsername}
                onChange={event => {
                  dispatch(updateTargetUsername(event.target.value));
                }}
              />
              <label htmlFor="roleField">Target Role</label>
              <input
                type="text"
                placeholder="Role you would like to grant to target user"
                id="targetRoleField"
                value={this.props.targetRole}
                onChange={e => {
                  dispatch(updateTargetRole(e.target.value));
                }}
              />
              <input type="submit" value="Share Key" onClick={this.sharekey}/>
              {/* <input type="submit" value="Send"/> */}
              <input type="submit" value="Claim Lock" onClick={this.claimlock}/>
              <input type="submit" value="Log Out" onClick={this.logout}/>
            {/* </fieldset> */}
              {/* <input
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
              <input type="submit" value="Share Key" onClick={this.claimlock}/> */}
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
  targetUsername: PropTypes.string,
  targetRole: PropTypes.number,
  selectedOption: PropTypes.string,
  dispatch: PropTypes.func.isRequired
  // selectedOption: PropTypes.string,
  // selectedOption: PropTypes.string,
};

const mapStateToProps = state => {
  return {
    username: state.username.value,
    targetUsername: state.targetUsername.value,
    targetRole: state.targetRole.value,
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
