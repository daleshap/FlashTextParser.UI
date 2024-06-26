import './App.css';
import { Home } from './Home';
import { BannedWord } from './BannedWord';
import { BrowserRouter, Route, Routes, NavLink } from 'react-router-dom';



function App() {


  
  return (
   <>
    <BrowserRouter>
    <div className="App container">
      <h3 className='d-flex justify-content-center m-3'>
        Text Parser API
      </h3>
      <nav className='navbar navbar-expand-sm bg-light navbar-dark'> 
      <ul className='navbar-nav'>
        <li className='nav-item- m-1'>
          <NavLink className="btn btn-light btn-outline-primary" to="/Home">Home</NavLink>        </li>
          <li className='nav-item- m-1'>
          <NavLink className="btn btn-light btn-outline-primary" to="/BannedWord">List of Banned Words</NavLink>        </li>
      </ul>
      </nav>
      <Routes>
        <Route path='/home' element={<Home/>} />
        <Route path='/bannedword' element={<BannedWord/>} />
        <Route path="/" element={<Home/>} />
      </Routes>
      
    </div>
    
    
    </BrowserRouter>
    </>
  );
}


export default App;
