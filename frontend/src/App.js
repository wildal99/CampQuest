import logo from './logo.svg';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import CampList from './components/CampList';
function App() {
  return (
    <Router>
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <Link to="/" className="navbar-brand">Camp Quest</Link>
          <div className="navbar-nav">
            <Link to="/" className="nav-item nav-link">View Camps</Link>
            <Link to="/add" className="nav-item nav-link">Add Camp</Link>
          </div>
        </nav>
        <br/>
        <Routes>
          <Route path="/" element={<CampList />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;
