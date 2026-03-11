package server_data.repositories;

import java.util.List;

import org.springframework.stereotype.Repository;

import server_data.entities.Comment;

@Repository
public interface CommentRepository {

    List<Comment> findByTaskId(String taskId);

    boolean deleteByTaskId(String taskId);

}
