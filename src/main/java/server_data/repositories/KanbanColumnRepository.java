package server_data.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import server_data.entities.KanbanColumn;

/**
 * Repository interface for managing KanbanColumn entities.
 * Extends JpaRepository to provide CRUD operations and custom query methods.
 */
public interface KanbanColumnRepository extends JpaRepository<KanbanColumn, String> {

    /**
     * Finds all KanbanColumn entities associated with a specific board ID, ordered by their position in ascending order.
     *
     * @param boardId the ID of the board
     * @return a list of KanbanColumn entities associated with the given board ID, ordered by position
     */
    List<KanbanColumn> findByBoard_IdOrderByPositionAsc(String boardId);

    /**
     * Finds a KanbanColumn entity by its title and associated board ID.
     *
     * @param title the title of the Kanban column
     * @param boardId the ID of the board
     * @return the KanbanColumn entity that matches the given title and board ID, or null if not found
     */
    KanbanColumn findByTitleAndBoard_Id(String title, String boardId);

}
