import { fetch } from './csrf';

const SET_SESSION = 'session/SET_SESSION';
const REMOVE_SESSION = 'session/REMOVE_SESSION';

const setSession = (user) => {
  return {
    type: SET_SESSION,
    user,
  };
};

const removeSession = () => {
  return {
    type: REMOVE_SESSION,
  };
};

export const login = (user) => async (dispatch) => {
  const { credential, password } = user;
  try {
    const response = await fetch('/api/session', {
      method: 'POST',
      body: JSON.stringify({
        credential,
        password,
      }),
    });
    dispatch(setSession(response.data.user));
    return response;
  } catch (err) {
    return err;
  }
};

export const restoreUser = () => async (dispatch) => {
  try {
    const response = await fetch('/api/session');
    dispatch(setSession(response.data.user));
    return response;
  } catch (err) {
    return err;
  }
};

export const registerUser = (user) => async (dispatch) => {
  try {
    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
    dispatch(setSession(response.data.user));
    return response;
  } catch (err) {
    return err;
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    const response = await fetch('/api/session', {
      method: 'DELETE',
    });
    dispatch(removeSession());
    return response;
  } catch (err) {
    return err;
  }
};

export const demoLogin = () => async (dispatch) => {
  try {
    const response = await fetch('/api/session/demo', {
      method: 'POST',
      body: JSON.stringify({ credential: 'Demo-Dave', password: 'password' }),
    });
    dispatch(setSession(response.data.user));
    return response;
  } catch (err) {
    return err;
  }
};

const initialState = {
  user: null,
};

const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SESSION:
      return { ...state, user: action.user }
    case REMOVE_SESSION:
      return { ...state, user: null };
    default:
      return state;
  }
};

export default sessionReducer;
