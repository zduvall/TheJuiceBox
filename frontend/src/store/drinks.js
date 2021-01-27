import { fetch } from './csrf';

const SET_DRINKS = 'drinks/SET_DRINKS';
const CREATE_DRINK = 'drinks/CREATE_DRINK';
const REMOVE_DRINK = 'drinks/REMOVE_DRINK';

const CREATE_REVIEW = 'drinks/CREATE_REVIEW';
const REMOVE_REVIEW = 'drinks/REMOVE_REVIEW';

const setDrinks = (drinks) => {
  return {
    type: SET_DRINKS,
    drinks,
  };
};

const createDrink = (drink) => {
  return {
    type: CREATE_DRINK,
    drink,
  };
};

const removeDrink = (id) => {
  return {
    type: REMOVE_DRINK,
    id,
  };
};

const createReview = (review) => {
  return {
    type: CREATE_REVIEW,
    review,
  };
};

const removeReview = (id) => {
  return {
    type: REMOVE_REVIEW,
    id,
  };
};

export const getDrinks = () => async (dispatch) => {
  const response = await fetch('/api/drinks');
  if (response.ok) {
    dispatch(setDrinks(response.data.drinks));
    return response;
  }
};

export const mixDrink = (drink) => async (dispatch) => {
  const { image, name, description } = drink;
  const formData = new FormData();
  formData.append('name', name);
  formData.append('description', description);
  formData.append('image', image);

  const response = await fetch('/api/drinks', {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  dispatch(createDrink(response.data.drink));
  return response.data.drink;
};

export const updateDrink = ({ id, name, description, image }) => async (dispatch) => {
  const formData = new FormData();
  formData.append('name', name);
  formData.append('description', description);
  formData.append('image', image);

  const response = await fetch(`/api/drinks/${id}`, {
    method: 'PUT',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  dispatch(createDrink(response.data.drink));
  return response.data.drink;
};

export const deleteDrink = (id) => async (dispatch) => {
  await dispatch(removeDrink(id));
  const response = await fetch(`/api/drinks/${id}`, {
    method: 'DELETE',
  });
  return response.data.message;
};

export const writeReview = ({ userId, drinkId, review }) => async (dispatch) => {
  const response = await fetch(`/api/drinks/${drinkId}/reviews`, {
    method: 'POST',
    body: JSON.stringify({ userId, drinkId, review }),
  });
  dispatch(getDrinks());
  return response.data.review;
};

export const updateReview = ({ userId, drinkId, review }) => async (dispatch) => {
  const response = await fetch(`/api/drinks/${drinkId}/reviews/${review.id}`, {
    method: 'PUT',
    body: JSON.stringify({ userId, drinkId, review }),
  });
  dispatch(getDrinks());
  return response.data.review;
}

export const deleteReview = (drinkId, reviewId) => async (dispatch) => {
  const response = await fetch(`/api/drinks/${drinkId}/reviews/${reviewId}`, {
    method: 'DELETE',
  });
  dispatch(getDrinks());
  return response;
};

const initialState = {};

const drinksReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_DRINKS:
      const drinks = action.drinks.reduce((acc, ele) => {
        acc[ele.id] = ele;
        return acc;
      }, {});
      return { ...state, ...drinks };
    case CREATE_DRINK:
      return { ...state, [action.drink.id]: action.drink };
    case REMOVE_DRINK:
      const newState = { ...state };
      delete newState[action.id];
      return newState;
    default:
      return state;
  }
};

export default drinksReducer;
