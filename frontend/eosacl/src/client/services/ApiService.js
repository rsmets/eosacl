import { Api, JsonRpc } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';
const { TextEncoder, TextDecoder } = require('text-encoding');

const ENDPOINT = "http://localhost:8888"
const CONTRACT_NAME = 'eosacl'
// const privateKey = "5JXwk5XaG4JaKH5xqkRTs73pZTLNwTzvC6pxRHPmFBuAyr7FMpe" //|| dataValue.key || localStorage.getItem("cardgame_key");
// // const rpc = new JsonRpc(process.env.REACT_APP_EOS_HTTP_ENDPOINT);
// const rpc = new JsonRpc("http://localhost:8888", {});
// const signatureProvider = new JsSignatureProvider([privateKey]);
// debugger;
// const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

// Main action call to blockchain
async function takeAction(action, dataValue) {
  const privateKey = "5JXwk5XaG4JaKH5xqkRTs73pZTLNwTzvC6pxRHPmFBuAyr7FMpe" //|| dataValue.key || localStorage.getItem("cardgame_key");
  // const rpc = new JsonRpc(process.env.REACT_APP_EOS_HTTP_ENDPOINT);
  const rpc = new JsonRpc(ENDPOINT, {});
  const signatureProvider = new JsSignatureProvider([privateKey]);
  // debugger;
  

  // Main call to blockchain after setting action, account_name and data
  try {
    console.log(1)
    const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
    console.log(2)
    // debugger;
    const resultWithConfig = await api.transact({
      actions: [{
        // account: process.env.REACT_APP_EOS_CONTRACT_NAME,
        account: CONTRACT_NAME,
        name: action,
        authorization: [{
          // actor: localStorage.getItem("cardgame_account"),
          actor: 'bob', // account paying for resources
          permission: 'active',
        }],
        data: dataValue,
      }]
    }
    , {
      blocksBehind: 3,
      expireSeconds: 30,
    }
    );
    // debugger;
    console.log(3)
    return resultWithConfig;
  } catch (err) {
    debugger;
    console.log(4)
    throw(err)
  }
}

class ApiService {

  static getCurrentUser() {
    return new Promise((resolve, reject) => {
      if (!localStorage.getItem("cardgame_account")) {
        return reject();
      }
      takeAction("login", { username: localStorage.getItem("cardgame_account") })
        .then(() => {
          resolve(localStorage.getItem("cardgame_account"));
        })
        .catch(err => {
          localStorage.removeItem("cardgame_account");
          localStorage.removeItem("cardgame_key");
          reject(err);
        });
    });
  }

  static login({ username, key }) {
    return new Promise((resolve, reject) => {
      localStorage.setItem("cardgame_account", username);
      localStorage.setItem("cardgame_key", key);
    //   takeAction("login", { user: username, message: key })
    // console.log(`key ${key}`)
    // console.log(`username ${username}`)
      takeAction("login", { user: username })
        .then(() => {
          resolve();
        })
        .catch(err => {
          localStorage.removeItem("cardgame_account");
          localStorage.removeItem("cardgame_key");
          reject(err);
        });
    });
  }

  static claimlock(owner, lock_id) {
    // debugger;
      // return takeAction("claimlock", {user: localStorage.getItem('cardgame_account')});
      return takeAction("claimlock", {owner, lock_id});
  }

  static sharekey(sender, recipient, lock_id, role) {
    // return takeAction("sharekey", {user: localStorage.getItem('cardgame_account'), player_card_index: cardHandIndex});
    // debugger;
    return takeAction("sharekey", {sender, recipient, lock_id, role});
}

static revokekey() {
    return takeAction("revokekey", { user: localStorage.getItem("cardgame_account") });
 }
  
 static checkaccess() {
    return takeAction("checkaccess", { username: localStorage.getItem("cardgame_account") });
 }

  static async getUserByName(username) {
    // debugger;
    console.log(1)
    try {
      // const rpc = new JsonRpc(process.env.REACT_APP_EOS_HTTP_ENDPOINT);
      const rpc = new JsonRpc(ENDPOINT);
      const result = await rpc.get_table_rows({
        "json": true,
        // "code": process.env.REACT_APP_EOS_CONTRACT_NAME,    // contract who owns the table
        // "scope": process.env.REACT_APP_EOS_CONTRACT_NAME,   // scope of the table
        "code": CONTRACT_NAME,    // contract who owns the table
        "scope": CONTRACT_NAME,   // scope of the table
        "table": "users",    // name of the table as specified by the contract abi
        "limit": 1,
        "lower_bound": username,
      });
      console.log(2)
      // debugger
      return result.rows[0]; //eosjs returns more than just rows... but here only care about that
    } catch (err) {
      console.log(3)
      debugger
      console.error(err);
    }
  }

}

export default ApiService;
