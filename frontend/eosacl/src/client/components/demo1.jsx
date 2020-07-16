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
import ScatterJS from 'scatterjs-core';
import {Link} from 'react-router-dom'
// import { withToastManager, useToasts } from 'react-toast-notifications';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
      selectedOption: { value: 10 },
      lockId: { value: "" },
      targetUsername: { value: ""},
      targetRole: { value: 10},
      eosAccount: {value: {}},
    };

    this.claimlock = this.claimlock.bind(this);
    this.sharekey = this.sharekey.bind(this);
    // this.test = this.test.bind(this);
    this.getHistory = this.getHistory.bind(this);
    this.logout = this.logout.bind(this);
    this.loadUser = this.loadUser.bind(this);
    this.logaccess = this.logaccess.bind(this);
    this.checkaccess = this.checkaccess.bind(this);
    this.revokekey = this.revokekey.bind(this);
  //   // Call `loadUser` before mounting the app
    this.loadUser();
  // }

  }

    // Get latest user object from blockchain
    loadUser() {
      // Extract `setUser` of `UserAction` and `user.name` of UserReducer from redux
      // const { setUser, username } = this.props;
      const { dispatch } = this.props;
      const { username } = this.props;
      // debugger;
      // Send request the blockchain by calling the ApiService,
      // Get the user object and store the `win_count`, `lost_count` and `game_data` object
      return ApiService.getUserByName(username).then(user => {
        // debugger;
        // dispatch(inputName(user.username));
        // dispatch(adminLockIds(user.lock_ids));
        // dispatch(userLockIds(user.access_only_lock_ids));
        // debugger;
        dispatch(setUser({
          lock_ids: user.lock_ids,
          access_only_lock_ids: user.access_only_lock_ids,
        }));
      });
    }

  handleSubmit(event) {
    // alert (this.state.textarea)
    debugger;
    event.preventDefault();
    debugger;
    this.claimlock();
  }

  // test() {
  //   // const body = {
  //   //   requestingUser,
  //   //   groupId,
  //   //   targetLockIds: lockIdsToRemove,
  //   // }
  
  //   // const httpsAgent = new https.Agent({ rejectUnauthorized: process.env.NODE_ENV != 'local' , servername: '*.nexkey.com'});
  //   // send request to external UserGroup Service
  //   // return axios.post('localhost:1337' + "/rest/func", JSON.stringify(body), {
  //   return axios.get('https://google.com')
  //   .then(async (response) => {
  //     if(response && response.status == 200) {
  //       console.log(`goog yes`)
  //     }
  //   }).catch(e => {
  //     console.log(e);
  //   })
  // }

  getHistory() {
    // alert("hi");
    event.preventDefault();
    const {username, targetUsername, targetRole, textarea, eosAccount} = this.props;
    const lockId = textarea;
    
    debugger;
    // ApiService.sharekey('bob', 'alice', 2, 20).then(() => {
    ApiService.getHistory(username, eosAccount).then((result) => {
      debugger;
      console.log('done!')
    }).catch(error => {
      debugger;
      const errorMessage = `Error: ${error.message}`
      console.log(`error ${errorMessage}`);
      alert(errorMessage)
    });
  }

  logaccess() {
    // alert("hi");
    event.preventDefault();
    const {username, targetUsername, targetRole, textarea, eosAccount, selectedOption} = this.props;
    const lockId = textarea;
    
    debugger;
    // ApiService.sharekey('bob', 'alice', 2, 20).then(() => {
    // ApiService.sharekey(username, targetUsername, lockId, targetRole, eosAccount).then((result) => {
    ApiService.logaccess(username, lockId, selectedOption, eosAccount).then((result) => {
      debugger;
      console.log('done!')

      alert('Access Logged!')

    // toast.success('🦄 Wow so easy!', {
    //   position: "top-right",
    //   autoClose: 5000,
    //   hideProgressBar: false,
    //   closeOnClick: true,
    //   pauseOnHover: true,
    //   draggable: true,
    //   progress: undefined,
    //   });

    //   <ToastProvider
    //   autoDismiss
    //   autoDismissTimeout={6000}
    //   components={{ Toast: Snack }}
    //   placement="bottom-center"
    // >
    //   Access Logged!
    // </ToastProvider>
      this.loadUser();
    }).catch(error => {
      debugger;
      const errorMessage = `Error: ${error.message}`
      console.log(`error ${errorMessage}`);
      alert(errorMessage)
    });
  }

  checkaccess() {
    // alert("hi");
    event.preventDefault();
    const {username, targetUsername, targetRole, textarea, eosAccount, selectedOption} = this.props;
    const lockId = textarea;
    
    debugger;
    // ApiService.sharekey('bob', 'alice', 2, 20).then(() => {
    // ApiService.sharekey(username, targetUsername, lockId, targetRole, eosAccount).then((result) => {
    ApiService.checkaccess(targetUsername, lockId, selectedOption, eosAccount).then((result) => {
      debugger;
      console.log('done!')

      alert('Has Access')

      this.loadUser();
    }).catch(error => {
      debugger;
      // alert('Does not have access')
      const errorMessage = `Error: ${error.message}`
      console.log(`error ${errorMessage}`);
      alert(errorMessage)
    });
  }

  sharekey() {
    // alert("hi");
    event.preventDefault();
    const {username, targetUsername, targetRole, textarea, eosAccount, selectedOption} = this.props;
    const lockId = textarea;
    
    debugger;
    // ApiService.sharekey('bob', 'alice', 2, 20).then(() => {
    // ApiService.sharekey(username, targetUsername, lockId, targetRole, eosAccount).then((result) => {
    ApiService.sharekey(username, targetUsername, lockId, selectedOption, eosAccount).then((result) => {
      debugger;
      console.log('done!')
      this.loadUser();
    }).catch(error => {
      debugger;
      const errorMessage = `Error: ${error.message}`
      console.log(`error ${errorMessage}`);
      alert(errorMessage)
    });
  }

  revokekey() {
    // alert("hi");
    event.preventDefault();
    const {username, targetUsername, targetRole, textarea, eosAccount, selectedOption} = this.props;
    const lockId = textarea;
    
    debugger;
    // ApiService.sharekey('bob', 'alice', 2, 20).then(() => {
    // ApiService.sharekey(username, targetUsername, lockId, targetRole, eosAccount).then((result) => {
    ApiService.revokekey(username, targetUsername, lockId, eosAccount).then((result) => {
      debugger;
      alert(`Key successfully revoked from ${targetUsername}`);
      console.log('done!')
      this.loadUser();
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
    const {username, eosAccount} = this.props;

    // this.test().then(e => {console.log('asld;j')})
    const lockId = parseInt(this.props.textarea);
    // const lockId = parseInt(this.state.textarea);
    ApiService.claimlock(username, lockId, eosAccount).then((result) => {
      debugger;
      console.log('done!')
      this.loadUser();
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
            <input type="submit" value="Log Out" onClick={this.logout}/>
            <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    // window.location.href=`https://eosauthority.com/account/${this.props.targetUsername}?network=eos`;
                    window.location.href=`https://eosauthority.com/account/rayzorsharp1?network=eos`;
                    }}
              > Get User Access History</button>

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

              <input type="submit" value="Log Access" onClick={this.logaccess}/>
              <input type="submit" value="Claim Lock" onClick={this.claimlock}/>

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

              <input type="submit" value="Check Access" onClick={this.checkaccess}/>

              <label htmlFor="roleField">Target Role</label>
              {/* <input
                type="text"
                placeholder="Role you would like to grant to target user"
                id="targetRoleField"
                value={this.props.targetRole}
                onChange={e => {
                  dispatch(updateTargetRole(e.target.value));
                }}
              /> */}
              <select
                id="roleSelector"
                onChange={event => {
                  dispatch(selectOption(event.target.value));
                  // dispatch(updateTargetRole(e.target.value));
                }}
                value={this.props.selectedOption}
                // value={this.props.targetRole}
              >
                <option value="10">User</option>
                <option value="20">Admin</option>
              </select>

              <input type="submit" value="Share Key" onClick={this.sharekey}/>
              <input type="submit" value="Revoke Key" onClick={this.revokekey}/>
              {/* <input type="submit" value="Send"/> */}


              {/* <input type="submit" value="Get User Access History" onClick={this.getHistory}/> */}
              {/* <Link to={`https://eosauthority.com/account/${this.props.targetUsername}?network=eos`}>
              <button type="button" className="btn btn-info">Get User Access History</button>
              </Link> */}

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
  eosAccount: PropTypes.object,
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
    eosAccount: state.eosAccount.value,
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
