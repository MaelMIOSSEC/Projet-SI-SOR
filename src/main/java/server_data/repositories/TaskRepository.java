package server_data.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import server_data.entities.Task;
import java.util.List;


public interface TaskRepository extends JpaRepository<Task, String> {

    List<Task> findByKanbanColumnId(String kanbanColumnId);

    List<Task> findByTitle(String title);

    List<Task> findByUserId(String userId);

    List<Task> findByBoardId(String boardId);
}
