import { Button, Form, Modal } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.ts";
import { API_URL } from "../config/api.ts";
import { useEffect, useState, useCallback, useMemo } from "react";
import type { Board } from "../types/boardType.ts";
import { ErrorHandling } from "../utility/ErrorHandling.ts";
import AlertDismissible from "../components/AlertDismissible.tsx";
import "../index.css";

type BoardState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "error"; error: string };

export default function Index() {
  const navigate = useNavigate();
  const { user, authFetch } = useAuth();

  const isConnected = user !== null;

  const [show, setShow] = useState(false);
  const [boards, setBoards] = useState<Board[]>([]);
  const [state, setState] = useState<BoardState>({ status: "idle" });
  const [title, setTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleClose = useCallback(() => setShow(false), []);
  const handleShow = useCallback(() => setShow(true), []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
  };

  const handleCreateBoard = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setState({ status: "submitting" });

    const data = {
      title: title,
    };

    try {
      const response = await authFetch(
        `${API_URL}/users/${user?.userId}/boards`,
        {
          method: "POST",
          body: JSON.stringify(data),
        },
      );

      if (!response.ok) {
        setErrorMessage("Erreur lors de la création du tableau.");
        setState({
          status: "error",
          error: `Update failed (${response.status})`,
        });
        return;
      }

      alert("Tableau ajouté avec succès !");
      setState({ status: "idle" });
      fetchBoards();
      handleClose();
    } catch (error) {
      setState({
        status: "error",
        error: error instanceof Error ? error.message : "Registration failed.",
      });
      navigate("/login");
    }
  };

  const fetchBoards = useCallback(async () => {
    setErrorMessage(null);

    if (!user?.userId) return;

    try {
      const response = await authFetch(
        `${API_URL}/users/${user?.userId}/boards`,
        {
          method: "GET",
        },
      );

      if (!response.ok) {
        throw new ErrorHandling(response.status, `Erreur ${response.status}`);
      }

      const data = await response.json();
      setBoards(data);
    } catch (err) {
      console.error("Échec fetchBoards:", err);

      if (err instanceof Error && err.message === "Empty token...") {
        navigate("/login");
        return;
      }

      if (err instanceof ErrorHandling) {
        switch (err.status) {
          case 401:
            navigate("/login");
            break;
          case 403:
            setErrorMessage(
              "Vous n'avez pas la permission d'accéder à ces tableaux.",
            );
            break;
          case 404:
            setErrorMessage("L'utilisateur ou les tableaux sont introuvables.");
            break;
          case 500:
            setErrorMessage(
              "Le serveur rencontre un problème. Réessayez plus tard.",
            );
            break;
          default:
            setErrorMessage(`Une erreur imprévue (Code: ${err.status})`);
        }
      } else {
        setErrorMessage("Une erreur réseau ou inconnue est survenue.");
      }
    }
  }, [authFetch, navigate, user?.userId]);

  useEffect(() => {
    if (!isConnected) {
      navigate("/login");
    } else {
      fetchBoards();
    }
  }, [fetchBoards, isConnected, navigate]);

  const getBoardsImPartOf = useCallback(
    (boards: Board[]) =>
      boards.filter((board) =>
        board.members.some(
          (m) => m.userDto.id === user?.userId && m.role !== "Invited",
        ),
      ),
    [user?.userId],
  );

  const myBoards = useMemo(
    () => getBoardsImPartOf(boards),
    [boards, getBoardsImPartOf],
  );

  if (!isConnected) return null;

  return (
    <>
      {errorMessage && (
        <div className="error-alert-container">
          <AlertDismissible message={errorMessage} />
        </div>
      )}
      <div className="header-container">
        <h1 className="header-title">Mes tableaux</h1>
        <button type="button" onClick={handleShow} className="btn-create-board">
          + Créer un tableau
        </button>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Ajouter un tableau</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="boardTitle">
                <Form.Label>Titre du tableau</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  placeholder="Entrez le titre içi"
                  required
                  autoFocus
                  onChange={handleChange}
                  disabled={state.status === "submitting"}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleCreateBoard}>
              {state.status === "submitting"
                ? "Ajout du tableau..."
                : "Créer un tableau"}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <div className="boards-list-container">
        {myBoards.length === 0 ? (
          <p className="board-no-board">
            Pour créer votre premier tableau, il vous suffit de cliquer sur le
            bouton "Créer un tableau".
          </p>
        ) : (
          myBoards.map((board) => (
            <div key={board.id} className="board-card">
              <h2>{board.title}</h2>
              <hr />
              <div className="board-card-info">
                <p>Colonnes : {board?.kanbanColumns?.length}</p>
                <p>Membres :</p>
                <ul>
                  {board.members?.map((member) => (
                    <li key={member.userDto.id}>{member.userDto.username}</li>
                  ))}
                </ul>
              </div>
              <Link to={`/board/${board.id}`} className="btn-open-board">
                Ouvrir
              </Link>
            </div>
          ))
        )}
      </div>
    </>
  );
}
