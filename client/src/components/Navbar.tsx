import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../hooks/useAuth.ts";

const Navbar = () => {
  const { user } = useAuth();

  const [isShrunk, setIsShrunk] = useState(false);

  const isConnected = user !== null;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) {
        setIsShrunk(false);
      } else {
        setIsShrunk(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`navbar navbar-expand-lg navbar-dark fixed-top ${isShrunk ? "navbar-shrink" : ""}`}
      id="mainNav"
    >
      <div className="container">
        <Link className="navbar-brand" to="/">
          StackBan
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarResponsive"
          aria-controls="navbarResponsive"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          Menu
          <i className="fas fa-bars ms-1"></i>
        </button>

        <div className="collapse navbar-collapse" id="navbarResponsive">
          <ul className="navbar-nav text-uppercase ms-auto py-4 py-lg-0">
            <li className="nav-item drop-down-menu">
              <a className="nav-link" style={{ fontSize: 17 }} href="#">
                Mes tableaux
              </a>
              <div className="subpage">
                <a className="nav-link" href="#">
                  Présentation
                </a>
                <a className="nav-link" href="#propos">
                  A Propos
                </a>
                <a className="nav-link" href="#contact">
                  Contact
                </a>
              </div>
            </li>

            {isConnected ? (
              <li className="nav-item drop-down-menu">
                <a
                  className="nav-link"
                  style={{ fontSize: 17 }}
                  href="/profil"
                >
                  Profil
                </a>
              </li>
            ) : (
              <>
                <li className="nav-item drop-down-menu">
                  <a
                    className="nav-link"
                    style={{ fontSize: 17 }}
                    href="/login"
                  >
                    Connexion
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    style={{ fontSize: 17 }}
                    href="/register"
                  >
                    Inscription
                  </a>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
