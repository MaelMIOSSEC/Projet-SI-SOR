package server_data.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import server_data.entities.Comment;
import server_data.entities.Priority;

import java.time.LocalDate;
import java.util.List;

/**
 * Data Transfer Object for representing a task.
 */
@Data
public class TaskDto {

    /**
     * The ID of the task.
     */
    private String id;

    /**
     * The title of the task.
     */
    @NotBlank(message = "The title is required.")
    private String title;

    /**
     * The description of the task.
     */
    private String description;

    /**
     * The deadline of the task.
     */
    private LocalDate deadline;

    /**
     * The priority of the task.
     */
    private Priority priority;

    /**
     * The user assigned to the task.
     */
    @NotNull(message = "The User Id is required.")
    private UserDto user;

    /**
     * The kanban column to which the task belongs.
     */
    @NotNull(message = "The column of kanban is required.")
    private KanbanColumnDto kanbanColumn;

    /**
     * The position of the task within the kanban column.
     */
    private int position;

    /**
     * The list of comments associated with the task.
     */
    private List<Comment> comments;
}
