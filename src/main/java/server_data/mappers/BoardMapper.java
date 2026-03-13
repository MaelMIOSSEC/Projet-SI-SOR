package server_data.mappers;

import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import server_data.dtos.BoardDto;
import server_data.entities.Board;
import server_data.entities.BoardMember;
import server_data.entities.Role;

@Component
public class BoardMapper {

    private KanbanColumnMapper kanbanColumnMapper;
    private UserMapper userMapper;

    public BoardMapper(KanbanColumnMapper kanbanColumnMapper, UserMapper userMapper) {
        this.kanbanColumnMapper = kanbanColumnMapper;
        this.userMapper = userMapper;
    }

    public BoardDto toDto(Board board) {
        if (board == null) return null;

        BoardDto boardDto = new BoardDto();
        boardDto.setId(board.getId());
        boardDto.setTitle(board.getTitle());
        
        if (board.getKanbanColumns() != null) {
            boardDto.setKanbanColumns(board.getKanbanColumns().stream().map(this.kanbanColumnMapper::toDto).collect(Collectors.toList()));
        }

        if (board.getMembers() != null) {
            boardDto.setMembers(board.getMembers().stream().map(membership -> this.userMapper.toDto(membership.getUser())).collect(Collectors.toList()));
        }

        return boardDto;
    }

    public Board toEntity(BoardDto boardDto) {
        if (boardDto == null) return null;

        Board board = new Board();
        board.setId(boardDto.getId());
        board.setTitle(boardDto.getTitle());

        if (boardDto.getKanbanColumns() != null) {
            board.setKanbanColumns(boardDto.getKanbanColumns().stream().map(this.kanbanColumnMapper::toEntity).collect(Collectors.toList()));
        }
        
        if (boardDto.getMembers() != null) {
            board.setMembers(boardDto.getMembers().stream().map(userDto -> {
                BoardMember boardMember = new BoardMember();
                boardMember.setUser(this.userMapper.toEntity(userDto));
                boardMember.setBoard(board);
                boardMember.setRole(Role.Invited);
                return boardMember;

            }).collect(Collectors.toList()));
        } 
        return board;
    }
}
