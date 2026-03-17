package server_data.mappers;

import org.springframework.stereotype.Component;

import server_data.dtos.CommentDto;
import server_data.entities.Comment;

/**
 * Mapper for converting between Comment entities and Comment DTOs.
 */
@Component
public class CommentMapper {

    /**
     * Converts a Comment entity to a Comment DTO.
     * 
     * @param comment The Comment entity to convert.
     * @return The corresponding Comment DTO.
     */
    public CommentDto toDto(Comment comment) {
        if (comment == null) return null;

        CommentDto commentDto = new CommentDto();
        commentDto.setId(comment.getId());
        commentDto.setTaskId(comment.getTaskId());
        commentDto.setAuthorId(comment.getAuthorId());
        commentDto.setContent(comment.getContent());
        commentDto.setCreatedAt(comment.getCreatedAt());
        commentDto.setAttachmentUrl(comment.getAttachmentUrl());
        return commentDto;
    }

    /**
     * Converts a Comment DTO to a Comment entity.
     * 
     * @param commentDto The Comment DTO to convert.
     * @return The corresponding Comment entity.
     */
    public Comment toEntity(CommentDto commentDto) {
        if (commentDto == null) return null;

        Comment comment = new Comment();
        comment.setId(commentDto.getId());
        comment.setTaskId(commentDto.getTaskId());
        comment.setAuthorId(commentDto.getAuthorId());
        comment.setContent(commentDto.getContent());
        comment.setCreatedAt(commentDto.getCreatedAt());
        comment.setAttachmentUrl(commentDto.getAttachmentUrl());
        return comment;
    }
}
