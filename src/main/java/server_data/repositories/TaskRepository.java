package server_data.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import server_data.entities.Task;
import java.util.List;


public interface TaskRepository extends JpaRepository<Task, String> {

    List<Task> findByKanbanColumn_Id(String kanbanColumnId);

    List<Task> findByTitle(String title);

    List<Task> findByUser_Id(String userId);

    List<Task> findByKanbanColumn_Board_Id(String boardId);
}
