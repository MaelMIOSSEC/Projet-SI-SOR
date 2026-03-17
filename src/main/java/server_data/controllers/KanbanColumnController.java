package server_data.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import server_data.dtos.KanbanColumnDto;
import server_data.dtos.TaskDto;
import server_data.services.KanbanColumnService;

/**
 * Controller for handling requests related to Kanban columns.
 */
@RestController
@RequestMapping("/columns")
public class KanbanColumnController {

    /** Service for managing Kanban columns. */
    private final KanbanColumnService kanbanColumnService;

    /**
     * Constructor for initializing the Kanban column service.
     * @param kanbanColumnService the Kanban column service to use
     */
    public KanbanColumnController(KanbanColumnService kanbanColumnService) {
        this.kanbanColumnService = kanbanColumnService;
    }

    /**
     * Retrieves a Kanban column by its ID.
     * @param idColumn the ID of the column to retrieve
     * @return the Kanban column DTO
     */
    @GetMapping("/{idColumn}")
    public KanbanColumnDto getColumnById(@PathVariable String idColumn) {
        return this.kanbanColumnService.getColumnById(idColumn);
    }

    /**
     * Updates a Kanban column with the provided data.
     * @param idColumn the ID of the column to update
     * @param kanbanColumnDto the DTO containing the updated column data
     * @return the updated Kanban column DTO
     */
    @PutMapping("/{idColumn}")
    public KanbanColumnDto updateColumn(@PathVariable String idColumn, @RequestBody KanbanColumnDto kanbanColumnDto) {
        return this.kanbanColumnService.updateColumn(idColumn, kanbanColumnDto);
    }

    /**
     * Retrieves the list of tasks associated with a specific Kanban column.
     * @param idColumn the ID of the column for which to retrieve tasks
     * @return a list of task DTOs associated with the specified column
     */
    @GetMapping("/{idColumn}/tasks")
    public List<TaskDto> getTasksByColumn(@PathVariable String idColumn) {
        return this.kanbanColumnService.getTasksByColumn(idColumn);
    }

    /**
     * Creates a new Kanban column with the provided data.
     * @param kanbanColumnDto the DTO containing the data for the new column
     * @return the created Kanban column DTO
     */
    @PostMapping
    public KanbanColumnDto createColumn(KanbanColumnDto kanbanColumnDto) {
        return this.kanbanColumnService.createColumn(kanbanColumnDto);
    }
    

}
