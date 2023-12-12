// CalculatorButton.js
import React from 'react';

const CalculatorButton = ({ value, onClick }) => {
  return <button style={{color:'#000'}} onClick={() => onClick(value)}>{value}</button>;
};

export default CalculatorButton;
