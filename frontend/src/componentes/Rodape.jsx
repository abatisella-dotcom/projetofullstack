import React from 'react';
import { FaInstagram, FaFacebook, FaTiktok } from "react-icons/fa";

export default function Rodape() {
  return (
    <footer className="rodape">
      <div className="rodape-redes">
        <FaInstagram className="rodape-icone" title="Instagram" />
        <FaFacebook className="rodape-icone" title="Facebook" />
        <FaTiktok className="rodape-icone" title="TikTok" />
      </div>
      <p>© MakalMusic. Todos os direitos reservados.</p>
    </footer>
  );
}
