// src/contexto/miReducer.js
import types from "./types";

const miReducer = (state, action) => {
  switch (action.type) {
    case types.login:
      return {
        ...state,
        logueado: true,
        usuario: action.payload,
      };

    case types.logout:
      return {
        ...state,
        logueado: false,
        usuario: null,
      };
    default:
      return state;
  }
};

export default miReducer;
