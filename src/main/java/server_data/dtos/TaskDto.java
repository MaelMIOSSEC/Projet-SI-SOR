package server_data.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Min;
import lombok.Data;

import java.sql.Date;
import java.util.List;

/**
 * 
 */
@Data
public class TaskDto {

    private String id;

    @NotBlank(message = "The title is required.")
    private String title;

    private String descritpion;

    private Date deadline;

    private Priority priority;

    @NotBlank(message = "The User Id is required.")
    private String userId;

    @NotBlank(message = "The column of kanban is required.")
    private String kanbanColumnId;

    private int position;
}
