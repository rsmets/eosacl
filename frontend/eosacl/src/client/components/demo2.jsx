import React, { Component } from "react";
import { Nav } from "./nav";
import { connect } from "react-redux";
import { inputName, inputTextarea, selectOption, passwordName, adminLockIds, userLockIds } from "../actions";
import LockInfo from "./lockInfo.js";
import custom from "../styles/custom.css"; // eslint-disable-line no-unused-vars
import demoStyle from "../styles/demo2.css"; // eslint-disable-line no-unused-vars

class Demo2 extends Component {
  constructor(props) {
    super(props);
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
    const { username } = this.props;
    debugger;
    // Send request the blockchain by calling the ApiService,
    // Get the user object and store the `win_count`, `lost_count` and `game_data` object
    // return ApiService.getUserByName(username).then(user => {
    //   debugger;
    //   setUser({
    //     lock_ids: user.lock_ids,
    //     access_only_lock_ids: user.access_only_lock_ids,
    //     win_count: user.win_count,
    //     lost_count: user.lost_count,
    //     game: user.game_data,
    //   });
    // });
  }

  render() {
    return (
      <div styleName="custom.container">
        <Nav {...this.props} />
        <section styleName="custom.header">
          <h2>{this.props.username}</h2>
          <ul>
            {/* adminLockIds: {this.state.adminLockIds} */}
            {/* userLockIds: {this.state.userLockIds} */}
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

const mapStateToProps = () => {
  return {};
};

export default connect(
  mapStateToProps,
  dispatch => ({ dispatch })
)(Demo2);


