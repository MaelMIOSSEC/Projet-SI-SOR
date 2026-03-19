import { useEffect, useState, useCallback } from "react";
import Sidebar from "../../components/Sidebar.tsx";
import { useNavigate } from "react-router-dom";
import { Modal, Button, ListGroup, Badge } from "react-bootstrap";
import { API_URL } from "../../config/api.ts";
import type { Board } from "../../types/boardType.ts";
import { useAuth } from "../../hooks/useAuth.ts";
import { SquarePen, Trash2, Mail } from "lucide-react";
import type { BoardMember } from "../../types/boardMemberType.ts";
import { ErrorHandling } from "../../utility/ErrorHandling.ts";
import {
  AlertDismissible,
  ValidationAlert,
} from "../../components/AlertDismissible.tsx";
import "../../index.css";

type SelectedMember = BoardMember & { boardId: string };

interface UserRowProps {
  board: Board;
  user: ReturnType<typeof useAuth>["user"];
  authFetch: ReturnType<typeof useAuth>["authFetch"];
  fetchBoards: () => void;
  handleShow: (member: SelectedMember) => void;
  handleApiError: (err: unknown) => void;
}

const UserRowItem = ({
  board,
  user,
  authFetch,
  fetchBoards,
  handleShow,
  handleApiError,
}: UserRowProps) => {
  const [formData, setFormData] = useState(board.title);
  const [validationMessage, setValidationMessage] = useState<string | null>(
    null,
  );

  const handleDelete = async (
    e: React.MouseEvent<HTMLButtonElement>,
    boardId: string,
  ) => {
    e.preventDefault();

    const confirmation = globalThis.confirm(
      "Voulez-vous vraiment supprimer ce compte ?",
    );

    if (!confirmation) return;

    try {
      const response = await authFetch(`${API_URL}/boards/${boardId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new ErrorHandling(response.status, `Erreur ${response.status}`);
      }

      fetchBoards();
      setValidationMessage("Tableau supprimé avec succès !");
    } catch (err) {
      console.error("Échec handleDelete:", err);
      handleApiError(err);
    }
  };

  const handleUpdate = async (
    e: React.MouseEvent<HTMLButtonElement>,
    boardId: string,
  ) => {
    e.preventDefault();

    const data = {
      title: formData,
    };

    try {
      const response = await authFetch(`${API_URL}/boards/${boardId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new ErrorHandling(response.status, `Erreur ${response.status}`);
      }

      fetchBoards();
      setValidationMessage("Tableau modifié avec succès !");
    } catch (err) {
      console.error("Échec handleUpdate:", err);
      handleApiError(err);
    }
  };

  const role =
    board.members?.find((m) => m.userDto.id === user?.userId)?.role ?? null;

  return (
    <div className="boards-grid-row">
      {validationMessage && (
        <div className="error-alert-container">
          <ValidationAlert message={validationMessage} />
        </div>
      )}
      <div className="boards-grid-cell" data-label="Nom du tableau">
        {role === "Owner" ? (
          <input
            className="board-input"
            type="text"
            value={formData}
            onChange={(e) => setFormData(e.target.value)}
          />
        ) : (
          <span className="fw-medium text-main">{board.title}</span>
        )}
      </div>

      <div className="boards-grid-cell members-cell" data-label="Membres">
        <div className="members-container">
          {board.members?.map((member) => (
            <Button
              variant="outline-secondary"
              size="sm"
              key={member.userDto.id}
              onClick={() => handleShow({ ...member, boardId: board.id })}
              disabled={member.userDto.id === user?.userId || role !== "Owner"}
              className="member-btn"
            >
              {member.userDto.username === user?.username
                ? `${member.userDto.username} (vous)`
                : member.userDto.username}
            </Button>
          ))}
        </div>
      </div>

      <div className="boards-grid-cell cell-center" data-label="Colonnes">
        {board.kanbanColumns?.length || 0}
      </div>

      <div className="boards-grid-cell cell-center" data-label="Rôle">
        <Badge bg={role === "Owner" ? "primary" : "secondary"}>{role}</Badge>
      </div>

      <div className="boards-grid-cell cell-center" data-label="Supprimer">
        <Button
          variant="danger"
          size="sm"
          disabled={role !== "Owner"}
          onClick={(e) => handleDelete(e, board.id)}
        >
          <Trash2 size={16} />
        </Button>
      </div>

      <div className="boards-grid-cell cell-center" data-label="Modifier">
        <Button
          variant="primary"
          size="sm"
          disabled={role !== "Owner"}
          onClick={(e) => handleUpdate(e, board.id)}
        >
          <SquarePen size={16} />
        </Button>
      </div>
    </div>
  );
};

export default function Boards() {
  const navigate = useNavigate();
  const { user, authFetch } = useAuth();
  const [boards, setBoards] = useState<Board[]>([]);
  const [show, setShow] = useState(false);
  const [selectedMember, setSelectedMember] = useState<SelectedMember | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [validationMessage, setValidationMessage] = useState<string | null>(
    null,
  );

  const handleApiError = useCallback(
    (err: unknown) => {
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
              "Vous n'avez pas la permission d'effectuer cette action.",
            );
            break;
          case 404:
            setErrorMessage("Les tableaux sont introuvables.");
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
    },
    [navigate],
  );

  const handleShow = (member: SelectedMember) => {
    setSelectedMember(member);
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setSelectedMember(null);
  };

  const fetchBoards = useCallback(async () => {
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
      handleApiError(err);
    }
  }, [authFetch, handleApiError, user?.userId]);

  const handleDeleteFromBoard = async (
    e: React.MouseEvent<HTMLButtonElement>,
    boardId: string,
    userId: string,
  ) => {
    e.preventDefault();
    setErrorMessage(null);

    const confirmation = globalThis.confirm(
      "Voulez-vous vraiment supprimer ce compte du tableau ?",
    );

    if (!confirmation) return;

    try {
      const response = await authFetch(
        `${API_URL}/boards/${boardId}/users/${userId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new ErrorHandling(response.status, `Erreur ${response.status}`);
      }

      fetchBoards();
      setValidationMessage("Utilisateur supprimé du tableau avec succès !");
    } catch (err) {
      console.error("Échec handleDeleteFromBoard:", err);
      handleApiError(err);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  return (
    <main className="boards-page-container">
      {validationMessage && (
        <div className="error-alert-container">
          <ValidationAlert message={validationMessage} />
        </div>
      )}
      {errorMessage && (
        <div className="error-alert-container">
          <AlertDismissible message={errorMessage} />
        </div>
      )}

      <Sidebar />

      <div className="boards-content">
        <h2 className="mb-4" style={{ color: "var(--text-main)" }}>
          Gestion des Tableaux
        </h2>

        <div className="boards-grid-container">
          {/* L'en-tête (Head) de notre tableau Grid */}
          <div className="boards-grid-header">
            <div>Nom du tableau</div>
            <div>Membres</div>
            <div className="text-center">Colonnes</div>
            <div className="text-center">Rôle</div>
            <div className="text-center">Supprimer</div>
            <div className="text-center">Modifier</div>
          </div>

          {/* Le corps (Body) de notre tableau Grid */}
          <div className="boards-grid-body">
            {boards.map((board) => (
              <UserRowItem
                key={board.id}
                board={board}
                user={user}
                authFetch={authFetch}
                fetchBoards={fetchBoards}
                handleShow={handleShow}
                handleApiError={handleApiError}
              />
            ))}

            {boards.length === 0 && (
              <div
                className="boards-grid-row"
                style={{ gridTemplateColumns: "1fr", justifyContent: "center" }}
              >
                <div className="text-center py-4 text-muted w-100">
                  Aucun tableau trouvé.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            Profil de {selectedMember?.userDto.username}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMember && (
            <ListGroup variant="flush">
              <ListGroup.Item>
                <div className="fw-bold text-muted small">Nom complet</div>
                {selectedMember.userDto.name} {selectedMember.userDto.lastName}
              </ListGroup.Item>
              <ListGroup.Item>
                <div className="fw-bold text-muted small">Email</div>
                <div className="d-flex align-items-center">
                  <Mail size={14} className="me-2" />{" "}
                  <a
                    href={`mailto:${selectedMember.userDto.email}`}
                    className="text-decoration-none"
                  >
                    {selectedMember.userDto.email}
                  </a>
                </div>
              </ListGroup.Item>
              <ListGroup.Item>
                <div className="fw-bold text-muted small">
                  Rôle sur le projet
                </div>
                <Badge bg="primary" className="mt-1">
                  {selectedMember.role}
                </Badge>
              </ListGroup.Item>
            </ListGroup>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Fermer
          </Button>
          <Button
            variant="danger"
            onClick={async (e) => {
              if (selectedMember) {
                await handleDeleteFromBoard(
                  e,
                  selectedMember.boardId,
                  selectedMember.userDto.id,
                );
                handleClose();
              }
            }}
          >
            Retirer du tableau
          </Button>
        </Modal.Footer>
      </Modal>
    </main>
  );
}
