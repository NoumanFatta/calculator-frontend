import React, { useState, useEffect } from "react";
import { useData } from "../store/DataContext";
import { useNavigate } from "react-router-dom";
import History from "./History";
import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { ThreeDots } from "react-loader-spinner";

// Assuming you're using Firebase Auth
const Calculator = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const uid = localStorage.getItem("uid");
    if (!uid) {
      navigate("/");
    }
  }, [navigate]);
  const { state, actions } = useData();
  const { history } = state;
  const [input, setInput] = useState("");
  const [USD, setUSD] = useState(1);
  const [EUR, setEUR] = useState(1 * 0.7003);
  const [result, setResult] = useState("");
  const [currentMode, setCurrentMode] = useState("calculator");
  const [usdtoeur, setUsdtoeur] = useState(true);
  const [convertDisable, setConvertDisable] = useState(true);
  const [resultLoader, setResultLoader] = useState(false);
  const [fetchLoader, setFetchLoader] = useState({
    Calculations: true,
    Conversions: true,
  });
  //Splitting the input values
  function splitMathExpression(expression) {
    var operatorsRegex = /[-+*/]/;
    var parts = expression.split(operatorsRegex);
    parts = parts.filter(function (part) {
      return part !== "";
    });

    return parts;
  }

  //On click of calculator button
  const handleButtonClick = (value) => {
    if (value === "=") {
      saveCalculations();
    } else if (value === "C") {
      clearInput();
    } else if (
      value === "+" ||
      value === "-" ||
      value === "*" ||
      value === "/"
    ) {
      if (splitMathExpression(input).length === 2) {
        saveCalculations();
        setInput((prevInput) => prevInput + value);
      } else {
        setInput((prevInput) => prevInput + value);
      }
    } else {
      setInput((prevInput) => prevInput + value);
    }
  };

  //Store data to firestore
  const saveCalculations = async () => {
    try {
      setResultLoader(true);
      const response = await axios.post(
        `${process.env.React_APP_CLOUD_FUNCTION_BASE_URL}/calculations`,
        {
          expression: input,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.currentUser.accessToken}`,
            key: process.env.React_APP_API_KEY,
          },
        }
      );
      setInput(
        response.data.data.result ? response.data.data.result?.toString() : ""
      );
      setResult(response.data.data.result?.toString());
      actions.addToHistory(response.data.data);
    } catch (error) {
      console.error(error);
      setResult("Error!");
    } finally {
      setResultLoader(false);
    }
  };

  const saveConversions = async () => {
    setConvertDisable(true);
    try {
      setResultLoader(true);
      let data = {};
      if (!!usdtoeur) {
        data = {
          from: "USD",
          inputAmout: USD,
          to: "EUR",
        };
      } else {
        data = {
          from: "EUR",
          inputAmout: EUR,
          to: "USD",
        };
      }
      const response = await axios.post(
        `${process.env.React_APP_CLOUD_FUNCTION_BASE_URL}/conversions`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.currentUser.accessToken}`,
            key: process.env.React_APP_API_KEY,
          },
        }
      );
      if (!!usdtoeur) {
        setEUR(response.data.data.outputAmount);
      } else {
        setUSD(response.data.data.outputAmount);
      }
      actions.addToCurrencyHistory(response.data.data);
    } catch (error) {
      console.error("Error adding document: ", error);
    } finally {
      setResultLoader(false);
    }
  };
  //Clearing input
  const clearInput = () => {
    setInput("");
    setResult("");
  };

  const renderButtons = () => {
    const buttons = [
      "7",
      "8",
      "9",
      "/",
      "4",
      "5",
      "6",
      "*",
      "1",
      "2",
      "3",
      "-",
      "0",
      ".",
      "=",
      "+",
      "C",
    ];

    return buttons.map((button, index) => (
      <button key={index} onClick={() => handleButtonClick(button)}>
        {button}
      </button>
    ));
  };

  //Changing mode Calculator <=> Currency Conversion
  const handleSelectMode = (e) => {
    setCurrentMode(e?.target?.textContent.toLowerCase());
  };

  // On change of input of currency values
  const handleChange = (e) => {
    setConvertDisable(false);
    const re = /^[0-9\b]+$/; // Regex to accept numbers only
    if (e?.target?.value === "" || re.test(e?.target?.value)) {
      if (e?.target?.name === "usd") {
        // checking for typing input is for USD
        setUSD(e?.target?.value);
      } else if (e?.target?.name === "eur") {
        // checking for typing input is for EUR
        setEUR(e?.target?.value);
      }
    } else return;
  };
  // Currency conversion logic
  const handleConvert = () => {
    saveConversions();
  };
  const { calculation, currency } = history;
  useEffect(() => {
    const fetchHistory = async (collection, token) => {
      try {
        const response = await axios.get(
          `${process.env.React_APP_CLOUD_FUNCTION_BASE_URL}/${collection}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              key: process.env.React_APP_API_KEY,
            },
          }
        );
        if (collection === "Calculations") {
          actions.fetchCalculation(response.data);
        } else {
          actions.fetchCurrencyConv(response.data);
        }
      } catch (error) {
        console.error("Error fetching documents: ", error);
      } finally {
        setFetchLoader((prev) => ({ ...prev, [collection]: false }));
      }
    };
    onAuthStateChanged(auth, (user) => {
      if (user) {
        user.getIdToken().then((token) => {
          localStorage.setItem("token", token);
          fetchHistory("Conversions", token);
          fetchHistory("Calculations", token);
        });
      }
    });
    //eslint-disable-next-line
  }, []);
  return (
    <div className="main-container">
      <div className="history-container">
        <p className="history-title">History</p>
        <ul>
          <History
            fetchLoader={fetchLoader}
            resultLoader={resultLoader}
            currentMode={currentMode}
            history={currentMode === "calculator" ? calculation : currency}
          />
        </ul>
      </div>
      <div
        className="calculator"
        style={{ pointerEvents: resultLoader ? "none" : "all" }}
      >
        <div className="calculator_component">
          <div className="mode-buttons">
            <button onClick={handleSelectMode}>Calculator</button>
            <button onClick={handleSelectMode}>{`USD <=> EUR`}</button>
          </div>
          {currentMode === "calculator" ? (
            <>
              <div className="display">
                <input type="text" value={input} readOnly />
                <div className="result">
                  {resultLoader ? (
                    <ThreeDots
                      height="20"
                      width="30"
                      radius="9"
                      color="#00000"
                      ariaLabel="three-dots-loading"
                      visible={true}
                    />
                  ) : (
                    result
                  )}
                </div>
              </div>
              <div className="buttons">{renderButtons()}</div>
            </>
          ) : (
            <div style={{ pointerEvents: resultLoader ? "none" : "all" }}>
              <div className="display">
                <label>{!!usdtoeur ? `USD` : `EUR`}</label>
                {!!usdtoeur ? (
                  <input
                    type="text"
                    name="usd"
                    value={USD}
                    onChange={handleChange}
                  />
                ) : (
                  <input
                    type="text"
                    name="eur"
                    value={EUR}
                    onChange={handleChange}
                  />
                )}
              </div>

              <div className="display">
                {!resultLoader ? (
                  <label>{!!usdtoeur ? `EUR : ${EUR}` : `USD : ${USD}`}</label>
                ) : (
                  <ThreeDots
                    height="20"
                    width="30"
                    radius="9"
                    color="#00000"
                    ariaLabel="three-dots-loading"
                    visible={true}
                  />
                )}
              </div>
              <div className="buttons-row">
                <button
                  onClick={() => setUsdtoeur((ps) => !ps)}
                  className="swap-button"
                >
                  Swap
                </button>
                <button disabled={convertDisable} onClick={handleConvert}>
                  Convert
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="logout_button">
        <button
          onClick={() => {
            auth?.signOut();
            localStorage.removeItem("uid");
            localStorage.removeItem("token");
            navigate("/");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Calculator;
