package server_data.services;

import java.util.List;

import server_data.dtos.KanbanColumnDto;
import server_data.dtos.TaskDto;

/**
 * Service interface for managing KanbanColumn entities and related operations.
 * Defines methods for retrieving, creating, updating, and deleting Kanban columns, as well as managing tasks within columns.
 */
public interface KanbanColumnService {

    /**
     * Retrieves a KanbanColumn entity by its ID.
     *
     * @param idColumn the ID of the Kanban column to find
     * @return the KanbanColumnDto object representing the found Kanban column, or null if not found
     */
    KanbanColumnDto getColumnById(String idColumn);

    /**
     * Updates an existing KanbanColumn entity identified by its ID with new details.
     *
     * @param idColumn the ID of the Kanban column to update
     * @param kanbanColumnDto the KanbanColumnDto object containing the updated details of the Kanban column
     * @return the KanbanColumnDto object representing the updated Kanban column, or null if the Kanban column was not found
     */
    KanbanColumnDto updateColumn(String idColumn, KanbanColumnDto kanbanColumnDto);

    /**
     * Retrieves a list of Task entities associated with a specific Kanban column ID.
     *
     * @param idColumn the ID of the Kanban column
     * @return a list of TaskDto objects representing tasks associated with the given Kanban column ID
     */
    List<TaskDto> getTasksByColumn(String idColumn);

    /**
     * Creates a new Kanban column.
     *
     * @param kanbanColumnDto the KanbanColumnDto object containing the details of the Kanban column to create
     * @return the KanbanColumnDto object representing the created Kanban column
     */
    KanbanColumnDto createColumn(KanbanColumnDto kanbanColumnDto);
}
