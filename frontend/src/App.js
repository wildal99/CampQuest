import logo from './logo2.svg';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import CampList from './components/CampList';
import ViewCamp from './components/ViewCamp';
function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <Link to="/" className="navbar-brand"><img src={logo} className="navbar-logo" alt='CampQuest'/></Link>
          <div className="navbar-nav">
          </div>
        </nav>
        <br/>
        <Routes>
          <Route path="/" element={<CampList />} />
          <Route path="/view/:id" element={<ViewCamp/>} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;
