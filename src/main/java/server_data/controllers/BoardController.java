package server_data.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import server_data.dtos.BoardDto;
import server_data.dtos.KanbanColumnDto;
import server_data.dtos.UserDto;
import server_data.services.BoardService;

/**
 * Controller for managing boards, including CRUD operations and user/column management.
 * Provides endpoints for retrieving, creating, updating, and deleting boards, as well as managing columns and users associated with boards.
 */
@RestController
public class BoardController {
    
    /** The service responsible for handling board-related operations. */
    private final BoardService boardService;

    /**
     * Constructor for initializing the board service.
     * @param boardService the board service to use
     */
    public BoardController(BoardService boardService) {
        this.boardService = boardService;
    }

    /**
     * Retrieves all boards.
     * @return a list of all board DTOs
     */
    @GetMapping("/boards")
    public List<BoardDto> getAllBoard() {
        return this.boardService.getAllBoard();
    }

    /**
     * Retrieves a board by its ID.
     * @param idBoard the ID of the board to retrieve
     * @return the board DTO corresponding to the specified ID
     */
    @GetMapping("/boards/{idBoard}")
    public BoardDto getBoardById(@PathVariable String idBoard) {
        return this.boardService.getBoardById(idBoard);
    }

    /**
     * Retrieves all boards associated with a specific user.
     * @param idUser the ID of the user whose boards to retrieve
     * @return a list of board DTOs associated with the specified user
     */
    @GetMapping("/users/{idUser}/boards")
    public List<BoardDto> getBoardsByUser(@PathVariable String idUser) {
        return this.boardService.getBoardsByUserId(idUser);
    }

    /**
     * Creates a new board for a specific user.
     * @param idUser the ID of the user for whom to create the board
     * @param boardDto the DTO containing the details of the board to create
     * @return the created board DTO
     */
    @PostMapping("/users/{idUser}/boards")
    public BoardDto createBoard(@PathVariable String idUser, final @RequestBody BoardDto boardDto) {
        return this.boardService.createBoard(idUser, boardDto);
    }

    /**
     * Updates an existing board.
     * @param idBoard the ID of the board to update
     * @param boardDto the DTO containing the updated details of the board
     * @return the updated board DTO
     */
    @PutMapping("/boards/{idBoard}")
    public BoardDto updateBoard(@PathVariable String idBoard, @RequestBody BoardDto boardDto) {
        return this.boardService.updateBoard(idBoard, boardDto);
    }

    /**
     * Deletes a board by its ID.
     * @param idBoard the ID of the board to delete
     * @return true if the board was successfully deleted, false otherwise
     */
    @DeleteMapping("/boards/{idBoard}")
    public Boolean deleteBoard(@PathVariable String idBoard) {
        return this.boardService.deleteBoard(idBoard);
    }

    /**
     * Creates a new column in a specific board.
     * @param idBoard the ID of the board to which the column will be added
     * @param columnDto the DTO containing the details of the column to create
     * @return the created column DTO
     */
    @PostMapping("/boards/{idBoard}/columns")
    public KanbanColumnDto createColumnToBoard(@PathVariable String idBoard, @RequestBody KanbanColumnDto columnDto) {
        return this.boardService.createColumnToBoard(idBoard, columnDto);
    }

    /**
     * Deletes a column from a specific board.
     * @param idBoard the ID of the board from which the column will be deleted
     * @param idColumn the ID of the column to delete
     * @return true if the column was successfully deleted, false otherwise
     */
    @DeleteMapping("/boards/{idBoard}/columns/{idColumn}")
    public Boolean deleteColumnToBoard(@PathVariable String idBoard, @PathVariable String idColumn) {
        return this.boardService.deleteColumnToBoard(idBoard, idColumn);
    }

    /**
     * Adds a user to a specific board.
     * @param idBoard the ID of the board to which the user will be added
     * @param userDto the DTO containing the details of the user to add
     * @return the added user DTO
     */
    @PostMapping("/boards/{idBoard}/users")
    public UserDto addUserToBoard(@PathVariable String idBoard, @RequestBody UserDto userDto) {
        return this.boardService.addUserToBoard(idBoard, userDto);
    }

    /**
     * Removes a user from a specific board.
     * @param idBoard the ID of the board from which the user will be removed
     * @param idUser the ID of the user to remove
     * @return true if the user was successfully removed, false otherwise
     */
    @DeleteMapping("/boards/{idBoard}/users/{idUser}")
    public Boolean delUserToBoard(@PathVariable String idBoard, @PathVariable String idUser) {
        return this.boardService.delUserToBoard(idBoard, idUser);
    }

}
