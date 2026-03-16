import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../hooks/useAuth.ts";
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { API_URL } from "../config/api.ts";
import type { InvitationRow } from "../types/BoardMemberType.ts";

const Navbar = () => {

  type InvitationState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "error"; error: string };

  const { user } = useAuth();

  const [isShrunk, setIsShrunk] = useState(false);

  const isConnected = user !== null;

  const [state, setState] = useState<InvitationState>({ status: "idle" });

  const [invitations, setInvitation] = useState<InvitationRow[]>([]);

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

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const reject = async (e : SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState({ status: "submitting" });

    const data = "Reject";

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/users/${user?.userId}/boards`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(data),
            });
      
            if (!response.ok) {
              alert("Erreur lors de la suppression de l'invitation");
              setState({
                status: "error",
                error: `Update failed (${response.status})`,
              });
              return;
            }
    } catch (error )  {
      setState({
        status: "error",

        error: error instanceof Error ? error.message : "Registration failed.",
      });
    }
  }
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
              <a className="nav-link" style={{ fontSize: 17 }} href="/">
                Mes tableaux
              </a>
            </li>

            {isConnected ? (
              <>
                <li className="nav-item drop-down-menu">
                <a className="nav-link" style={{ fontSize: 17 }} href="/profil">
                  Profil
                </a>
                <div className="subpage">
                  <a className="nav-link" href="/profil">
                    Informations
                  </a>
                  <a className="nav-link" href="/boards">
                    Tableaux
                  </a>
                  {user.isAdmin ? (
                    <>
                      <a className="nav-link" href="/accountManagment">
                        Gestion des comptes
                      </a>
                      <a className="nav-link" href="/statistics">
                        Statistiques
                      </a>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </li>
              <li>
                <a className="nav-link" style={{ fontSize: 17 }} onClick={handleShow}>
                  Messagerie
                </a>
                <>
                  <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                      <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <div style={{display:"flex", flexDirection:"column"}}>
                        {Array.isArray(invitations) &&
                          invitations.map((inv) => (
                            <div>
                              <p>Vous avez reçu une invitation pour rejoindre le tableau {inv.title}</p>
                              <Button variant="secondary" onClick={handleClose}>
                                Rejeter!
                              </Button>
                              <Button variant="primary" onClick={handleClose}>
                                Accepter!
                              </Button>
                            </div>
                          
                          
                          
                          ))}

                      </div>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={handleClose}>
                        Close
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </>
              </li>
              </>
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