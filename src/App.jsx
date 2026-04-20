import { HashRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Lozas from "./components/Lozas";
import Zapata from "./components/Zapata";
import Footer from "./components/Footer";

function App() {
  return (
    <HashRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lozas" element={<Lozas />} />
        <Route path="/zapata" element={<Zapata />} />
      </Routes>
        <Footer />
    </HashRouter>
  );
}

export default App;