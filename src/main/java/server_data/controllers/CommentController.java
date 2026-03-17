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

/**
 * Controller for managing comments, including retrieving comments for a task, adding new comments, and deleting comments.
 * Provides endpoints for handling comment-related operations in the application.
 */
@RestController
@RequestMapping("/comments")
public class CommentController {

    /** The service responsible for handling comment-related operations. */
    private final CommentService commentService;

    /**
     * Constructor for initializing the comment service.
     * @param commentService the comment service to use
     */
    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    /**
     * Retrieves all comments associated with a specific task.
     * @param idTask the ID of the task whose comments to retrieve
     * @return a list of comment DTOs associated with the specified task
     */
    @GetMapping("/tasks/{idTask}")
    public List<CommentDto> getCommentsByTask(@PathVariable String idTask) {
        return this.commentService.getCommentsByTask(idTask);
    }

    /**
     * Adds a new comment to a specific task.
     * @param idTask the ID of the task to which the comment will be added
     * @param commentDto the DTO containing the details of the comment to add
     * @return the created comment DTO
     */
    @PostMapping("/task/{idTask}")
    public CommentDto addComment(@PathVariable String idTask, @RequestBody CommentDto commentDto) {
        return this.commentService.addComment(idTask, commentDto);
    }

    /**
     * Deletes a comment by its ID.
     * @param idComment the ID of the comment to delete
     * @return true if the comment was successfully deleted, false otherwise
     */
    @DeleteMapping("/{idComment}")
    public Boolean deleteComment(@PathVariable String idComment) {
        return this.commentService.deleteComment(idComment);
    }

}
