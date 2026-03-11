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

@RestController
public class BoardController {
    
    private final BoardService boardService;

    public BoardController(BoardService boardService) {
        this.boardService = boardService;
    }

    @GetMapping("/boards")
    public List<BoardDto> getAllBoard() {
        return this.boardService.getAllBoard();
    }

    @GetMapping("/boards/{idBoard}")
    public BoardDto getBoardById(@PathVariable String idBoard) {
        return this.boardService.getBoardById(idBoard);
    }

    @PostMapping("/boards")
    public BoardDto createBoard(final @RequestBody BoardDto boardDto) {
        return this.boardService.createBoard(boardDto);
    }

    @PutMapping("/boards/{idBoard}")
    public BoardDto updateBoard(@PathVariable String idBoard, @RequestBody BoardDto boardDto) {
        return this.boardService.updateBoard(idBoard, boardDto);
    }

    @DeleteMapping("/boards/{idBoard}")
    public Boolean deleteBoard(@PathVariable String idBoard) {
        return this.boardService.deleteBoard(idBoard);
    }

    @PostMapping("/boards/{idBoard}/columns")
    public KanbanColumnDto createColumnToBoard(@PathVariable String idBoard, @RequestBody KanbanColumnDto columnDto) {
        return this.boardService.createColumnToBoard(idBoard, columnDto);
    }

    @DeleteMapping("/boards/{idBoard}/columns/{idColumn}")
    public Boolean deleteColumnToBoard(@PathVariable String idBoard, @PathVariable String idColumn) {
        return this.boardService.deleteColumnToBoard(idBoard, idColumn);
    }

    @PostMapping("/boards/{idBoard}/users")
    public UserDto addUserToBoard(@PathVariable String idBoard, @RequestBody UserDto userDto) {
        return this.boardService.addUserToBoard(idBoard, userDto);
    }

    @DeleteMapping("/boards/{idBoard}/users/{idUser}")
    public Boolean delUserToBoard(@PathVariable String idBoard, @PathVariable String idUser) {
        return this.boardService.delUserToBoard(idBoard, idUser);
    }


}
