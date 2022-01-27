import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/Login'
import Signup from './Components/Signup'
import Home from './Components/Home';
import Dash from './Components/Dash';
import Invoice from './Components/Invoice';
import Records from './Components/Records';
import Setting from './Components/Setting';
function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/home' element={<Home />} >
          <Route path='dash' element={<Dash />} />
          <Route path='invoice' element={<Invoice />} />
          <Route path='records' element={<Records />} />
          <Route path='setting' element={<Setting />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
