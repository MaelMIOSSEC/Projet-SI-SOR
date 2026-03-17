package server_data.services;

import java.util.List;

import server_data.dtos.BoardDto;
import server_data.dtos.KanbanColumnDto;
import server_data.dtos.UserDto;

/**
 * Service interface for managing Board entities and related operations.
 * Defines methods for retrieving, creating, updating, and deleting boards, as well as managing board columns and members.
 */
public interface BoardService {

    /**
     * Retrieves a list of all Board entities.
     *
     * @return a list of BoardDto objects representing all boards
     */
    List<BoardDto> getAllBoard();

    /**
     * Retrieves a Board entity by its ID.
     *
     * @param idBoard the ID of the board to find
     * @return the BoardDto object representing the found board, or null if not found
     */
    BoardDto getBoardById(String idBoard);

    /**
     * Retrieves a list of Board entities associated with a specific user ID.
     *
     * @param idUser the ID of the user
     * @return a list of BoardDto objects representing boards associated with the given user ID
     */
    List<BoardDto> getBoardsByUserId(String idUser);

    /**
     * Creates a new Board entity and associates it with a specific user ID.
     *
     * @param idUser the ID of the user to associate with the new board
     * @param boardDto the BoardDto object containing the details of the board to create
     * @return the BoardDto object representing the created board
     */
    BoardDto createBoard(String idUser, BoardDto boardDto);

    /**
     * Updates an existing Board entity identified by its ID with new details.
     *
     * @param idBoard the ID of the board to update
     * @param boardDto the BoardDto object containing the updated details of the board
     * @return the BoardDto object representing the updated board, or null if the board was not found
     */
    BoardDto updateBoard(String idBoard, BoardDto boardDto);

    /**
     * Deletes a Board entity identified by its ID.
     *
     * @param idBoard the ID of the board to delete
     * @return true if the board was successfully deleted, false otherwise
     */
    Boolean deleteBoard(String idBoard);

    /**
     * Creates a new Kanban column and associates it with a specific board ID.
     *
     * @param idBoard the ID of the board to associate with the new Kanban column
     * @param kanbanColumnDto the KanbanColumnDto object containing the details of the Kanban column to create
     * @return the KanbanColumnDto object representing the created Kanban column
     */
    KanbanColumnDto createColumnToBoard(String idBoard, KanbanColumnDto kanbanColumnDto);

    /**
     * Deletes a Kanban column identified by its ID from a specific board.
     *
     * @param idBoard the ID of the board from which to delete the Kanban column
     * @param idKanbanColumn the ID of the Kanban column to delete
     * @return true if the Kanban column was successfully deleted, false otherwise
     */
    Boolean deleteColumnToBoard(String idBoard, String idKanbanColumn);

    /**
     * Adds a user to a board identified by its ID.
     *
     * @param idBoard the ID of the board to which to add the user
     * @param userDto the UserDto object containing the details of the user to add
     * @return the UserDto object representing the added user, or null if the board or user was not found
     */
    UserDto addUserToBoard(String idBoard, UserDto userDto);

    /**
     * Removes a user identified by their ID from a board identified by its ID.
     *
     * @param idBoard the ID of the board from which to remove the user
     * @param idUser the ID of the user to remove
     * @return true if the user was successfully removed from the board, false otherwise
     */
    Boolean delUserToBoard(String idBoard, String idUser);


}
