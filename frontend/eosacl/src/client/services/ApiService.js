import { Api, JsonRpc } from 'eosjs2';
const eosjs2 = require('eosjs2');
// const fetch = require('node-fetch'); 

import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';
// import { eosjs_api } from 'eosjs/dist/eosjs-api';
// import { eosjs_jsonrpc } from 'eosjs/dist/eosjs_jssig';
import ScatterJS from 'scatterjs-core';
// import ScatterEOS1  from 'scatterjs-plugin-eosjs';
import ScatterEOS from 'scatterjs-plugin-eosjs2';
// import 'core-js/es6/symbol'; 
// require ('core-js/fn/symbol/iterator');

import EosService from './EosService'
import 'babel-polyfill';

ScatterJS.plugins( new ScatterEOS() );

const { TextEncoder, TextDecoder } = require('text-encoding');


    window.ScatterJS = null; 


const ENDPOINT = "http://localhost:8888"
const CONTRACT_NAME = 'eosacl'
const privateKey = "5JXwk5XaG4JaKH5xqkRTs73pZTLNwTzvC6pxRHPmFBuAyr7FMpe" //|| dataValue.key || localStorage.getItem("cardgame_key");

const networkJson = {
  blockchain:'eos',
  host:'localhost',
  port:8888,
  protocol:'http',
  chainId:'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f'
};

const network = ScatterJS.Network.fromJson(networkJson);
// const rpc = new JsonRpc(ENDPOINT);
const rpc = new eosjs2.Rpc.JsonRpc(ENDPOINT, { fetch });
const api = ScatterJS.eos(network, Api, {rpc})

// const networkJson = {
//   blockchain:'eos',
//   host:'localhost',
//   port:8888,
//   protocol:'http',
//   chainId:'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f'
// };

// const network = ScatterJS.Network.fromJson(networkJson);
// const rpc = new JsonRpc(ENDPOINT);

// const rpc = new JsonRpc(ENDPOINT, {});

const signatureProvider = new JsSignatureProvider([privateKey]);
// debugger;
// const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

// const api = ScatterJS.eos(network, Api, {rpc})

