import React, { Component } from "react";
import { Nav } from "./nav";
import { connect } from "react-redux";
import LockInfo from "./lockInfo.js";
import custom from "../styles/custom.css"; // eslint-disable-line no-unused-vars
import demoStyle from "../styles/demo2.css"; // eslint-disable-line no-unused-vars

class Demo2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locks: [{
        lockId: 3,
        admins: [
          {
            name: "Ray",
            lockIds: [
              3,
              32
            ]
          },
          {
            name: "syd",
            lockIds: [
              2,
              4,
              3
            ]
          }
        ]
      }]
    }
  }

  render() {
    return (
      <div styleName="custom.container">
        <Nav {...this.props} />
        <section styleName="custom.header">
          <h2>Locks</h2>
          <ul>
            {this.state.locks.map((lock) => {
                console.log("AdminList: ", lock)
                return (
                  <LockInfo 
                    lockId={lock.lockId}
                    adminList={lock.admins}
                  />
                )
              })
            }
          </ul>
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
