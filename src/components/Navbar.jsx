import { Link } from "react-router-dom";
import "../styles/navbar.css";
import logo from "../assets/sya.webp"; // tu logo

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-left">
       <Link to="./" className="logo-link">
          <img src={logo} alt="S&A" />
          <h2>S & A</h2>
        </Link>
      </div>

      <div className="nav-links">
        <Link to="/">Inicio</Link>
        <Link to="/lozas">Losas</Link>
        <Link to="/zapata">Zapatas</Link>
      </div>
    </nav>
  );
}

export default Navbar;