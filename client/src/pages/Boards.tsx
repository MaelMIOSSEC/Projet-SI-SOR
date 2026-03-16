import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar.tsx";
import { Table } from "react-bootstrap";
import { API_URL } from "../config/api.ts";
import type { Board } from "../types/boardType.ts";
import { useAuth } from "../hooks/useAuth.ts";
import { SquarePen, Trash2 } from "lucide-react";
import { Modal, Button, ListGroup, Badge } from "react-bootstrap";
import { Mail } from "lucide-react";
import type { BoardMember } from "../types/boardMemberType.ts";

type SelectedMember = BoardMember & { boardId: string };

type BoardState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "error"; error: string };

interface UserRowProps {
  board: Board;
  index: number;
  user: any;
  boards: Board[];
  fetchBoards: () => void;
  handleShow: (member: SelectedMember) => void;
}

const UserRowItem = ({
  board,
  index,
  user,
  boards,
  fetchBoards,
  handleShow,
}: UserRowProps) => {
  const [formData, setFormData] = useState(board.title);
  const [state, setState] = useState<BoardState>({ status: "idle" });

  const handleDelete = async (
    e: React.MouseEvent<HTMLButtonElement>,
    boardId: string
  ) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/boards/${boardId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) fetchBoards();
    } catch (error) {
      console.error("Erreur suppression : ", error);
    }
  };

  const handleUpdate = async (e: React.MouseEvent<HTMLButtonElement>, boardId: string) => {
        e.preventDefault();

        const data = {
          title: formData,
        };
  
        try {
          const token = localStorage.getItem("token");
  
          const response = await fetch(`${API_URL}/boards/${boardId}`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
  
          if (!response.ok) {
            alert("Erreur lors de la mise à jour du profil.");
            setState({
              status: "error",
              error: `Update failed (${response.status})`,
            });
            return;
          }
  
          fetchBoards();
          setState({ status: "idle" });
        } catch (error) {
          setState({
            status: "error",
  
            error:
              error instanceof Error ? error.message : "Registration failed.",
          });
        }
      };

  const getRole = (idx: number) => {
    const members = boards[idx]?.members;
    return members?.find((m) => m.userDto.id === user?.userId)?.role || null;
  };

  const role = getRole(index);

  return (
    <tr>
      <td>
        {role === "Owner" ? (
          <input
            className="form-control"
            type="text"
            value={formData}
            onChange={(e) => setFormData(e.target.value)}
            disabled={state.status === "submitting"}
          />
        ) : (
          board.title
        )}
      </td>
      <td>
        {board.members?.map((member) => (
          <button
            type="button"
            key={member.userDto.id}
            onClick={() => handleShow({ ...member, boardId: board.id })}
            disabled={member.userDto.id === user?.userId || role !== "Owner"}
            className="btn btn-outline-secondary btn-sm m-1 rounded-pill"
          >
            {member.userDto.username === user?.username
              ? `${member.userDto.username} (vous)`
              : member.userDto.username}
          </button>
        ))}
      </td>
      <td>{board.kanbanColumns?.length}</td>
      <td>
        <Badge bg="secondary">{role}</Badge>
      </td>
      <td>
        <Button
          variant="danger"
          size="sm"
          disabled={role !== "Owner"}
          onClick={(e) => handleDelete(e, board.id)}
        >
          <Trash2 size={16} />
        </Button>
      </td>
      <td>
        <Button
          variant="primary"
          size="sm"
          disabled={role !== "Owner"}
          onClick={(e) => handleUpdate(e, board.id)}
        >
          <SquarePen size={16} />
        </Button>
      </td>
    </tr>
  );
};

export default function Board() {
  const { user } = useAuth();
  const [boards, setBoards] = useState<Board[]>([]);
  const [show, setShow] = useState(false);
  const [selectedMember, setSelectedMember] = useState<SelectedMember | null>(
    null
  );

  const handleShow = (member: SelectedMember) => {
    setSelectedMember(member);
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setSelectedMember(null);
  };

  const HandleDeleteFromBoard = async (
    e: React.MouseEvent<HTMLButtonElement>,
    boardId: string,
    userId: string
  ) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/boards/${boardId}/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        alert("Erreur lors de la mise à jour du profil.");
        return;
      }

      alert("ok");
      fetchBoards();
    } catch (error) {
      console.error(
        "Erreur lors de la suppression d'un membre du tableau : ",
        error
      );
    }
  };

  const fetchBoards = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/users/${user?.userId}/boards`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBoards(data);
      }
    } catch (err) {
      console.error(
        "Échec de la récupération des informations utilisateurs: ",
        err
      );
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "row",
        marginTop: "63px",
        height: "800px",
      }}
    >
      <Sidebar />
      <div
        style={{
          width: "75%",
          margin: "40px",
        }}
      >
        <p style={{ marginTop: "200px" }}>
          Dans cette page, mettre un tableau contenant tous les tableaux dont
          l'utilisateur fais partie avec les informations nécéssaires et si
          l'utilisateur est le créateur du tableau, lui offir la possibilité de
          l'administrer. AJouter un bouton pour supprimer le tableau ou le
          quitter.
        </p>
        <Table striped bordered hover style={{ marginTop: "75px" }}>
          <thead>
            <tr>
              <th scope="col">Nom du tableau</th>
              <th scope="col">Membres</th>
              <th scope="col">Nombre de colonnes</th>
              <th scope="col">Rôle</th>
              <th scope="col"></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(boards) &&
              boards.map((board, index) => (
                <UserRowItem
                  key={board.id}
                  board={board}
                  index={index}
                  user={user}
                  boards={boards}
                  fetchBoards={fetchBoards}
                  handleShow={handleShow}
                />
              ))}
          </tbody>
        </Table>
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
                  {selectedMember.userDto.email}
                </div>
              </ListGroup.Item>
              <ListGroup.Item>
                <div className="fw-bold text-muted small">
                  Rôle sur le projet
                </div>
                <Badge bg="primary">{selectedMember.role}</Badge>
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
            onClick={(e) => {
              if (selectedMember) {
                HandleDeleteFromBoard(
                  e,
                  selectedMember.boardId,
                  selectedMember.userDto.id
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
