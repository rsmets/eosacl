import React, { Component } from "react";
import { Nav } from "./nav";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { inputName, inputTextarea, selectOption, passwordName, updateAdminLockIds, updateUserLockIds, setUser } from "../actions";
import LockInfo from "./lockInfo.js";
import custom from "../styles/custom.css"; // eslint-disable-line no-unused-vars
import demoStyle from "../styles/demo2.css"; // eslint-disable-line no-unused-vars
import demo1 from "./demo1";
import ApiService from '../services/ApiService';

class Demo2 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: { value: "" },
      adminLockIds: { value: [] },
      userLockIds: { value: [] },
    }
    // this.state = {
    //   adminLockIds: {value: []},
    //   userLockIds: {value: []},
    //   // locks: [{
    //   //   lockId: 3,
    //   //   admins: [
    //   //     {
    //   //       name: "Ray",
    //   //       lockIds: [
    //   //         3,
    //   //         32
    //   //       ]
    //   //     },
    //   //     {
    //   //       name: "syd",
    //   //       lockIds: [
    //   //         2,
    //   //         4,
    //   //         3
    //   //       ]
    //   //     }
    //   //   ]
    //   // }]
    // }


    this.loadUser = this.loadUser.bind(this);
    // Call `loadUser` before mounting the app
    this.loadUser();
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
  // }

  render() {
    const {adminLockIds, userLockIds, user} = this.props;
    // const {user: {lock_ids, access_only_lock_ids}} = this.props;
    // debugger;
    return (
      <div styleName="custom.container">
        <Nav {...this.props} />
        <section styleName="custom.header">
          <h2>{this.props.username}</h2>
          <ul> 
            {/* adminLockIds: {this.props.adminLockIds}
            userLockIds: {this.props.userLockIds} */}
            adminLockIds: {user && user.lock_ids ? 
              user.lock_ids.map(id => <ul>{id}</ul>)
              : 'none'}
            userLockIds: {user && user.access_only_lock_ids ? 
              user.access_only_lock_ids.map(id => <ul>{id}</ul>)
              : 'none'}
          </ul>
           {/* {this.state.locks.map((lock) => {
                console.log("AdminList: ", lock)
                return (
                  <LockInfo 
                    lockId={lock.lockId}
                    adminList={lock.admins}
                  />
                )
              })} */}
        </section>
      </div>
    );
  }
}

// Demo2.propTypes = {
//   username: PropTypes.string,
//   adminLockIds: PropTypes.array,
//   userLockIds: PropTypes.array,
// }

const mapStateToProps = state => {
  return {
    username: state.username.value,
    user: state.user
  };
};

// const mapStateToProps = () => {
//   return {}
// }

export default connect(
  mapStateToProps,
  dispatch => ({ dispatch })
)(Demo2);


