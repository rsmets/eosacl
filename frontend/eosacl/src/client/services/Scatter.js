import ScatterJS from 'scatterjs-core';
// import ScatterEOS from 'scatterjs-plugin-eosjs';

// Don't forget to tell ScatterJS which plugins you are using.
ScatterJS.plugins( new ScatterEOS() );

// ScatterJS.scatter.connect("eosacl").then(connected => {
//     // User does not have Scatter Desktop, Mobile or Classic installed.
//     if(!connected) return false;

//     const scatter = ScatterJS.scatter;
//     // -----------------------
//     // TODO store in state because this has overhead.
//     // -----------------------

//     window.ScatterJS = null; 
//     // -----------------------
//     // ALWAYS DO THIS
//     // -----------------------

//     return scatter;
// });

const networkJson = {
    blockchain:'eos',
    host:'localhost',
    port:8888,
    protocol:'http',
    chainId:'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f'
};

const network = ScatterJS.Network.fromJson(networkJson);
ScatterJS.scatter.connect('eosacl', {network}).then(connected => {
  // User does not have Scatter Desktop, Mobile or Classic installed.
  debugger;
  if(!connected) {
      alert(`no scatter!`);
      return false;
  }
  return ScatterJS.login().then(id => {
      debugger;
      if (!id) {
          alert('no id!')
          return false;
      }

      dispatch(updateAuthenticated(true));
      // dispatch(inputName(ScatterJS.identity.name));
      debugger;
      dispatch(inputName(ScatterJS.identity.accounts[0].name));
  })

})


// module.exports.scatterConnect = function () {
//     const network = ScatterJS.Network.fromJson(networkJson);
//     return ScatterJS.scatter.connect("eosacl", {network}).then(connected => {
//         // User does not have Scatter Desktop, Mobile or Classic installed.
//         debugger;
//         if(!connected) {
//             alert(`no scatter!`);
//             return false;
//         }
//         ScatterJS.login().then(id => {
//             debugger;
//             if (!id) {
//                 alert('no id!')
//                 return false;
//             }
//         })
    
//         const scatter = ScatterJS.scatter;
//         // -----------------------
//         // TODO store in state because this has overhead.
//         // -----------------------
    
//         window.ScatterJS = null;
//         // -----------------------
//         // ALWAYS DO THIS
//         // -----------------------
    
//         return scatter;
//     });
// }

// module.exports.getScatter = function (){
//     return ScatterJS;
// }

class ScatterService {
    static getScatter () {
        return ScatterJS;
    }
}

export default ScatterService;