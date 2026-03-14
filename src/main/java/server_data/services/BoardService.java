package server_data.services;

import java.util.List;

import server_data.dtos.BoardDto;
import server_data.dtos.KanbanColumnDto;
import server_data.dtos.UserDto;

public interface BoardService {

    List<BoardDto> getAllBoard();

    BoardDto getBoardById(String idBoard);

    List<BoardDto> getBoardsByUserId(String idUser);

    BoardDto createBoard(BoardDto boardDto);

    BoardDto updateBoard(String idBoard, BoardDto boardDto);

    Boolean deleteBoard(String idBoard);

    KanbanColumnDto createColumnToBoard(String idBoard, KanbanColumnDto kanbanColumnDto);

    Boolean deleteColumnToBoard(String idBoard, String idKanbanColumn);

    UserDto addUserToBoard(String idBoard, UserDto userDto);

    Boolean delUserToBoard(String idBoard, String idUser);


}
