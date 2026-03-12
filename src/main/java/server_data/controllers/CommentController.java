package server_data.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import server_data.dtos.CommentDto;
import server_data.services.CommentService;

@RestController
@RequestMapping("/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping("/tasks/{idTask}")
    public List<CommentDto> getCommentsByTask(@PathVariable String idTask) {
        return this.commentService.getCommentsByTask(idTask);
    }

    @PostMapping("task/{idTask}")
    public CommentDto addComment(@PathVariable String idTask, @RequestBody CommentDto commentDto) {
        return this.commentService.addComment(idTask, commentDto);
    }

    @DeleteMapping("/{idComment}")
    public Boolean deleteComment(@PathVariable String idComment) {
        return this.commentService.deleteComment(idComment);
    }

}
