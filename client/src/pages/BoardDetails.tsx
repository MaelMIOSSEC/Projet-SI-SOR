import { Button, Form, Modal } from "react-bootstrap";
import { useEffect, useState, useCallback } from "react";
import { API_URL, URL_TOMCAT } from "../config/api.ts";
import { useAuth } from "../hooks/useAuth.ts";
import type { Board } from "../types/boardType.ts";
import { useParams } from "react-router/internal/react-server-client";
import type { KanbanColumn } from "../types/kanbanColumnType.ts";
import type { Task } from "../types/taskType.ts";
import type { User, UserRow } from "../types/userType.ts";
import { Trash2, MessagesSquare } from "lucide-react";
import type { Comment as TaskComment } from "../types/commentType.ts";

type BoardState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "error"; error: string };

const KanbanColumnItem = ({
  kanbanColumn,
  onTasksLoaded,
  onTaskClick,
  fetchBoard,
  handleCloseTaskModale,
}: {
  kanbanColumn: KanbanColumn;
  onTasksLoaded: (count: number) => void;
  onTaskClick: (kanbanColumn: KanbanColumn, task: Task) => void;
  fetchBoard: () => void;
  handleCloseTaskModale: () => void;
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const { token } = useAuth();

  const [show, setShow] = useState(false);
  const [comments, setComments] = useState<TaskComment[]>([]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [newCommentText, setNewCommentText] = useState("");

  const handleCreateComment = async (taskId: string) => {
    if (!newCommentText.trim()) return;

    try {
      const response = await fetch(`${URL_TOMCAT}/comments/tasks/${taskId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newCommentText }),
      });

      if (response.ok) {
        setNewCommentText("");
        fetchComments(taskId);
      } else {
        alert("Erreur lors de l'ajout du commentaire");
      }
    } catch (err) {
      console.error("Erreur:", err);
    }
  };

  const fetchComments = async (taskId: string) => {
    try {
      if (!token) return;
      const response = await fetch(`${URL_TOMCAT}/comments/tasks/${taskId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des commentaires: ", err);
    }
  };

  const fetchTasks = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/columns/${kanbanColumn.id}/tasks`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setTasks(data);
        onTasksLoaded(data.length);
      }
    } catch (err) {
      console.error(
        "Échec de la récupération des informations utilisateurs: ",
        err,
      );
    }
  }, [kanbanColumn.id, onTasksLoaded]);

  const handleDeleteTask = async (
    e: React.MouseEvent<HTMLButtonElement>,
    taskId: string,
  ) => {
    e.preventDefault();

    if (!taskId) {
      console.error("Impossible de supprimer : taskId est manquant");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        alert("Erreur lors de la suppression de la tache.");
        return;
      }

      alert("Tache supprimée !");
      fetchBoard();
      handleCloseTaskModale();
    } catch (error) {
      console.error("Erreur suppression:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const actualDate = new Date().toISOString().split("T")[0];

  return (
    <>
      {tasks.map((task: Task) => {
        const isExpired =
          actualDate > new Date(task.deadline).toISOString().split("T")[0];

        const bgColor =
          task.priority === "Strong"
            ? "#dc3545"
            : task.priority === "Medium"
              ? "#ffc107"
              : "#198754";
        const textColor = task.priority === "Medium" ? "#212529" : "white";

        return (
          <div
            key={task.id}
            style={{
              width: "300px",
              padding: "10px",
              borderRadius: "20px",
              margin: "20px",
              boxShadow: "gray -1px 1px 3px",
              backgroundColor: isExpired ? "#e9ecef" : bgColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              opacity: isExpired ? "0.7" : "1",
            }}
          >
            <button
              type="button"
              disabled={isExpired}
              onClick={() => onTaskClick(kanbanColumn, task)}
              style={{
                flex: 1,
                background: "none",
                border: "none",
                textAlign: "left",
                color: isExpired ? "#6c757d" : textColor,
                fontWeight: "600",
                cursor: isExpired ? "default" : "pointer",
                padding: "5px 10px",
              }}
            >
              {task.title}
            </button>
            <button
              type="button"
              onClick={() => {
                handleShow();
                fetchComments(task.id);
              }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: isExpired ? "#6c757d" : textColor,
                padding: "5px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <MessagesSquare size={18} />
            </button>

            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>
                  Commentaires de la tache : {task.title}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {Array.isArray(comments) &&
                  comments.map((comment) => (
                    <div>
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
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: isExpired ? "#6c757d" : textColor,
                padding: "5px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Trash2 size={18} />
            </button>
          </div>
        );
      })}
    </>
  );
};

export default function BoardDetails() {
  interface TaskFormData {
    taskId: string;
    title: string;
    description: string;
    deadline: string;
    priority: string;
    user: User | null;
    kanbanColumn: KanbanColumn | null;
  }

  interface AddUserFromData {
    userId: string;
    boardId: string | undefined;
  }

  interface ColumnFormData {
    title: string;
    position: string;
    idBoard: string;
  }

  const { user, token } = useAuth();
  const { boardId } = useParams();

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showTask, setShowTask] = useState(false);
  const [showColumn, setShowColumn] = useState(false);
  const [board, setBoard] = useState<Board>();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [taskCounts, setTaskCounts] = useState<Record<string, number>>({});
  const [state, setState] = useState<BoardState>({ status: "idle" });
  const [formDataAddUser, setFormDataAddUser] = useState<AddUserFromData>({
    userId: "",
    boardId: boardId,
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
  const [formDataColumn, setFormDataColumn] = useState<ColumnFormData>({
    title: "",
    position: "",
    idBoard: "",
  });

  const handleCloseTaskModale = () => setShowTask(false);
  const handleShowTaskModale = (kanbanColumn: KanbanColumn, task?: Task) => {
    if (task) {
      setFormDataTask({
        taskId: task.id,
        title: task.title,
        description: task.description || "",
        deadline: task.deadline || "",
        priority: task.priority || "",
        user: task.user.id ? ({ id: task.user.id } as string) : null,
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
    setShowTask(true);
  };

  const handleCloseColumnModale = () => setShowColumn(false);
  const handleShowColumnModale = () => {
    setShowColumn(true);
  };

  const fetchUsers = useCallback(async () => {
    try {
      if (!token) return;

      const response = await fetch(`${API_URL}/users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error("Erreur serveur API:", response.status);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error);
    }
  }, [token]);

  const sortUserForAddUserOfTask = (users: UserRow[]) => {
    const boardMembers = board?.members;

    if (!boardMembers) return [];

    return users.filter((user) =>
      boardMembers.some((member) => member.userDto.id === user.id),
    );
  };

  const sortUser = (users: UserRow[]) => {
    const boardMembers = board?.members;

    if (!boardMembers) return users;

    return users.filter(
      (user) => !boardMembers.some((member) => member.userDto.id === user.id),
    );
  };

  const handleAddUserToBoard = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    setState({ status: "submitting" });

    const data = {
      id: formDataAddUser.userId,
    };

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/boards/${boardId}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        alert("Erreur lors de l'invitation de l'utilisateur.");
        setState({
          status: "error",
          error: `Insert failed (${response.status})`,
        });
        return;
      }

      fetchBoard();
      alert("Utilisateur invité avec succès !");
      setState({ status: "idle" });
      handleClose();
    } catch (error) {
      setState({
        status: "error",

        error: error instanceof Error ? error.message : "Invitation failed.",
      });
    }
  };

  const handleUpdateCount = (columnId: string, count: number) => {
    setTaskCounts((prev) => ({ ...prev, [columnId]: count }));
  };

  const handleChangeTask = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormDataTask((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleChangeColumn = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormDataColumn((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleCreateTask = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setState({ status: "submitting" });

    const data = {
      title: formDataTask?.title,
      description: formDataTask?.description,
      deadline: formDataTask?.deadline,
      priority: formDataTask?.priority,
      user: formDataTask.user ? { id: formDataTask.user.id } : null,
      kanbanColumn: { id: formDataTask.kanbanColumn?.id },
    };

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        alert("Erreur lors de la création de la tache.");
        setState({
          status: "error",
          error: `Insert failed (${response.status})`,
        });
        return;
      }

      fetchBoard();
      alert("Tache ajoutée avec succès !");
      setState({ status: "idle" });
      handleCloseTaskModale();
    } catch (error) {
      setState({
        status: "error",

        error: error instanceof Error ? error.message : "Registration failed.",
      });
    }
  };

  const handleCreateColumn = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setState({ status: "submitting" });

    const data = {
      title: formDataColumn?.title,
      position: nextColumnPosition,
      idBoard: boardId,
    };

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/columns`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        alert("Erreur lors de la création de la colonne.");
        setState({
          status: "error",
          error: `Insert failed (${response.status})`,
        });
        return;
      }

      fetchBoard();
      alert("Colonne ajoutée avec succès !");
      setState({ status: "idle" });
      handleCloseColumnModale();
    } catch (error) {
      setState({
        status: "error",

        error: error instanceof Error ? error.message : "Registration failed.",
      });
    }
  };

  const handleDeleteColumn = async (
    e: React.MouseEvent<HTMLButtonElement>,
    columnId: string,
  ) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/boards/${boardId}/columns/${columnId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        alert("Erreur lors de la suppression de la colonne.");
        setState({
          status: "error",
          error: `Delete failed (${response.status})`,
        });
        return;
      }

      fetchBoard();
    } catch (error) {
      setState({
        status: "error",

        error: error instanceof Error ? error.message : "Registration failed.",
      });
    }
  };

  const handleUpdateTask = async (
    e: React.MouseEvent<HTMLButtonElement>,
    taskId: string,
  ) => {
    e.preventDefault();
    setState({ status: "submitting" });

    const data = {
      title: formDataTask?.title,
      description: formDataTask?.description,
      deadline: formDataTask?.deadline,
      priority: formDataTask?.priority,
      user: formDataTask.user ? { id: formDataTask.user.id } : null,
      kanbanColumn: { id: formDataTask.kanbanColumn?.id },
    };

    if (!taskId) {
      console.error("Impossible de modifier : taskId est manquant");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        alert("Erreur lors de la mise à jour de la tache.");
        setState({
          status: "error",
          error: `Update failed (${response.status})`,
        });
        return;
      }

      alert("Tache modifiée !");
      fetchBoard();
      setState({ status: "idle" });
      handleCloseTaskModale();
    } catch (error) {
      console.error("Erreur suppression:", error);
    }
  };

  const fetchBoard = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/boards/${boardId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBoard(data);
      }
    } catch (err) {
      console.error(
        "Échec de la récupération des informations utilisateurs: ",
        err,
      );
    }
  }, [boardId]);

  useEffect(() => {
    fetchBoard();
    fetchUsers();
  }, [fetchBoard, fetchUsers]);
  const nextColumnPosition = board?.kanbanColumns
    ? Math.max(0, ...board.kanbanColumns.map((col) => col.position)) + 1
    : 1;

  return (
    <>
      <>
        <div
          style={{
            marginTop: "100px",
            display: "flex",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <h3>
            {board?.title}
            <button type="button" className="btn btn-info" onClick={handleShow}>
              Partager
            </button>
          </h3>
          <>
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Partager</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Form.Group className="mb-3" controlId="addUser">
                    <Form.Label>utilisateurs</Form.Label>
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
                      {sortUser(users).map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.username}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                    handleAddUserToBoard(e)
                  }
                >
                  Inviter
                </Button>
              </Modal.Footer>
            </Modal>
          </>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "30px",
              alignItems: "flex-start",
              overflowX: "auto",
              paddingBottom: "20px",
            }}
          >
            {Array.isArray(board?.kanbanColumns) &&
              board?.kanbanColumns.map((kanbanColumn) => (
                <div
                  key={kanbanColumn.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "400px",
                    padding: "30px 0",
                    borderRadius: "20px",
                    boxShadow: "lightgray -1px 1px 10px",
                    margin: "50px 0 0 10px",
                    flexShrink: 0,
                    position: "relative",
                  }}
                >
                  <strong style={{ display: "flex", flexDirection: "row" }}>
                    <button
                      onClick={(e) => handleDeleteColumn(e, kanbanColumn.id)}
                      type="button"
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        borderRadius: "10px",
                        backgroundColor: "red",
                      }}
                    >
                      <Trash2 />
                    </button>
                    <h3>{kanbanColumn.title}</h3>{" "}
                    <h6>({taskCounts[kanbanColumn.id] || 0})</h6>
                  </strong>
                  <KanbanColumnItem
                    kanbanColumn={kanbanColumn}
                    onTasksLoaded={(count) =>
                      handleUpdateCount(kanbanColumn.id, count)
                    }
                    onTaskClick={handleShowTaskModale}
                    fetchBoard={fetchBoard}
                    handleCloseTaskModale={handleCloseTaskModale}
                  />
                  <button
                    type="button"
                    onClick={() => handleShowTaskModale(kanbanColumn)}
                    style={{
                      borderRadius: "20px",
                      color: "black",
                      backgroundColor: "white",
                      border: "1px dashed black",
                      padding: "8px 20px",
                      margin: "10px 0",
                    }}
                  >
                    + Ajouter une tache
                  </button>
                </div>
              ))}

            <div style={{ marginTop: "50px", flexShrink: 0 }}>
              <button
                onClick={handleShowColumnModale}
                type="button"
                style={{
                  width: "400px",
                  padding: "20px",
                  borderRadius: "20px",
                  backgroundColor: "transparent",
                  border: "2px dashed lightgray",
                  fontSize: "18px",
                  cursor: "pointer",
                  color: "gray",
                }}
              >
                + Ajouter une colonne
              </button>
            </div>
          </div>
        </div>
        <Modal show={showTask} onHide={handleCloseTaskModale}>
          <Modal.Header closeButton>
            <Modal.Title>Ajouter une tache</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Titre*</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  placeholder="Entrez le titre içi"
                  required
                  autoFocus
                  value={formDataTask.title}
                  onChange={(e) => handleChangeTask(e)}
                  disabled={state.status === "submitting"}
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  placeholder="Entrez la description içi"
                  autoFocus
                  value={formDataTask.description}
                  onChange={(e) => handleChangeTask(e)}
                  disabled={state.status === "submitting"}
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Deadline</Form.Label>
                <Form.Control
                  type="date"
                  name="deadline"
                  placeholder="Entrez la deadline içi"
                  autoFocus
                  onChange={handleChangeTask}
                  value={formDataTask.deadline}
                  disabled={state.status === "submitting"}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="taskPriority">
                <Form.Label>Priorité</Form.Label>
                <Form.Select
                  name="priority"
                  onChange={handleChangeTask}
                  value={formDataTask.priority}
                  disabled={state.status === "submitting"}
                >
                  <option value="">Sélectionnez une priorité</option>
                  <option value="Strong">Strong (Haute)</option>
                  <option value="Medium">Medium (Moyenne)</option>
                  <option value="Low">Low (Basse)</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3" controlId="taskUser">
                <Form.Label>Assignée à </Form.Label>
                <Form.Select
                  name="user"
                  onChange={(e) => {
                    const selectedUserId = e.target.value;
                    setFormDataTask((prev) => ({
                      ...prev,
                      user: selectedUserId
                        ? ({ id: selectedUserId } as string)
                        : null,
                    }));
                  }}
                  value={formDataTask.user?.id || ""}
                  disabled={state.status === "submitting"}
                >
                  <option value="">Sélectionnez un utilisateur</option>
                  {sortUserForAddUserOfTask(users).map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.username}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            {formDataTask.taskId !== "" && (
              <>
                <Button
                  variant="warning"
                  onClick={(e) => handleUpdateTask(e, formDataTask.taskId)}
                >
                  {state.status === "submitting"
                    ? "Modification..."
                    : "Modifier"}
                </Button>
              </>
            )}
            <Button variant="primary" onClick={(e) => handleCreateTask(e)}>
              {state.status === "submitting" ? "Création..." : "Créer"}
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showColumn} onHide={handleCloseColumnModale}>
          <Modal.Header closeButton>
            <Modal.Title>Ajouter une colonne</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Titre de la colonne</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  placeholder="Entrez le titre içi"
                  required
                  autoFocus
                  onChange={(e) => handleChangeColumn(e)}
                  disabled={state.status === "submitting"}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={(e) => handleCreateColumn(e)}>
              {state.status === "submitting" ? "Création..." : "Créer"}
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    </>
  );
}
