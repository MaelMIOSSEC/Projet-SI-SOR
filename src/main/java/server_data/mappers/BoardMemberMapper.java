package server_data.mappers;

import org.springframework.stereotype.Component;
import server_data.dtos.BoardMemberDto;
import server_data.entities.BoardMember;

/**
 * Mapper for converting between BoardMember entities and BoardMember DTOs.
 */
@Component
public class BoardMemberMapper {

    /**
     * Mapper for converting User entities and DTOs.
     */
    private final UserMapper userMapper;

    /**
     * Constructor for BoardMemberMapper.
     * 
     * @param userMapper Mapper for User entities and DTOs.
     */
    public BoardMemberMapper(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    /**
     * Converts a BoardMember entity to a BoardMember DTO.
     * 
     * @param boardMember The BoardMember entity to convert.
     * @return The corresponding BoardMember DTO.
     */
    public BoardMemberDto toDto(BoardMember boardMember) {
        if (boardMember == null) return null;

        BoardMemberDto boardMemberDto = new BoardMemberDto();
        // Utilise le UserMapper pour convertir l'entité User en UserDto
        boardMemberDto.setUserDto(this.userMapper.toDto(boardMember.getUser()));
        boardMemberDto.setRole(boardMember.getRole());
        boardMemberDto.setBoardTitle(boardMember.getBoard().getTitle());
        boardMemberDto.setBoardId(boardMember.getBoard().getId());
        
        return boardMemberDto;
    }

    /**
     * Converts a BoardMember DTO to a BoardMember entity.
     * 
     * @param boardMemberDto The BoardMember DTO to convert.
     * @return The corresponding BoardMember entity.
     */
    public BoardMember toEntity(BoardMemberDto boardMemberDto) {
        if (boardMemberDto == null) return null;

        BoardMember boardMember = new BoardMember();
        boardMember.setUser(this.userMapper.toEntity(boardMemberDto.getUserDto()));
        boardMember.setRole(boardMemberDto.getRole());
        
        return boardMember;
    }
}