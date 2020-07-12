// import { Actions } from 'const';

const initialState = {
  name: "",
  lock_ids: [],
  access_only_lock_ids: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case "SET_USER": {
        debugger;
      return Object.assign({}, state, {
        // If the name is not specified, do not change it
        // The places that will change the name is login
        // In that cases, the `win_count`, `lost_count`, `game` will be reset
        name: typeof action.name === "undefined" ? state.name : action.name,
        lock_ids: action.lock_ids || initialState.lock_ids,
        access_only_lock_ids: action.access_only_lock_ids || initialState.access_only_lock_ids,
      });
    }
    default:
      return state;
  }
}
