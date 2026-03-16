package server_data.entities;

import java.time.LocalDateTime;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import org.springframework.data.annotation.Id;
import lombok.Data;

@Document(collection = "comments")
@Data
public class Comment {

    @Id
    private String id;

    @Field("task_id")
    private String taskId;

    @Field("author_id")
    private String authorId;

    private String content;

    @Field("create_at")
    private LocalDateTime createdAt;

    @Field("url_id")
    private String attachmentUrl;

}
