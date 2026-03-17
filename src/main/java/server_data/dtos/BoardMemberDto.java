package server_data.dtos;

import server_data.entities.Role;

import lombok.Data;

/**
 * Data Transfer Object for representing a member of a board.
 */
@Data
public class BoardMemberDto {

    /**
     * The user associated with the board member.
     */
    private UserDto userDto;

    /**
     * The role of the user within the board.
     */
    private Role role;

    /**
     * The title of the board.
     */
    private String boardTitle;
    
    /**
     * The ID of the board.
     */
    private String boardId;
}
