import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../hooks/useAuth.ts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { API_URL } from "../config/api.ts";
import type { InvitationRow } from "../types/BoardMemberType.ts";
import type { User } from "../types/userType.ts";

const Navbar = () => {
  type InvitationState =
    | { status: "idle" }
    | { status: "submitting" }
    | { status: "error"; error: string };

  const { user, token } = useAuth();

  const [isShrunk, setIsShrunk] = useState(false);

  const isConnected = user !== null;

  const [state, setState] = useState<InvitationState>({ status: "idle" });

  const [invitations, setInvitation] = useState<InvitationRow[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      if (globalThis.scrollY === 0) {
        setIsShrunk(false);
      } else {
        setIsShrunk(true);
      }
    };

    globalThis.addEventListener("scroll", handleScroll);
    return () => globalThis.removeEventListener("scroll", handleScroll);
  }, []);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const reject = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState({ status: "submitting" });

    const data = "Reject";

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/users/${user?.id}/invitation`, {
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
    } catch (error) {
      setState({
        status: "error",

        error: error instanceof Error ? error.message : "Registration failed.",
      });
    }
  };

  const fetchInvitation = async () => {
    try {
      if (!user?.userId || !token) return;

      if (user != null) {
        const response = await fetch(`${API_URL}/users/${user.userId}/invitation`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        console.log("response => ", response)

        if (response.ok) {
          const data = await response.json();
          setInvitation(data);
        }
      }
    } catch (error) {
      console.error(
        "Échec de la récupération des informations utilisateurs: ",
        error
      );
    }
  };

  useEffect(() => {
    fetchInvitation();
  }, [user?.id, token]);

  return (
    <nav
      className={`navbar navbar-expand-lg navbar-dark fixed-top ${
        isShrunk ? "navbar-shrink" : ""
      }`}
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
                  <a
                    className="nav-link"
                    style={{ fontSize: 17 }}
                    href="/profil"
                  >
                    Profil
                  </a>
                  <div className="subpage">
                    <a className="nav-link" href="/profil">
                      Informations
                    </a>
                    <a className="nav-link" href="/boards">
                      Tableaux
                    </a>
                    {user.isAdmin && (
                      <>
                        <a className="nav-link" href="/accountManagment">
                          Gestion des comptes
                        </a>
                        <a className="nav-link" href="/statistics">
                          Statistiquesclear
                        </a>
                      </>
                    )}
                  </div>
                </li>
                <li>
                  <a
                    className="nav-link"
                    style={{ fontSize: 17 }}
                    onClick={handleShow}
                  >
                    Messagerie
                  </a>
                  <>
                    <Modal show={show} onHide={handleClose}>
                      <Modal.Header closeButton>
                        <Modal.Title>Messagerie</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          {Array.isArray(invitations) &&
                            invitations.map((inv) => (
                              <div>
                                <p>
                                  Vous avez reçu une invitation pour rejoindre
                                  le tableau {inv.boardTitle}
                                </p>
                                <Button variant="secondary" onClick={reject}>
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
