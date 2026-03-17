package server_data.dtos;

import java.util.List;

import lombok.Data;

/**
 * Data Transfer Object for representing a board.
 */
@Data
public class BoardDto {

    /**
     * The ID of the board.
     */
    private String id;

    /**
     * The title of the board.
     */
    private String title;

    /**
     * The list of kanban columns associated with the board.
     */
    private List<KanbanColumnDto> kanbanColumns;

    /**
     * The list of members associated with the board.
     */
    private List<BoardMemberDto> members;
}
