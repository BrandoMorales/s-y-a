import { useState, useRef } from "react";
import "../styles/global.css";

function Lozas() {
  const [datos, setDatos] = useState({
    fc: "",
    fy: "",
    M: "",
    b: 1,
    d: "",
    rho_min: "0.0018"
  });

  const [resultado, setResultado] = useState(null);
  const canvasRef = useRef(null);

  const handleChange = (e) => {
    setDatos({
      ...datos,
      [e.target.name]: e.target.value
    });
  };

  // 🔵 DIBUJO DE LOSA
  const dibujarLosa = (mejorOpcion) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // limpiar
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 🔵 LOSA
    ctx.fillStyle = "#d9d9d9";
    ctx.fillRect(50, 150, 300, 80);

    // 🔴 COLUMNA
    ctx.fillStyle = "#444";
    ctx.fillRect(170, 120, 60, 30);

    // 🔵 ACERO (según separación)
    ctx.strokeStyle = "#0072ff";
    ctx.lineWidth = 2;

    const sep = mejorOpcion ? mejorOpcion.sep : 15;
    const espacio = sep * 2; // escala visual

    for (let i = 60; i < 340; i += espacio) {
      ctx.beginPath();
      ctx.moveTo(i, 150);
      ctx.lineTo(i, 230);
      ctx.stroke();
    }

    // TEXTO
    ctx.fillStyle = "black";
    ctx.font = "14px Arial";
    ctx.fillText("Losa", 180, 260);
    ctx.fillText("Columna", 165, 110);

    if (mejorOpcion) {
      ctx.fillText(
        `${mejorOpcion.diam} mm c/${mejorOpcion.sep}`,
        140,
        140
      );
    }
  };

  const calcular = () => {
    const fc = parseFloat(datos.fc);
    const fy = parseFloat(datos.fy);
    const M = parseFloat(datos.M);
    const b = parseFloat(datos.b);
    const d = parseFloat(datos.d);
    const rho_min = parseFloat(datos.rho_min);

    // 🔴 CUANTÍA
    const rho =
      0.85 * (fc / fy) *
      (1 - Math.sqrt(
        1 - (2 * M * 100000) /
        (0.9 * 0.85 * fc * b * 100 * d * 100 * d * 100)
      ));

    // 🔴 As requerido
    const As_req =
      rho > rho_min
        ? rho * b * d * 100
        : rho_min * b * d * 100;

    // 🔵 OPCIONES
    const opciones = [
      { diam: 6, sep: 15 },
      { diam: 6.5, sep: 15 },
      { diam: 7, sep: 15 },
      { diam: 7.5, sep: 15 },
      { diam: 8, sep: 15 },
      { diam: 9, sep: 15 },
      { diam: 10, sep: 15 }
    ];

    const calcularAs = (diam, sep) => {
      return (Math.PI * Math.pow(diam / 10, 2) / 4) * (100 / sep);
    };

    let mejorOpcion = null;

    for (let op of opciones) {
      const As = calcularAs(op.diam, op.sep);

      if (As >= As_req) {
        mejorOpcion = { ...op, As };
        break;
      }
    }

    const cumple = mejorOpcion !== null;

    setResultado({
      rho,
      As_req,
      mejorOpcion,
      cumple
    });

    // 🔥 DIBUJAR
    dibujarLosa(mejorOpcion);
  };

  return (
    <div className="container">
      <h2>Diseño de Losa</h2>

      <input name="fc" placeholder="fc (kg/cm²)" onChange={handleChange} />
      <input name="fy" placeholder="fy (kg/cm²)" onChange={handleChange} />
      <input name="M" placeholder="Momento (ton-m)" onChange={handleChange} />
      <input name="rho_min" placeholder="ρ mínima" onChange={handleChange} />
      <input name="d" placeholder="d (m)" onChange={handleChange} />
      

      <button onClick={calcular}>Calcular</button>

      {/* 🔥 CANVAS */}
      <canvas
        ref={canvasRef}
        width={400}
        height={300}
        style={{
          marginTop: "20px",
          background: "#F7F7F7",
          borderRadius: "10px"
        }}
      ></canvas>

      {resultado && (
        <div className="resultado">
          <p>🔹 Cuantía: {resultado.rho.toFixed(6)}</p>
          <p>🔹cuantia min: 0.0018</p>
          <p>🔹 As requerido: {resultado.As_req.toFixed(2)} cm²/m</p>
          

          {resultado.cumple ? (
            <div className="card-ok">
              <p>
                Acero: {resultado.mejorOpcion.diam} mm c/{resultado.mejorOpcion.sep}
              </p>
              <p>
                As suministrado: {resultado.mejorOpcion.As.toFixed(2)} cm²/m
              </p>
              <p className="ok">✔ OK</p>
            </div>
          ) : (
            <div className="card-error">
              <p className="error">❌ No cumple</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Lozas;