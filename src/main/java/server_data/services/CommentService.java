package server_data.services;

import java.util.List;

import server_data.dtos.CommentDto;

public interface CommentService {

    List<CommentDto> getCommentsByTask(String idTask);

    CommentDto addComment(String idTask, CommentDto commentDto);

    Boolean deleteComment(String idComment);
}
