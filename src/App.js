import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home/Home';

function App() {
  return (
    <Router basename='/'>
      <Routes>
        <Route path='/' element={<Home/>}/>
      </Routes>
      <Routes>

      </Routes>
      
    </Router>
  );
}

export default App;
