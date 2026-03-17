package server_data.services;

import java.util.List;

import server_data.dtos.CommentDto;

/**
 * Service interface for managing Comment entities and related operations.
 * Defines methods for retrieving, creating, and deleting comments associated with tasks.
 */
public interface CommentService {

    /**
     * Retrieves a list of Comment entities associated with a specific task ID.
     *
     * @param idTask the ID of the task
     * @return a list of CommentDto objects representing comments associated with the given task ID
     */
    List<CommentDto> getCommentsByTask(String idTask);

    /**
     * Creates a new Comment entity and associates it with a specific task ID.
     *
     * @param idTask the ID of the task to associate with the new comment
     * @param commentDto the CommentDto object containing the details of the comment to create
     * @return the CommentDto object representing the created comment
     */
    CommentDto addComment(String idTask, CommentDto commentDto);

    /**
     * Deletes a Comment entity identified by its ID.
     *
     * @param idComment the ID of the comment to delete
     * @return true if the comment was successfully deleted, false otherwise
     */
    Boolean deleteComment(String idComment);
}
