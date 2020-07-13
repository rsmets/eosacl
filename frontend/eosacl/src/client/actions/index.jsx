export const toggleCheck = () => {
  return {
    type: "TOGGLE_CHECK"
  };
};

export const incNumber = () => {
  return {
    type: "INC_NUMBER"
  };
};

export const decNumber = () => {
  return {
    type: "DEC_NUMBER"
  };
};

export const inputName = value => {
  return {
    type: "INPUT_NAME",
    value
  };
};

export const setUser = value => {
  return {
    type: "SET_USER",
    value
  };
};

export const updateAdminLockIds = value => {
  return {
    type: "ADMIN_LOCK_IDS",
    value
  };
};

export const updateUserLockIds = value => {
  return {
    type: "USER_LOCK_IDS",
    value
  };
};

export const passwordName = value => {
  return {
    type: "PASS_WORD",
    value
  };
};

export const inputTextarea = value => {
  return {
    type: "INPUT_TEXT_AREA",
    value
  };
};

export const selectOption = value => {
  return {
    type: "SELECT_OPTION",
    value
  };
};

export const setShowFakeComp = value => {
  return {
    type: "SHOW_FAKE_COMP",
    value
  };
};

export const updateTargetUsername = value => {
  return {
    type: "TARGET_NAME",
    value
  };
};

export const updateTargetRole = value => {
  return {
    type: "TARGET_ROLE",
    value
  };
};

export const updateAuthenticated = value => {
  return {
    type: "AUTHENTICATED",
    value
  };
};

export const updateEosAccount = value => {
  return {
    type: "EOS_ACCOUNT",
    value
  };
};