package server_data.entities;

import java.time.LocalDateTime;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import org.springframework.data.annotation.Id;
import lombok.Data;

/**
 * Represents a comment made on a task in the Kanban application.
 * This entity is stored in a MongoDB collection named "comments".
 */
@Document(collection = "comments")
@Data
public class Comment {

    /**
     * Unique identifier for the comment, generated as a UUID.
     */
    @Id
    private String id;

    /**
     * The ID of the task that this comment is associated with.
     */
    @Field("task_id")
    private String taskId;

    /**
     * The ID of the user who authored the comment.
     */
    @Field("author_id")
    private String authorId;

    /**
     * The content of the comment.
     */
    private String content;

    /**
     * The timestamp when the comment was created.
     */
    @Field("create_at")
    private LocalDateTime createdAt;

    /**
     * The URL of the attachment associated with the comment, if any.
     */
    @Field("url_id")
    private String attachmentUrl;

}
