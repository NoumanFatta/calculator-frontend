import React from "react";
import moment from "moment/moment";
import { TailSpin, ThreeDots } from "react-loader-spinner";

const History = ({ history, currentMode, resultLoader, fetchLoader }) => {
  return (
    <>
      {resultLoader && (
        <ThreeDots
          height="20"
          width="30"
          radius="9"
          color="#00000"
          ariaLabel="three-dots-loading"
          visible={true}
        />
      )}
      {fetchLoader.Calculation ? "" : ""}
      {currentMode === "calculator" ? (
        fetchLoader.Calculations ? (
          <TailSpin
            height="80"
            width="80"
            color="#000000"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        ) : (
          history.map((item, i) => (
            <li key={i}>
              <div className="list-item-wrapper">
                <p className="equation">{`${item?.expression} = ${item?.result}. `}</p>
                <p className="time-stamp">
                  {`${moment(item?.timestamp).format("MM/DD/yyyy")}`}
                </p>
              </div>
            </li>
          ))
        )
      ) : fetchLoader.Conversions ? (
        <TailSpin
          height="80"
          width="80"
          color="#000000"
          ariaLabel="tail-spin-loading"
          radius="1"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      ) : (
        history?.map((item, i) => (
          <li key={i}>
            <div className="list-item-wrapper">
              <p className="equation">{`${item?.from} ${item?.inputAmout} => ${item?.to} ${item?.outputAmount}`}</p>
              <p className="time-stamp">
                {`${moment(item?.timestamp).format("MM/DD/yyyy")}`}
              </p>
            </div>
          </li>
        ))
      )}
    </>
  );
};

export default History;
