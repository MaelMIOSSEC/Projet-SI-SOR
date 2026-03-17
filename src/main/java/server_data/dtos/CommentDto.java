package server_data.dtos;

import java.time.LocalDateTime;

import lombok.Data;

/**
 * Data Transfer Object for representing a comment on a task.
 */
@Data
public class CommentDto {

    /**
     * The ID of the comment.
     */
    private String id;

    /**
     * The ID of the task to which the comment belongs.
     */
    private String taskId;

    /**
     * The ID of the user who created the comment.
     */
    private String authorId;

    /**
     * The content of the comment.
     */
    private String content;

    /**
     * The date and time when the comment was created.
     */
    private LocalDateTime createdAt;

    /**
     * The URL of any attachment associated with the comment.
     */
    private String attachmentUrl;

}
