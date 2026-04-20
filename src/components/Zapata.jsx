import { useState, useRef } from "react";
import "../styles/global.css";

function Zapata() {
  const [datos, setDatos] = useState({
    P: "",
    sigma: "",
    porcentaje: "",
    b_col: "",
    l_col: "",
    h: "",
    fc: "",
    fy: "",
  });

  const [resultado, setResultado] = useState("");
  const canvasRef = useRef(null);

  const nombres = {
    P: "Carga P (t)",
    sigma: "σ admisible (t/m²)",
    porcentaje: "% peso cimentación",
    b_col: "Ancho columna (m)",
    l_col: "Largo columna (m)",
    h: "Altura (m)",
    fc: "f'c (kg/cm²)",
    fy: "fy (kg/cm²)",
  };

  const handleChange = (e) => {
    setDatos({
      ...datos,
      [e.target.id]: e.target.value,
    });
  };

  const calcular = () => {
    let { P, sigma, porcentaje, b_col, l_col, h, fc, fy } = datos;

    P = parseFloat(P);
    sigma = parseFloat(sigma);
    porcentaje = parseFloat(porcentaje);
    b_col = parseFloat(b_col);
    l_col = parseFloat(l_col);
    h = parseFloat(h);
    fc = parseFloat(fc);
    fy = parseFloat(fy);

    if ([P, sigma, porcentaje, b_col, l_col, h, fc, fy].some(isNaN)) {
      setResultado("⚠️ Ingresa todos los datos correctamente");
      return;
    }

    // =========================
    // 🔹 AREA
    // =========================
    let area = (P + (P * porcentaje) / 100) / sigma;

    // =========================
    // 🔹 LADO
    // =========================
    let lado = Math.sqrt(area);
    let lado_aprox = lado.toFixed(2);
    let lado_final = Math.ceil(lado);

    // =========================
    // 🔹 PRESION
    // =========================
    let q = P / (lado_final * lado_final);

    // =========================
    // 🔹 MOMENTO
    // =========================
    let M =
      (q * lado_final * Math.pow((lado_final - l_col) / 2, 2)) / 2;
    let Mu = M * 1.5;

    // =========================
    // 🔹 ALTURAS
    // =========================
    let h_cm = h * 100;
    let d = h_cm - 5;
    let d_m = d / 100;

    // =========================
    // 🔹 VALIDACIÓN EXTRA (PRO)
    // =========================
    let relacion = lado_final / Math.max(b_col, l_col);
    let ok_geo = relacion >= 2;

    let d_min = Math.max(
      ((lado_final - b_col) / 2) / 2,
      ((lado_final - l_col) / 2) / 2
    );
    let h_min = d_min + 0.05;
    let ok_altura = h >= h_min;

    // =========================
    // 🔹 CUANTIA
    // =========================
    let b = lado_final;

    let dentro =
      1 -
      (2 * Mu * 100000) /
        (0.9 * 0.85 * fc * b * 100 * d * d);

    dentro = Math.max(0, dentro);

    let cuantia = (0.85 * fc / fy) * (1 - Math.sqrt(dentro));

    let As_analisis = cuantia * b * 100 * d;
    let As_min = 0.0018 * b * h_cm * 100;
    let As = Math.max(As_analisis, As_min);

    // =========================
    // 🔹 VARILLAS
    // =========================
    const diametros = {
      "#3": 0.71,
      "#4": 1.27,
      "#5": 1.99,
      "#6": 2.85,
      "#7": 3.87,
      "#8": 5.07,
    };

    let mejor_barra = "";
let mejor_sep = 0;
let mejor_num = 0;

for (let barra in diametros) {
  let area_barra = diametros[barra];
  let num = Math.ceil(As / area_barra);
  let sep = (lado_final * 100) / num;

  if (sep >= 10 && sep <= 30) {
    mejor_barra = barra;
    mejor_sep = sep;
    mejor_num = num;
    break;
  }
}

// Si ninguna cumple
if (mejor_barra === "") {
  mejor_barra = "#5";
  let area_barra = diametros[mejor_barra];
  mejor_num = Math.ceil(As / area_barra);
  mejor_sep = (lado_final * 100) / mejor_num;
}
    // =========================
    // 🔹 CORTANTE 1
    // =========================
    let V1 =
      q *
      0.5 *
      (d_m + b_col + lado_final) *
      ((lado_final - b_col) / 2 - d_m / 200);

    let Vu1 = V1 * 1.5;

    let vu1 =
      (Vu1 * 1000) /
      (lado_final * 100 * (d + b_col * 100));

    let Vc1_1 =
      0.75 *
      0.27 *
      (2 + 4 / (l_col / b_col)) *
      Math.sqrt(fc);

    let Vc1_2 = 0.75 * 1.1 * Math.sqrt(fc);

    let Vc1 = Math.min(Vc1_1, Vc1_2);

    // =========================
    // 🔹 CORTANTE 2
    // =========================
    let V2 =
      q *
      ((lado_final - b_col) / 2 - d_m) *
      lado_final;

    let Vu2 = V2 * 1.5;

    let vu2 =
      (Vu2 * 1000) /
      (lado_final * 100 * d);

    let Vc2 = 0.75 * 0.53 * Math.sqrt(fc);

    // =========================
    // 🔹 PRESIÓN
    // =========================
    let presion_col =
      (P * 1.5) / (b_col * l_col * 10000);

    let presion_max =
      (2 * 0.7 * 0.85 * fc) / 1000;

    // =========================
    // 🔹 LONGITUD DESARROLLO
    // =========================
    let diam_barra = 0.95;
    let Ldb =
      (0.075 * diam_barra * fy) / Math.sqrt(fc);

    // =========================
    // 🔹 VALIDACIONES
    // =========================
    let ok1 = vu1 <= Vc1;
    let ok2 = vu2 <= Vc2;
    let ok3 = presion_col <= presion_max;

    let diseño_ok =
      ok1 && ok2 && ok3 && ok_geo && ok_altura;

    // =========================
    // 🔹 RESULTADO
    // =========================
    setResultado(`
🔷 ÁREA
${area.toFixed(4)} m²

🔷 LADOS
Aprox = ${lado_aprox} m
Final = ${lado_final} m

🔷 GEOMETRÍA
Relación = ${relacion.toFixed(2)} → ${ok_geo ? "✅" : "❌"}

🔷 ALTURA
h mín = ${h_min.toFixed(2)} → ${ok_altura ? "✅" : "❌"}

🔷 PRESIÓN
q = ${q.toFixed(2)} t/m²

🔷 MOMENTO
M = ${M.toFixed(3)}
Mu = ${Mu.toFixed(3)}

🔷 ACERO
As = ${As.toFixed(2)} cm²
${mejor_num} barras ${mejor_barra}
sep = ${mejor_sep.toFixed(2)} cm

🔷 CORTANTE 1
vu1 = ${vu1.toFixed(2)}
Vc1 = ${Vc1.toFixed(2)} → ${ok1 ? "✅" : "❌"}

🔷 CORTANTE 2
vu2 = ${vu2.toFixed(2)}
Vc2 = ${Vc2.toFixed(2)} → ${ok2 ? "✅" : "❌"}

🔷 PRESIÓN COLUMNA
${presion_col.toFixed(3)} ≤ ${presion_max.toFixed(3)} → ${ok3 ? "✅" : "❌"}

🔷 Ldb
${Ldb.toFixed(2)} cm

${diseño_ok ? "✅ DISEÑO OK" : "❌ NO CUMPLE"}
    `);

    // =========================
    // 🔹 DIBUJO
    // =========================
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, 300, 300);

    let escala = 200 / lado_final;

    ctx.fillStyle = "#4CAF50";
    ctx.fillRect(50, 50, lado_final * escala, lado_final * escala);

    ctx.fillStyle = "#222";
    ctx.fillRect(
      50 + ((lado_final - b_col) / 2) * escala,
      50 + ((lado_final - l_col) / 2) * escala,
      b_col * escala,
      l_col * escala
    );
  };

  return (
    <div className="container">
      <h2>Diseño de Zapata</h2>

      <div className="form">
        {Object.keys(datos).map((key) => (
          <input
            key={key}
            id={key}
            placeholder={nombres[key]}
            value={datos[key]}
            onChange={handleChange}
          />
        ))}
      </div>

      <button onClick={calcular}>Calcular</button>

      <pre className="resultado">{resultado}</pre>

      <canvas ref={canvasRef} width="300" height="300"></canvas>
    </div>
  );
}

export default Zapata;