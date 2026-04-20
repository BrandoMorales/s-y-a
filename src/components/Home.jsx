import "../styles/home.css";
import logo from "../assets/sya.webp";

function Home() {
  return (
    <div className="home">
      <div className="hero">
        <img src={logo} alt="S&A Logo" />

        <h1>S&A Santander y Asociados S.A.S</h1>
        <p>
          Ingeniería estructural profesional enfocada en diseño de losas,
          zapatas y soluciones seguras para la construcción.
        </p>

        <div className="info">
          <p>📍 Calle 98 #18-71 Of 406, Bogotá</p>
          <p>📞 +57 601 6210288</p>
        </div>
      </div>

      <div className="cards">
        <div className="card">
          <h3>🧱 Diseño de Losas</h3>
          <p>Cálculo automático de cuantía y refuerzo</p>
        </div>

        <div className="card">
          <h3>🏗️ Diseño de Zapatas</h3>
          <p>Análisis completo estructural PRO</p>
        </div>

        <div className="card">
          <h3>📊 Precisión</h3>
          <p>Basado en criterios reales de ingeniería</p>
        </div>
      </div>
    </div>
  );
}

export default Home;