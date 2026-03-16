package server_data.mappers;

import org.springframework.stereotype.Component;
import server_data.dtos.BoardMemberDto;
import server_data.entities.BoardMember;

@Component
public class BoardMemberMapper {

    private final UserMapper userMapper;

    public BoardMemberMapper(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    public BoardMemberDto toDto(BoardMember boardMember) {
        if (boardMember == null) return null;

        BoardMemberDto boardMemberDto = new BoardMemberDto();
        // Utilise le UserMapper pour convertir l'entité User en UserDto
        boardMemberDto.setUserDto(this.userMapper.toDto(boardMember.getUser()));
        boardMemberDto.setRole(boardMember.getRole());
        boardMemberDto.setBoardTitle(boardMember.getBoard().getTitle());
        
        return boardMemberDto;
    }

    public BoardMember toEntity(BoardMemberDto boardMemberDto) {
        if (boardMemberDto == null) return null;

        BoardMember boardMember = new BoardMember();
        boardMember.setUser(this.userMapper.toEntity(boardMemberDto.getUserDto()));
        boardMember.setRole(boardMemberDto.getRole());
        
        return boardMember;
    }
}