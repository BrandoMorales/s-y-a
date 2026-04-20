import "../styles/footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-left">
          <h3>S&A Santander y Asociados</h3>
          <p>Ingeniería estructural profesional</p>
        </div>

        <div className="footer-center">
          <p>📍 Calle 98 #18-71 Of 406, Bogotá</p>
          <p>📞 +57 601 6210288</p>
        </div>

        <div className="footer-right">
          <p>© {new Date().getFullYear()} S&A</p>
          <p>Todos los derechos reservados</p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
