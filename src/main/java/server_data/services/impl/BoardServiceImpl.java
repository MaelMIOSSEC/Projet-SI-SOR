package server_data.services.impl;

import java.util.List;

import server_data.dtos.BoardDto;
import server_data.dtos.KanbanColumnDto;
import server_data.dtos.UserDto;
import server_data.services.BoardService;

public class BoardServiceImpl implements BoardService{

    @Override
    public List<BoardDto> getAllBoard() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getAllBoard'");
    }

    @Override
    public BoardDto getBoardById(String idBoard) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getBoardById'");
    }

    @Override
    public BoardDto createBoard(BoardDto boardDto) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'createBoard'");
    }

    @Override
    public BoardDto updateBoard(String idBoard, BoardDto boardDto) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'updateBoard'");
    }

    @Override
    public Boolean deleteBoard(String idBoard) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'deleteBoard'");
    }

    @Override
    public KanbanColumnDto createColumnToBoard(String idBoard, KanbanColumnDto kanbanColumnDto) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'createColumnToBoard'");
    }

    @Override
    public Boolean deleteColumnToBoard(String idBoard, String idKanbanColumn) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'deleteColumnToBoard'");
    }

    @Override
    public UserDto addUserToBoard(String idBoard, UserDto userDto) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'addUserToBoard'");
    }

    @Override
    public Boolean delUserToBoard(String idBoard, String idUser) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'delUserToBoard'");
    }

}
