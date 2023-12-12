import './App.css';

// import { BrowserRouter as Router, Route, Switch  } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import ProjRoutes from './routes/routes';

console.log(process.env.React_APP_apiKey)
function App() {
  return (
    <BrowserRouter>
      <ProjRoutes />
    </BrowserRouter>
    // <div className="container">
    //   <h1>React Calculator</h1>
    //   <CalculatorApp />
    // </div>
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
  );
}

export default App;
