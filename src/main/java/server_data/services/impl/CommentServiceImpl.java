package server_data.services.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import server_data.dtos.CommentDto;
import server_data.mappers.CommentMapper;
import server_data.repositories.CommentRepository;
import server_data.services.CommentService;

/**
 * The CommentServiceImpl class provides the implementation of the CommentService interface, which defines the operations related to managing comments in the application. This service interacts with the CommentRepository to perform CRUD operations on Comment entities and uses the CommentMapper to convert between Comment entities and CommentDto objects. The class is annotated with @Service to indicate that it is a Spring service component.
 */
@Service("CommentService")
public class CommentServiceImpl implements CommentService{

    /**
     * The repository for managing Comment entities in the database. This repository provides methods for performing CRUD operations on comments, and is used by the CommentServiceImpl to interact with the database layer when creating, updating, retrieving, and deleting comments.
     */
    private CommentRepository commentRepository;

    /**
     * The mapper for converting between Comment entities and CommentDto objects. This mapper is used to facilitate the transformation of data between the database layer and the service layer, allowing for clean and maintainable code when handling comment data within the application.
     */
    private CommentMapper commentMapper;

    /**
     * Constructs a new CommentServiceImpl with the specified CommentRepository and CommentMapper. This constructor is used for dependency injection, allowing the Spring framework to provide the necessary components for the service to function properly.
     *
     * @param commentRepository The repository for managing Comment entities in the database.
     * @param commentMapper The mapper for converting between Comment entities and CommentDto objects.
     */
    public CommentServiceImpl(CommentRepository commentRepository, CommentMapper commentMapper) {
        this.commentRepository = commentRepository;
        this.commentMapper = commentMapper;
    }

    /**
     * Retrieves a list of comments associated with a specific task. This method interacts with the CommentRepository to find all Comment entities that have a task ID matching the specified idTask, and uses the CommentMapper to convert these entities into CommentDto objects before returning them as a list.
     *
     * @param idTask The unique identifier of the task for which comments are to be retrieved.
     * @return A list of CommentDto objects representing the comments associated with the specified task.
     */
    @Override
    public List<CommentDto> getCommentsByTask(String idTask) {
        return this.commentRepository.findByTaskId(idTask).stream().map(this.commentMapper::toDto).toList();
    }

    /**
     * Adds a new comment to a specific task. This method takes the unique identifier of the task and a CommentDto object representing the comment to be added, converts the CommentDto into a Comment entity using the CommentMapper, sets the task ID on the Comment entity, and saves it to the database using the CommentRepository. The method then converts the saved Comment entity back into a CommentDto and returns it.
     *
     * @param idTask The unique identifier of the task to which the comment will be added.
     * @param commentDto A CommentDto object containing the details of the comment to be added.
     * @return A CommentDto object representing the newly added comment.
     */
    @Override
    public CommentDto addComment(String idTask, CommentDto commentDto) {
        var comment = this.commentMapper.toEntity(commentDto);
        comment.setTaskId(idTask);
        return this.commentMapper.toDto(this.commentRepository.save(comment));
    }

    /**
     * Deletes a comment by its unique identifier. This method checks if a comment with the specified ID exists in the database, and if so, removes it using the CommentRepository. The method returns a Boolean indicating whether the deletion was successful.
     *
     * @param idComment The unique identifier of the comment to be deleted.
     * @return A Boolean indicating whether the deletion was successful.
     */
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
