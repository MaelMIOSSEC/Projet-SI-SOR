package server_data.services.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import server_data.dtos.CommentDto;
import server_data.mappers.CommentMapper;
import server_data.repositories.CommentRepository;
import server_data.services.CommentService;

@Service("CommentService")
public class CommentServiceImpl implements CommentService{

    private CommentRepository commentRepository;
    private CommentMapper commentMapper;

    public CommentServiceImpl(CommentRepository commentRepository, CommentMapper commentMapper) {
        this.commentRepository = commentRepository;
        this.commentMapper = commentMapper;
    }

    @Override
    public List<CommentDto> getCommentsByTask(String idTask) {
        return this.commentRepository.findByTaskId(idTask).stream().map(this.commentMapper::toDto).toList();
    }

    @Override
    public CommentDto addComment(String idTask, CommentDto commentDto) {
        var comment = this.commentMapper.toEntity(commentDto);
        comment.setTaskId(idTask);
        return this.commentMapper.toDto(this.commentRepository.save(comment));
    }

    @Override
    public Boolean deleteComment(String idComment) {
        if (this.commentRepository.existsById(idComment)) {
            this.commentRepository.deleteById(idComment);
            return true;
        } else {
            return false;
        }
    }

}