// Main action call to blockchain
async function takeAction(action, dataValue, account) {
  // const privateKey = "5JXwk5XaG4JaKH5xqkRTs73pZTLNwTzvC6pxRHPmFBuAyr7FMpe" //|| dataValue.key || localStorage.getItem("cardgame_key");
  // const rpc = new JsonRpc(process.env.REACT_APP_EOS_HTTP_ENDPOINT);
  const rpc = new JsonRpc(ENDPOINT, {});
  // const rpc = new eosjs2.Rpc.JsonRpc(ENDPOINT, { fetch });
  const signatureProvider = new JsSignatureProvider([privateKey]);
  // const signatureProvider = new eosjs2.SignatureProvider([privateKey]);
  debugger;
  

  // Main call to blockchain after setting action, account_name and data
  try {
    console.log(1)
    const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
    console.log(2)
    debugger;
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

// const rpc = new eosjs_jsonrpc.default(network.fullhost());
// const api = () => ScatterJS.eos(network, eosjs_api.default, {rpc})

async function takeScatterAction(action, dataValue, account) {
  // const networkJson = {
  //   blockchain:'eos',
  //   host:'localhost',
  //   port:8888,
  //   protocol:'http',
  //   chainId:'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f'
  // };
  
  // const network = ScatterJS.Network.fromJson(networkJson);
  // // const rpc = new JsonRpc(ENDPOINT);
  // const rpc = new eosjs2.Rpc.JsonRpc(ENDPOINT, { fetch });
  // const api = ScatterJS.eos(network, Api, {rpc})

  debugger;
  const id = await ScatterJS.login();
    if (!id) {
      alert(`not logged in`)
    }
    // debugger;

  //   try {
  //   const transaction = await api.transact({
  //     actions: [{
  //       // account: 'eosacl', // name of contract,
  //       account: CONTRACT_NAME,
  //       name: action,
  //       authorization: [{
  //         actor: account.name,
  //         permission: account.authority
  //       }],
  //       data: dataValue
  //     }]
  //   }
  //   , {
  //     blocksBehind: 3,
  //     expireSeconds: 30,
  //   }
  //   )

  //   debugger;
  //   console.log(`sent txt :${transaction}`)
  //   return transaction
  // }catch(err) {
  //   debugger;
  //   console.error(`error: ${err}`)
  // }

  const resultWithConfig = await api.transact(
    {
      actions: [
        {
          account: CONTRACT_NAME,
          name: action,
          authorization: [
            {
              actor: account.name,
              permission: account.authority
            }
          ],
          data: dataValue
        }
      ]
    },
    {
      blocksBehind: 3,
      expireSeconds: 30
    }
  );
  console.log(resultWithConfig);
  return true;

  // try {
  //   console.log(1)
  //   // const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
  //   console.log(2)
  //   // debugger;
  //   const resultWithConfig = await api.transact({
  //     actions: [{
  //       // account: process.env.REACT_APP_EOS_CONTRACT_NAME,
  //       account: CONTRACT_NAME,
  //       name: action,
  //       authorization: [{
  //         // actor: localStorage.getItem("cardgame_account"),
  //         actor: account.name,
  //         permission: account.authority
  //       }],
  //       data: dataValue,
  //     }]
  //   }
  //   , {
  //     blocksBehind: 3,
  //     expireSeconds: 30,
  //   }
  //   );
  //   // debugger;
  //   console.log(3)
  //   return resultWithConfig;
  // } catch (err) {
  //   debugger;
  //   console.log(4)
  //   throw(err)
  // }


  // return ScatterJS.login().then(id => {
  //   if (!id) {
  //     alert(`not logged in`)
  //   }
  //   debugger;

  //   return api.transact({
  //     actions: [{
  //       // account: 'eosacl', // name of contract,
  //       account: CONTRACT_NAME,
  //       name: action,
  //       authorization: [{
  //         actor: account.name,
  //         permission: account.authority
  //       }],
  //       data: dataValue
  //     }]
  //   }
  //   , {
  //     blocksBehind: 3,
  //     expireSeconds: 30,
  //   }
  //   )
  // }).then(res => {
  //   console.log(`sent txt :${res}`)
  // }).catch(err => {
  //   console.error(`error: ${err}`)
  // })
}

class ApiService {
  constructor() {
    const eosService = new EosService(CONTRACT_NAME, CONTRACT_NAME)
    // const con = this.eosService.connect();
    // if (!con) alert('not connected')
  }

  static claimlock(owner, lock_id, account) {
  // claimlock = async (owner, lock_id, account) => {
    debugger;
      // return takeAction("claimlock", {user: localStorage.getItem('cardgame_account')});
      // return takeAction("claimlock", {owner, lock_id});
      return takeScatterAction("claimlock", {owner, lock_id}, account);
      // const es = new EosService(CONTRACT_NAME, CONTRACT_NAME)
      // return es.connect().then (c => {
      //   return es.transaction("claimlock", {owner, lock_id}, account);
      // })

      // return this.eosService.transact("claimlock", {owner, lock_id}, account);
  }

  static sharekey(sender, recipient, lock_id, role, account) {
    // return takeAction("sharekey", {user: localStorage.getItem('cardgame_account'), player_card_index: cardHandIndex});
    // debugger;
    // return takeAction("sharekey", {sender, recipient, lock_id, role}, account);
    return takeScatterAction("sharekey", {sender, recipient, lock_id, role}, account);
}

static revokekey(admin, target, lock_id, account) {
    // return takeAction("revokekey", {sender, targetUser, lock_id}, account);
    return takeScatterAction("revokekey", {admin, target, lock_id}, account);
 }
  
 static logaccess(username, lock_id, role, account) {
    // return takeAction("logaccess", {user, lock_id}, account);
    debugger;
    return takeScatterAction("logaccess", {username, lock_id, role}, account);
 }

static checkaccess(username, lock_id, role, account) {
  // return takeAction("logaccess", {user, lock_id}, account);
  return takeScatterAction("checkaccess", {username, lock_id, role}, account);
}

  static async getUserByName(username) {
    // debugger;
    console.log(1)
    try {
      // const rpc = new JsonRpc(process.env.REACT_APP_EOS_HTTP_ENDPOINT);
      // const rpc = new JsonRpc(ENDPOINT);
      // const rpc = new eosjs2.Rpc.JsonRpc(ENDPOINT, { fetch });
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

  static getHistory(username) {
    debugger
    return api.getHistory(username).then(res => {
      console.log(res)
      debugger
    }).catch(e => {
      debugger
      console.error(`error: ${e}`)
    })
  }

}

export default ApiService;
