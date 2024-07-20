import { DELETE_ITEM, ADD_TO_CART } from "../reducer/TransferReducer";
//REDUX File that represent our all actions

export const incrementQuantity = (id) => {
  return {
    type: "INCREMENT",
    id: id,
  };
};

export const decrementQuantity = (id) => {
  return {
    type: "DECREMENT",
    id: id,
  };
};

export const Transert = (data) => {
  return {
    type: ADD_TO_CART,
    data: data,
  };
};

export const deleteCartItem = (itemId) => {
  return {
    type: DELETE_ITEM,
    itemId: itemId,
  };
};

export const deleteQuantity = (id) => {
  return {
    type: "DELETE_QUANTITY",
    id: id,
  };
};

export const LoadCart = (id, qty) => {
  return {
    type: "load_cart",
    payload: { id, qty },
  };
};
