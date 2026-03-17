package server_data.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

/**
 * Data Transfer Object for representing a kanban column.
 */
@Data
public class KanbanColumnDto {

    /**
     * The ID of the kanban column.
     */
    private String id;

    /**
     * The title of the kanban column.
     */
    private String title;

    /**
     * The position of the kanban column.
     */
    private int position;

    /**
     * The ID of the board to which the kanban column belongs.
     */
    @JsonProperty("idBoard") 
    private String idBoard;
}
