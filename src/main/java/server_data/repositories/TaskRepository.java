package server_data.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import server_data.entities.Task;
import java.util.List;

/**
 * Repository interface for managing Task entities.
 * Extends JpaRepository to provide CRUD operations and custom query methods.
 */
public interface TaskRepository extends JpaRepository<Task, String> {

    /**
     * Finds all Task entities associated with a specific Kanban column ID.
     *
     * @param kanbanColumnId the ID of the Kanban column
     * @return a list of Task entities associated with the given Kanban column ID
     */
    List<Task> findByKanbanColumn_Id(String kanbanColumnId);

    /**
     * Finds all Task entities with a specific title.
     *
     * @param title the title of the tasks to find
     * @return a list of Task entities with the given title
     */
    List<Task> findByTitle(String title);

    /**
     * Finds all Task entities associated with a specific user ID.
     *
     * @param userId the ID of the user
     * @return a list of Task entities associated with the given user ID
     */
    List<Task> findByUser_Id(String userId);

    /**
     * Finds all Task entities associated with a specific board ID through their Kanban column.
     *
     * @param boardId the ID of the board
     * @return a list of Task entities associated with the given board ID
     */
    List<Task> findByKanbanColumn_Board_Id(String boardId);
}
