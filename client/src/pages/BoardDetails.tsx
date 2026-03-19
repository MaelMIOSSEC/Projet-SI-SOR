import { useEffect, useState, useCallback } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { Trash2, MessagesSquare } from "lucide-react";

import { API_URL, URL_TOMCAT } from "../config/api.ts";
import { useAuth } from "../hooks/useAuth.ts";
import type { Board } from "../types/boardType.ts";
import type { KanbanColumn } from "../types/kanbanColumnType.ts";
import type { Task } from "../types/taskType.ts";
import type { User, UserRow } from "../types/userType.ts";
import type { Comment as TaskComment } from "../types/commentType.ts";
import {
  AlertDismissible,
  ValidationAlert,
} from "../components/AlertDismissible.tsx";

import "../index.css";

// ============================================================================
// TYPES ET INTERFACES
// ============================================================================
type BoardState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "error"; error: string };

interface TaskFormData {
  taskId: string;
  title: string;
  description: string;
  deadline: string;
  priority: string;
  user: User | null;
  kanbanColumn: KanbanColumn | null;
}

interface AddUserFormData {
  userId: string;
  boardId: string | undefined;
}

interface ColumnFormData {
  title: string;
  position: string;
  idBoard: string;
}

// ============================================================================
// COMPOSANT ENFANT : KanbanColumnItem
// ============================================================================
const KanbanColumnItem = ({
  kanbanColumn,
  onUpdateTaskCount,
  onTaskClick,
  fetchBoard,
  refreshTrigger,
  handleCloseTaskModale,
}: {
  kanbanColumn: KanbanColumn;
  onUpdateTaskCount: (columnId: string, count: number) => void;
  onTaskClick: (kanbanColumn: KanbanColumn, task: Task) => void;
  fetchBoard: () => void;
  refreshTrigger: number;
  handleCloseTaskModale: () => void;
}) => {
  const { token, authFetch } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [activeTaskModalId, setActiveTaskModalId] = useState<string | null>(
    null,
  );
  const [newCommentText, setNewCommentText] = useState("");

  // États pour les messages de succès et d'erreur
  const [validationMessage, setValidationMessage] = useState<string | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleClose = () => setActiveTaskModalId(null);
  const handleShow = (taskId: string) => setActiveTaskModalId(taskId);

  const fetchComments = async (taskId: string) => {
    try {
      if (!token) return;
      const response = await authFetch(`${API_URL}/comments/tasks/${taskId}`, {
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des commentaires: ", err);
    }
  };

  const handleCreateComment = async (taskId: string) => {
    if (!newCommentText.trim()) return;

    setErrorMessage(null);
    setValidationMessage(null);

    try {
      const response = await authFetch(`${API_URL}/comments/tasks/${taskId}`, {
        method: "POST",
        body: JSON.stringify({ content: newCommentText }),
      });
      if (response.ok) {
        setNewCommentText("");
        fetchComments(taskId);
        setValidationMessage("Commentaire ajouté avec succès !");
      } else {
        setErrorMessage("Erreur lors de l'ajout du commentaire.");
      }
    } catch (err) {
      console.error("Erreur:", err);
      setErrorMessage("Erreur de connexion lors de l'ajout du commentaire.");
    }
  };

  const fetchTasks = useCallback(async () => {
    try {
      const response = await authFetch(
        `${API_URL}/columns/${kanbanColumn.id}/tasks`,
        { method: "GET" },
      );
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
        onUpdateTaskCount(kanbanColumn.id, data.length);
      }
    } catch (err) {
      console.error("Échec de la récupération des tâches: ", err);
    }
  }, [kanbanColumn.id, onUpdateTaskCount]);

  const handleDeleteTask = async (
    e: React.MouseEvent<HTMLButtonElement>,
    taskId: string,
  ) => {
    e.preventDefault();
    if (!taskId) return;

    setErrorMessage(null);
    setValidationMessage(null);

    try {
      const response = await authFetch(`${API_URL}/tasks/${taskId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        setErrorMessage("Erreur lors de la suppression de la tâche.");
        return;
      }

      fetchBoard();
      handleCloseTaskModale();
      setValidationMessage("Tâche supprimée !");
    } catch (error) {
      console.error("Erreur suppression:", error);
      setErrorMessage(
        "Erreur de connexion lors de la suppression de la tâche.",
      );
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks, refreshTrigger]);

  const currentDate = new Date().toISOString().split("T")[0];

  return (
    <>
      {errorMessage && (
        <div
          className="error-alert-container"
          style={{ width: "90%", marginTop: "10px" }}
        >
          <AlertDismissible message={errorMessage} />
        </div>
      )}
      {validationMessage && (
        <div
          className="success-alert-container"
          style={{ width: "90%", marginTop: "10px" }}
        >
          <ValidationAlert message={validationMessage} />
        </div>
      )}

      {tasks.map((task: Task) => {
        const isExpired = task.deadline
          ? currentDate > new Date(task.deadline).toISOString().split("T")[0]
          : false;
        const expiredClass = isExpired ? "expired" : "";
        const priorityClass =
          task.priority === "Strong"
            ? "priority-strong"
            : task.priority === "Medium"
              ? "priority-medium"
              : "priority-low";

        return (
          <div
            key={task.id}
            className={`task-container ${priorityClass} ${expiredClass}`}
          >
            <button
              type="button"
              onClick={() => onTaskClick(kanbanColumn, task)}
              className={`task-title-btn ${expiredClass}`}
            >
              {task.title}
            </button>

            <button
              type="button"
              onClick={() => {
                handleShow(task.id);
                fetchComments(task.id);
              }}
              className={`task-action-btn ${expiredClass}`}
            >
              <MessagesSquare size={18} />
            </button>

            <Modal show={activeTaskModalId === task.id} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>
                  Commentaires de la tâche : {task.title}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {Array.isArray(comments) &&
                  comments.map((comment, idx) => (
                    <div key={idx}>
                      <h6>{comment.userId}</h6>
                      <p>{comment.content}</p>
                    </div>
                  ))}
              </Modal.Body>
              <Modal.Footer>
                <Form.Control
                  type="text"
                  placeholder="Écrivez un commentaire..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && handleCreateComment(task.id)
                  }
                />
                <Button
                  variant="primary"
                  onClick={() => handleCreateComment(task.id)}
                  disabled={!newCommentText.trim()}
                >
                  Ajouter
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                  Fermer
                </Button>
              </Modal.Footer>
            </Modal>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteTask(e, task.id);
              }}
              type="button"
              className={`task-action-btn ${expiredClass}`}
            >
              <Trash2 size={18} />
            </button>
          </div>
        );
      })}
    </>
  );
};

// ============================================================================
// COMPOSANT PRINCIPAL : BoardDetails
// ============================================================================
export default function BoardDetails() {
  const navigate = useNavigate();
  const { boardId } = useParams();
  const { user, authFetch } = useAuth();

  // --- States ---
  const [board, setBoard] = useState<Board>();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [taskCounts, setTaskCounts] = useState<Record<string, number>>({});
  const [state, setState] = useState<BoardState>({ status: "idle" });
  const [validationMessage, setValidationMessage] = useState<string | null>(
    null,
  );
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Modals visibility
  const [showShareModal, setShowShareModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showColumnModal, setShowColumnModal] = useState(false);

  // Forms data
  const [formDataAddUser, setFormDataAddUser] = useState<AddUserFormData>({
    userId: "",
    boardId: boardId,
  });
  const [formDataColumn, setFormDataColumn] = useState<ColumnFormData>({
    title: "",
    position: "",
    idBoard: boardId || "",
  });
  const [formDataTask, setFormDataTask] = useState<TaskFormData>({
    taskId: "",
    title: "",
    description: "",
    deadline: "",
    priority: "",
    user: null,
    kanbanColumn: null,
  });

  // --- Fetchers ---
  const fetchBoard = useCallback(async () => {
    try {
      const response = await authFetch(`${API_URL}/boards/${boardId}`, {
        method: "GET",
      });
      if (response.ok) setBoard(await response.json());
    } catch (err) {
      console.error("Échec récupération board: ", err);
    }
  }, [boardId]);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await authFetch(`${API_URL}/users`, { method: "GET" });
      if (response.ok) setUsers(await response.json());
    } catch (error) {
      console.error("Erreur récupération utilisateurs :", error);
    }
  }, []);

  // --- Effects ---
  useEffect(() => {
    fetchBoard();
    fetchUsers();
  }, [fetchBoard, fetchUsers]);

  useEffect(() => {
    if (!board) return;
    const isMember = board.members?.some(
      (member) => member.userDto.id === user?.userId,
    );
    if (!isMember) navigate("/");
  }, [board, navigate, user?.userId]);

  // --- Helpers ---
  const sortUserForAddUserOfTask = (usersList: UserRow[]) => {
    if (!board?.members) return [];
    const allowedIds = new Set(
      board.members
        .filter((m) => m.role !== "Invited")
        .map((m) => m.userDto.id),
    );
    return usersList.filter((u) => allowedIds.has(u.id));
  };

  const sortUser = (usersList: UserRow[]) => {
    if (!board?.members) return usersList;
    return usersList.filter(
      (u) => !board.members.some((m) => m.userDto.id === u.id),
    );
  };

  const handleUpdateCount = useCallback((columnId: string, count: number) => {
    setTaskCounts((prev) => ({ ...prev, [columnId]: count }));
  }, []);

  // --- Handlers ---
  const handleShowTaskModale = (kanbanColumn: KanbanColumn, task?: Task) => {
    if (task) {
      setFormDataTask({
        taskId: task.id,
        title: task.title,
        description: task.description || "",
        deadline: task.deadline || "",
        priority: task.priority || "",
        user: task.user?.id
          ? ({ id: task.user.id } as unknown as string)
          : null,
        kanbanColumn: kanbanColumn,
      });
    } else {
      setFormDataTask({
        taskId: "",
        title: "",
        description: "",
        deadline: "",
        priority: "",
        user: null,
        kanbanColumn: kanbanColumn,
      });
    }
    setShowTaskModal(true);
  };

  const handleChangeTask = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormDataTask((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleChangeColumn = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormDataColumn((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // --- API Calls ---
  const handleAddUserToBoard = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    setState({ status: "submitting" });
    setValidationMessage(null);
    try {
      const response = await authFetch(`${API_URL}/boards/${boardId}/users`, {
        method: "POST",
        body: JSON.stringify({ id: formDataAddUser.userId }),
      });
      if (!response.ok) throw new Error(`Insert failed (${response.status})`);

      fetchBoard();
      setValidationMessage("Utilisateur invité avec succès !");
      setState({ status: "idle" });
      setShowShareModal(false);
    } catch (error) {
      setState({
        status: "error",
        error: "Erreur lors de l'invitation de l'utilisateur.",
      });
    }
  };

  const handleCreateTask = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setState({ status: "submitting" });
    setValidationMessage(null);
    const data = {
      title: formDataTask.title,
      description: formDataTask.description || null,
      deadline: formDataTask.deadline || null,
      priority: formDataTask.priority || null,
      user:
        formDataTask.user && formDataTask.user.id
          ? { id: formDataTask.user.id }
          : null,
      kanbanColumn: { id: formDataTask.kanbanColumn?.id },
    };

    try {
      const response = await authFetch(`${API_URL}/tasks`, {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(`Insert failed (${response.status})`);

      fetchBoard();
      setRefreshTrigger(prev => prev + 1);
      setValidationMessage("Tâche ajoutée avec succès !");
      setState({ status: "idle" });
      setShowTaskModal(false);
    } catch (error) {
      setState({
        status: "error",
        error: "Erreur lors de la création de la tâche.",
      });
    }
  };

  const handleUpdateTask = async (
    e: React.MouseEvent<HTMLButtonElement>,
    taskId: string,
  ) => {
    e.preventDefault();
    if (!taskId) return;
    setState({ status: "submitting" });
    setValidationMessage(null);
    const data = {
      title: formDataTask.title,
      description: formDataTask.description || null,
      deadline: formDataTask.deadline || null,
      priority: formDataTask.priority || null,
      user:
        formDataTask.user && formDataTask.user.id
          ? { id: formDataTask.user.id }
          : null,
      kanbanColumn: { id: formDataTask.kanbanColumn?.id },
    };

    try {
      const response = await authFetch(`${API_URL}/tasks/${taskId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(`Update failed (${response.status})`);

      setValidationMessage("Tâche modifiée avec succès !");
      fetchBoard();
      setRefreshTrigger(prev => prev + 1);
      setState({ status: "idle" });
      setShowTaskModal(false);
    } catch (error) {
      setState({
        status: "error",
        error: "Erreur lors de la mise à jour de la tâche.",
      });
    }
  };

  const handleCreateColumn = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setState({ status: "submitting" });
    setValidationMessage(null);
    const data = {
      title: formDataColumn.title,
      position: nextColumnPosition,
      idBoard: boardId,
    };

    try {
      const response = await authFetch(`${API_URL}/columns`, {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(`Insert failed (${response.status})`);

      fetchBoard();
      setValidationMessage("Colonne ajoutée avec succès !");
      setState({ status: "idle" });
      setShowColumnModal(false);
    } catch (error) {
      setState({
        status: "error",
        error: "Erreur lors de la création de la colonne.",
      });
    }
  };

  const handleDeleteColumn = async (
    e: React.MouseEvent<HTMLButtonElement>,
    columnId: string,
  ) => {
    e.preventDefault();
    setValidationMessage(null);

    const confirmation = globalThis.confirm(
      "Voulez-vous vraiment supprimer cette colonne ?",
    );

    if (!confirmation) return;

    try {
      const response = await authFetch(
        `${API_URL}/boards/${boardId}/columns/${columnId}`,
        { method: "DELETE" },
      );

      if (!response.ok) throw new Error(`Delete failed (${response.status})`);

      fetchBoard();
      setRefreshTrigger(prev => prev + 1);
      setValidationMessage("Colonne supprimée avec succès !");
      setState({ status: "idle" });
    } catch (error) {
      console.error("X. Erreur catchée :", error);
      setState({
        status: "error",
        error: "Erreur lors de la suppression de la colonne.",
      });
    }
  };

  const nextColumnPosition = board?.kanbanColumns
    ? Math.max(0, ...board.kanbanColumns.map((col) => col.position)) + 1
    : 1;

  // --- Render ---
  return (
    <div className="board-container">
      {/* Alertes globales du tableau */}
      {state.status === "error" && (
        <div style={{ marginBottom: "20px" }}>
          <AlertDismissible message={state.error} />
        </div>
      )}
      {validationMessage && (
        <div style={{ marginBottom: "20px" }}>
          <ValidationAlert message={validationMessage} />
        </div>
      )}

      {/* En-tête du tableau */}
      <div className="board-header">
        <h3>{board?.title}</h3>
        <button
          type="button"
          className="btn btn-info"
          onClick={() => setShowShareModal(true)}
        >
          Partager
        </button>
      </div>

      {/* Modal Partage */}
      <Modal show={showShareModal} onHide={() => setShowShareModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Partager</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="addUser">
            <Form.Label>Utilisateurs</Form.Label>
            <Form.Select
              name="userId"
              onChange={(e) =>
                setFormDataAddUser({
                  ...formDataAddUser,
                  userId: e.target.value,
                })
              }
              value={formDataAddUser.userId}
              disabled={state.status === "submitting"}
            >
              <option value="">Sélectionnez un utilisateur</option>
              {sortUser(users).map((u) => (
                <option key={u.id} value={u.id}>
                  {u.username}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowShareModal(false)}>
            Fermer
          </Button>
          <Button
            variant="primary"
            onClick={handleAddUserToBoard}
            disabled={!formDataAddUser.userId || state.status === "submitting"}
          >
            Inviter
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Conteneur des Colonnes */}
      <div className="columns-wrapper">
        {Array.isArray(board?.kanbanColumns) &&
          board?.kanbanColumns.map((kanbanColumn) => (
            <div key={kanbanColumn.id} className="column-container">
              <div
                className="column-header"
                style={{ display: "flex", alignItems: "center" }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteColumn(e, kanbanColumn.id);
                  }}
                  className="delete-column-btn"
                  title="Supprimer la colonne"
                >
                  <Trash2 size={16} />
                </button>
                <h3>{kanbanColumn.title}</h3>
                <h6 className="column-count">
                  ({taskCounts[kanbanColumn.id] || 0})
                </h6>
              </div>

              <KanbanColumnItem
                kanbanColumn={kanbanColumn}
                refreshTrigger={refreshTrigger}
                onUpdateTaskCount={handleUpdateCount}
                onTaskClick={handleShowTaskModale}
                fetchBoard={fetchBoard}
                handleCloseTaskModale={() => setShowTaskModal(false)}
              />

              <button
                type="button"
                onClick={() => handleShowTaskModale(kanbanColumn)}
                className="add-task-btn"
              >
                + Ajouter une tâche
              </button>
            </div>
          ))}

        {/* Bouton Ajouter Colonne */}
        <div className="add-column-container">
          <button
            onClick={() => setShowColumnModal(true)}
            type="button"
            className="add-column-btn"
          >
            + Ajouter une colonne
          </button>
        </div>
      </div>

      {/* Modal Tâche */}
      <Modal show={showTaskModal} onHide={() => setShowTaskModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {formDataTask.taskId ? "Modifier la tâche" : "Ajouter une tâche"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Titre*</Form.Label>
              <Form.Control
                type="text"
                name="title"
                required
                autoFocus
                value={formDataTask.title}
                onChange={handleChangeTask}
                disabled={state.status === "submitting"}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={formDataTask.description}
                onChange={handleChangeTask}
                disabled={state.status === "submitting"}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Deadline</Form.Label>
              <Form.Control
                type="date"
                name="deadline"
                value={formDataTask.deadline}
                onChange={handleChangeTask}
                disabled={state.status === "submitting"}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Priorité</Form.Label>
              <Form.Select
                name="priority"
                value={formDataTask.priority}
                onChange={handleChangeTask}
                disabled={state.status === "submitting"}
              >
                <option value="">Sélectionnez une priorité</option>
                <option value="Strong">Strong (Haute)</option>
                <option value="Medium">Medium (Moyenne)</option>
                <option value="Low">Low (Basse)</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Assignée à</Form.Label>
              <Form.Select
                name="user"
                value={formDataTask.user?.id || ""}
                onChange={(e) =>
                  setFormDataTask((prev) => ({
                    ...prev,
                    user: e.target.value
                      ? ({ id: e.target.value } as any)
                      : null,
                  }))
                }
                disabled={state.status === "submitting"}
              >
                <option value="">Sélectionnez un utilisateur</option>
                {sortUserForAddUserOfTask(users).map((u) => (
                  <option key={String(u.id ?? "")} value={String(u.id ?? "")}>
                    {u.username}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {formDataTask.taskId ? (
            <Button
              variant="warning"
              onClick={(e) => handleUpdateTask(e, formDataTask.taskId)}
              disabled={state.status === "submitting"}
            >
              {state.status === "submitting" ? "Modification..." : "Modifier"}
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleCreateTask}
              disabled={state.status === "submitting"}
            >
              {state.status === "submitting" ? "Création..." : "Créer"}
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* Modal Colonne */}
      <Modal show={showColumnModal} onHide={() => setShowColumnModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter une colonne</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Titre de la colonne</Form.Label>
            <Form.Control
              type="text"
              name="title"
              required
              autoFocus
              onChange={handleChangeColumn}
              disabled={state.status === "submitting"}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={handleCreateColumn}
            disabled={!formDataColumn.title || state.status === "submitting"}
          >
            {state.status === "submitting" ? "Création..." : "Créer"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
