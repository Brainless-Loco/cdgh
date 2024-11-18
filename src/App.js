import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Visualization from './components/visualization/Visualization';
import Home from './components/Home/Home';

function App() {
  return (
    <Router basename='/'>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/visualization' element={<Visualization/>}/>
      </Routes>
      <Routes>

      </Routes>
      {/* <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div> */}
    </Router>
  );
}

export default App;
