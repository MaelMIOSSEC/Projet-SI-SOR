package server_data.mappers;

import server_data.dtos.CommentDto;
import server_data.entities.Comment;

public class CommentMapper {

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
