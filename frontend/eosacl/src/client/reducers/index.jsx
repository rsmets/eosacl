import { combineReducers } from "redux";
// import UserReducer from './UserReducer';

const checkBox = (store, action) => {
  if (action.type === "TOGGLE_CHECK") {
    return {
      checked: !store.checked
    };
  }

  return store || { checked: false };
};

const number = (store, action) => {
  if (action.type === "INC_NUMBER") {
    return {
      value: store.value + 1
    };
  } else if (action.type === "DEC_NUMBER") {
    return {
      value: store.value - 1
    };
  }

  return store || { value: 0 };
};

const username = (store, action) => {
  if (action.type === "INPUT_NAME") {
    return {
      value: action.value
    };
  }

  return store || { value: "" };
};

const adminLockIds = (store, action) => {
  if (action.type === "ADMIN_LOCK_IDS") {
    console.log("Working: ", action.value)

    return {
      value: action.value
    };
  }

  return store || { value: [] };
};


const userLockIds = (store, action) => {
  if (action.type === "USER_LOCK_IDS") {
    console.log("Working: ", action.value)

    return {
      value: action.value
    };
  }

  return store || { value: [] };
};

const password = (store, action) => {
  if (action.type === "PASS_WORD") {
    console.log("Working: ", action.value)
    return {
      value: action.value
    };
  }

  return store || { value: "" };
};

const textarea = (store, action) => {
  if (action.type === "INPUT_TEXT_AREA") {
    return {
      value: action.value
    };
  }

  return store || { value: "" };
};

const selectedOption = (store, action) => {
  if (action.type === "SELECT_OPTION") {
    return {
      value: action.value
    };
  }
  return store || { value: 10 };
};

const showFakeComp = (store, action) => {
  if (action.type === "SHOW_FAKE_COMP") {
    return {
      value: action.value
    };
  }
  return store || { value: false };
};

const user = (store, action) => {
  console.log(action.type)
  if (action.type === "SET_USER") {
    // return Object.assign({}, state, {
    //   // If the name is not specified, do not change it
    //   // The places that will change the name is login
    //   // In that cases, the `win_count`, `lost_count`, `game` will be reset
    //   name: typeof action.name === "undefined" ? state.name : action.name,
    //   lock_ids: action.lock_ids || initialState.lock_ids,
    //   access_only_lock_ids: action.access_only_lock_ids || initialState.access_only_lock_ids,
    // });
    console.log("Working: ", action.value)
    // debugger
    // return  {value: {
    //   // If the name is not specified, do not change it
    //   // The places that will change the name is login
    //   // In that cases, the `win_count`, `lost_count`, `game` will be reset
    //   name: action.name || '',
    //   lock_ids: action.lock_ids || [],
    //   access_only_lock_ids: action.access_only_lock_ids || [],
    // }};
    return  {
      // If the name is not specified, do not change it
      // The places that will change the name is login
      // In that cases, the `win_count`, `lost_count`, `game` will be reset
      name: action.value.name || '',
      lock_ids: action.value.lock_ids || [],
      access_only_lock_ids: action.value.access_only_lock_ids || [],
    };
  }
  return store || {}
}

const targetUsername = (store, action) => {
  if (action.type === "TARGET_NAME") {
    // debugger;
    return {
      value: action.value
    };
  }

  return store || { value: "" };
};

const targetRole = (store, action) => {
  if (action.type === "TARGET_ROLE") {
    // debugger;
    return {
      value: action.value
    };
  }

  return store || { value: 10 };
};

const authenticated = (store, action) => {
  if (action.type === "AUTHENTICATED") {
    // debugger;
    return {
      value: action.value
    };
  }

  return store || { value: false };
};

const eosAccount = (store, action) => {
  if (action.type === "EOS_ACCOUNT") {
    debugger;
    return {
      value: action.value
    };
  }

  return store || { value: {} };
};

export default combineReducers({
  checkBox,
  number,
  username,
  adminLockIds,
  userLockIds,
  textarea,
  selectedOption,
  showFakeComp,
  password,
  // user: UserReducer
  user,
  targetUsername,
  targetRole,
  authenticated,
  eosAccount,
});
