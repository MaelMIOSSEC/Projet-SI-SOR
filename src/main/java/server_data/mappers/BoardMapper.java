package server_data.mappers;

import java.util.ArrayList;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import server_data.dtos.BoardDto;
import server_data.dtos.BoardMemberDto;
import server_data.entities.Board;
import server_data.entities.BoardMember;

/**
 * Mapper for converting between Board entities and Board DTOs.
 */
@Component
public class BoardMapper {

    /**
     * Mapper for converting KanbanColumn entities and DTOs.
     */
    private KanbanColumnMapper kanbanColumnMapper;

    /**
     * Mapper for converting User entities and DTOs.
     */
    private UserMapper userMapper;

    /**
     * Constructor for BoardMapper.
     * 
     * @param kanbanColumnMapper Mapper for KanbanColumn entities and DTOs.
     * @param userMapper Mapper for User entities and DTOs.
     */
    public BoardMapper(KanbanColumnMapper kanbanColumnMapper, UserMapper userMapper) {
        this.kanbanColumnMapper = kanbanColumnMapper;
        this.userMapper = userMapper;
    }

    /**
     * Converts a Board entity to a Board DTO.
     * 
     * @param board The Board entity to convert.
     * @return The corresponding Board DTO.
     */
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

    /**
     * Converts a Board DTO to a Board entity.
     * 
     * @param boardDto The Board DTO to convert.
     * @return The corresponding Board entity.
     */
    public Board toEntity(BoardDto boardDto) {
        if (boardDto == null) return null;

        Board board = new Board();
        board.setId(boardDto.getId());
        board.setTitle(boardDto.getTitle());

        board.setKanbanColumns(boardDto.getKanbanColumns() != null 
            ? boardDto.getKanbanColumns().stream().map(this.kanbanColumnMapper::toEntity).collect(Collectors.toList())
            : new ArrayList<>());
        
        board.setMembers(new ArrayList<>());
        return board;
    }

    /**
     * Helper method to convert a BoardMember entity to a BoardMember DTO.
     * 
     * @param boardMember The BoardMember entity to convert.
     * @return The corresponding BoardMember DTO.
     */
    private BoardMemberDto mapToMemberDto(BoardMember boardMember) {
        BoardMemberDto boardMemberDto = new BoardMemberDto();
        boardMemberDto.setUserDto(this.userMapper.toDto(boardMember.getUser()));
        boardMemberDto.setRole(boardMember.getRole());
        return boardMemberDto;
    }
}
