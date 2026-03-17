import { Button, Form, Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import { API_URL } from "../config/api.ts";
import { useAuth } from "../hooks/useAuth.ts";
import type { Board } from "../types/boardType.ts";
import { useParams } from "react-router/internal/react-server-client";
import type { KanbanColumn } from "../types/kanbanColumnType.ts";
import type { Task } from "../types/taskType.ts";
import type { User } from "../types/userType.ts";

type BoardState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "error"; error: string };

const KanbanColumnItem = ({
  kanbanColumn,
  onTasksLoaded,
}: {
  kanbanColumn: KanbanColumn;
  onTasksLoaded: (count: number) => void;
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = async () => {
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
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTasks(data);
        onTasksLoaded(data.length);
      }
    } catch (err) {
      console.error(
        "Échec de la récupération des informations utilisateurs: ",
        err
      );
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <>
      {tasks.map((task: Task) => (
        <p
          style={{
            width: "300px",
            padding: "10px",
            borderRadius: "20px",
            margin: "20px",
            boxShadow: "gray -1px 1px 3px",
          }}
        >
          {task.title}
        </p>
      ))}
    </>
  );
};

export default function BoardDetails() {
  interface TaskFormData {
    title: string;
    description: string;
    deadline: string;
    priority: string;
    user: User | null;
    kanbanColumn: KanbanColumn | null;
  }

  interface ColumnFormData {
    title: string;
    position: string;
    idBoard: string;
  }

  const { user } = useAuth();
  const { boardId } = useParams();

  const [showTask, setShowTask] = useState(false);
  const [showColumn, setShowColumn] = useState(false);
  const [board, setBoard] = useState<Board>();
  const [taskCounts, setTaskCounts] = useState<Record<string, number>>({});
  const [state, setState] = useState<BoardState>({ status: "idle" });
  const [formDataTask, setFormDataTask] = useState<TaskFormData>({
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
  const handleShowTaskModale = (kanbanColumn: KanbanColumn) => {
    setFormDataTask((prev) => ({
      ...prev,
      kanbanColumn: kanbanColumn,
    }));
    setShowTask(true);
  };

  const handleCloseColumnModale = () => setShowColumn(false);
  const handleShowColumnModale = () => { setShowColumn(true) };

  const handleUpdateCount = (columnId: string, count: number) => {
    setTaskCounts((prev) => ({ ...prev, [columnId]: count }));
  };

  const handleChangeTask = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormDataTask((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleChangeColumn = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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
      user: { id: user?.userId },
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
        alert("Erreur lors de la création du tableau.");
        setState({
          status: "error",
          error: `Update failed (${response.status})`,
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
      idBoard: boardId
    };

    console.log("data => ", data)

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
        alert("Erreur lors de la création du tableau.");
        setState({
          status: "error",
          error: `Update failed (${response.status})`,
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

  const fetchBoard = async () => {
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
        err
      );
    }
  };

  useEffect(() => {
    fetchBoard();
  }, []);

  const nextColumnPosition = board?.kanbanColumns 
  ? Math.max(0, ...board.kanbanColumns.map(col => col.position)) + 1 
  : 1;

  return (
    <>
      <div
        style={{
          marginTop: "100px",
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <h3>{board?.title}</h3>
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
                }}
              >
                <strong style={{ display: "flex", flexDirection: "row" }}>
                  <h3>{kanbanColumn.title}</h3>{" "}
                  <h6>({taskCounts[kanbanColumn.id] || 0})</h6>
                </strong>
                <KanbanColumnItem
                  kanbanColumn={kanbanColumn}
                  onTasksLoaded={(count) =>
                    handleUpdateCount(kanbanColumn.id, count)
                  }
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
          <Modal.Title>Ajouter un tableau</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Titre de la tache</Form.Label>
              <Form.Control
                type="text"
                name="title"
                placeholder="Entrez le titre içi"
                required
                autoFocus
                onChange={(e) => handleChangeTask(e)}
                disabled={state.status === "submitting"}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Description de la tache</Form.Label>
              <Form.Control
                type="text"
                name="description"
                placeholder="Entrez la description içi"
                autoFocus
                onChange={(e) => handleChangeTask(e)}
                disabled={state.status === "submitting"}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Deadline de la tache</Form.Label>
              <Form.Control
                type="date"
                name="deadline"
                placeholder="Entrez la deadline içi"
                autoFocus
                onChange={handleChangeTask}
                disabled={state.status === "submitting"}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="taskPriority">
              <Form.Label>Priorité de la tache</Form.Label>
              <Form.Select
                name="priority"
                onChange={handleChangeTask}
                disabled={state.status === "submitting"}
              >
                <option value="">Sélectionnez une priorité</option>
                <option value="Strong">Strong (Haute)</option>
                <option value="Medium">Medium (Moyenne)</option>
                <option value="Low">Low (Basse)</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseTaskModale}>
            Close
          </Button>
          <Button variant="primary" onClick={(e) => handleCreateTask(e)}>
            {state.status === "submitting"
              ? "Création de la tache..."
              : "Créer une tache"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showColumn} onHide={handleCloseColumnModale}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter une colonne</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
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
          <Button variant="secondary" onClick={handleCloseColumnModale}>
            Close
          </Button>
          <Button variant="primary" onClick={(e) => handleCreateColumn(e)}>
            {state.status === "submitting"
              ? "Création de la colonne..."
              : "Créer une colonne"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
