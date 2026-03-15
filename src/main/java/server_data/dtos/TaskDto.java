package server_data.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import server_data.entities.Comment;
import server_data.entities.Priority;

import java.time.LocalDate;
import java.util.List;

/**
 * 
 */
@Data
public class TaskDto {

    private String id;

    @NotBlank(message = "The title is required.")
    private String title;

    private String description;

    private LocalDate deadline;

    private Priority priority;

    @NotBlank(message = "The User Id is required.")
    private UserDto user;
    //private String userId;

    @NotBlank(message = "The column of kanban is required.")
    private KanbanColumnDto kanbanColumn; 
    //private String kanbanColumnId;

    private int position;

    private List<Comment> comments;
}
