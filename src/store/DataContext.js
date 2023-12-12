import { createContext, useContext, useReducer } from "react";

const initialState = {
  userData: null,
  history: {
    calculation: [],
    currency: [],
  },
};

const DataContext = createContext();

const DataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dataReducer, initialState);
  function dataReducer(state, action) {
    switch (action.type) {
      case "SET_USER_DATA":
        return {
          ...state,
          userData: action.payload,
        };
      case "ADD_CALC_TO_HISTORY":
        return {
          ...state,
          history: {
            ...state.history,
            calculation: [action.payload, ...state.history.calculation],
          },
        };
      case "ADD_CONV_TO_HISTORY":
        return {
          ...state,
          history: {
            ...state.history,
            currency: [action.payload, ...state.history.currency],
          },
        };
      case "FETCH_CALC":
        return {
          ...state,
          history: {
            ...state.history,
            calculation: [...action.payload],
          },
        };
      case "FETCH_CURR_CONV":
        return {
          ...state,
          history: {
            ...state.history,
            currency: [...action.payload],
          },
        };
      default:
        return state;
    }
  }

  const setUserData = (userData) => {
    dispatch({ type: "SET_USER_DATA", payload: userData });
  };
  const addToHistory = (calculation) => {
    dispatch({ type: "ADD_CALC_TO_HISTORY", payload: calculation });
  };
  const fetchCalculation = (calculation) => {
    dispatch({ type: "FETCH_CALC", payload: calculation });
  };

  const addToCurrencyHistory = (conversion) => {
    dispatch({ type: "ADD_CONV_TO_HISTORY", payload: conversion });
  };
  const fetchCurrencyConv = (calculation) => {
    dispatch({ type: "FETCH_CURR_CONV", payload: calculation });
  };

  const contextValue = {
    state,
    actions: {
      setUserData,
      addToHistory,
      addToCurrencyHistory,
      fetchCalculation,
      fetchCurrencyConv,
    },
  };

  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
};
const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

export { DataProvider, useData };
