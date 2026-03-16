package server_data.mappers;

import java.util.ArrayList;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import server_data.dtos.BoardDto;
import server_data.dtos.BoardMemberDto;
import server_data.entities.Board;
import server_data.entities.BoardMember;

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
        
        boardDto.setKanbanColumns(board.getKanbanColumns() != null 
            ? board.getKanbanColumns().stream().map(this.kanbanColumnMapper::toDto).collect(Collectors.toList())
            : new ArrayList<>());

        boardDto.setMembers(board.getMembers() != null 
            ? board.getMembers().stream().map(this::mapToMemberDto).collect(Collectors.toList())
            : new ArrayList<>());

        return boardDto;
    }

    public Board toEntity(BoardDto boardDto) {
        if (boardDto == null) return null;

        Board board = new Board();
        board.setId(boardDto.getId());
        board.setTitle(boardDto.getTitle());

        board.setKanbanColumns(boardDto.getKanbanColumns() != null 
            ? boardDto.getKanbanColumns().stream().map(this.kanbanColumnMapper::toEntity).collect(Collectors.toList())
            : new ArrayList<>());
        
        // if (boardDto.getMembers() != null) {
        //     board.setMembers(boardDto.getMembers().stream().map(userDto -> {
        //         BoardMember boardMember = new BoardMember();
        //         boardMember.setUser(this.userMapper.toEntity(userDto));
        //         boardMember.setBoard(board);
        //         boardMember.setRole(Role.Invited);
        //         return boardMember;

        //     }).collect(Collectors.toList()));
        // } else {
        //     board.setMembers(new ArrayList<>());
        // }
        board.setMembers(new ArrayList<>());
        return board;
    }

    private BoardMemberDto mapToMemberDto(BoardMember boardMember) {
        BoardMemberDto boardMemberDto = new BoardMemberDto();
        boardMemberDto.setUserDto(this.userMapper.toDto(boardMember.getUser()));
        boardMemberDto.setRole(boardMember.getRole());
        return boardMemberDto;
    }
}
