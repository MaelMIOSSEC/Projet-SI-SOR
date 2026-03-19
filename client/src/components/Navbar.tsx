import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.ts";
import { Button, Modal } from "react-bootstrap";
import React from "react";
import { API_URL } from "../config/api.ts";
import type { InvitationRow } from "../types/invitationType.ts";
import type { User } from "../types/userType.ts";

const Navbar = () => {
  type InvitationState =
    | { status: "idle" }
    | { status: "submitting" }
    | { status: "error"; error: string };

  const { user, token, authFetch } = useAuth();

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

  const accept = async (
    e: React.MouseEvent<HTMLButtonElement>,
    boardId: string,
  ) => {
    e.preventDefault();
    setState({ status: "submitting" });

    const data = "Accept";

    try {
      const response = await authFetch(
        `${API_URL}/users/${user?.userId}/invitation/${boardId}`,
        {
          method: "PUT",
          body: JSON.stringify(data),
        },
      );

      if (!response.ok) {
        alert("Erreur lors de l'acceptation de l'invitation");
        setState({
          status: "error",
          error: `Update failed (${response.status})`,
        });
        return;
      }
      fetchInvitation();
    } catch (error) {
      setState({
        status: "error",

        error: error instanceof Error ? error.message : "Fail.",
      });
    }
  };

  const reject = async (
    e: React.MouseEvent<HTMLButtonElement>,
    boardId: string,
  ) => {
    e.preventDefault();
    setState({ status: "submitting" });

    const data = "Reject";

    try {
      const response = await authFetch(
        `${API_URL}/users/${user?.userId}/invitation/${boardId}`,
        {
          method: "DELETE",
          body: JSON.stringify(data),
        },
      );

      if (!response.ok) {
        alert("Erreur lors de la suppression de l'invitation");
        setState({
          status: "error",
          error: `Delete failed (${response.status})`,
        });
        return;
      }
      fetchInvitation();
    } catch (error) {
      setState({
        status: "error",

        error: error instanceof Error ? error.message : "Fail.",
      });
    }
  };

  const fetchInvitation = async () => {
    try {
      if (!user?.userId) return;

      if (user != null) {
        const response = await authFetch(
          `${API_URL}/users/${user.userId}/invitation`,
          {
            method: "GET",
          },
        );

        if (response.ok) {
          const data = await response.json();
          setInvitation(data);
        }
      }
    } catch (error) {
      console.error(
        "Échec de la récupération des informations utilisateurs: ",
        error,
      );
    }
  };

  const getInvitation = (invitations: InvitationRow[]) => {
    const newBoards = [];

    for (let i = 0; i < invitations.length; i++) {
      if (invitations[i].role === "Invited") {
        newBoards.push(invitations[i]);
      }
    }

    return newBoards;
  };

  useEffect(() => {
    fetchInvitation();
  }, [user?.userId]);

  console.log("Invitations => ", invitations)

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
            {isConnected ? (
              <>
                <li className="nav-item drop-down-menu">
                  <a className="nav-link" style={{ fontSize: 17 }} href="/">
                    Mes tableaux
                  </a>
                </li>
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
                          Statistiques
                        </a>
                      </>
                    )}
                  </div>
                </li>
                <li className="nav-item drop-down-menu">
                  <a
                    className="nav-link"
                    style={{ fontSize: 17 }}
                    onClick={handleShow}
                  >
                    Messagerie
                  </a>
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
      <>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Messagerie</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {Array.isArray(getInvitation(invitations)) &&
                getInvitation(invitations).map((inv) => (
                  <div>
                    <p>
                      Vous avez reçu une invitation pour rejoindre le tableau{" "}
                      {inv.boardTitle}
                    </p>
                    <Button
                      variant="secondary"
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                        reject(e, `${inv.boardId}`)
                      }
                    >
                      Rejeter!
                    </Button>
                    <Button
                      variant="primary"
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                        accept(e, `${inv.boardId}`)
                      }
                    >
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
    </nav>
  );
};

export default Navbar;
