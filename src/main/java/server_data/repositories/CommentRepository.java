package server_data.repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import server_data.entities.Comment;

/**
 * Repository interface for managing Comment entities.
 * Extends MongoRepository to provide CRUD operations and custom query methods for MongoDB.
 */
@Repository
public interface CommentRepository extends MongoRepository<Comment, String> {

    /**
     * Finds all Comment entities associated with a specific task ID.
     *
     * @param taskId the ID of the task
     * @return a list of Comment entities associated with the given task ID
     */
    List<Comment> findByTaskId(String taskId);

    /**
     * Deletes all Comment entities associated with a specific task ID.
     *
     * @param taskId the ID of the task
     * @return true if the deletion was successful, false otherwise
     */
    boolean deleteByTaskId(String taskId);

}
