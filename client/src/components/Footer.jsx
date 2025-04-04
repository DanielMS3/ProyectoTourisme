import React from 'react';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <p>&copy; {new Date().getFullYear()} Tourisme. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
};

export default Footer;

