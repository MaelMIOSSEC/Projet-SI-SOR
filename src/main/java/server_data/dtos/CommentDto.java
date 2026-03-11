package server_data.dtos;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class CommentDto {

    private String id;

    private String taskId;

    private String authorId;

    private String content;

    private LocalDateTime createdAt;

    private String attachmentUrl;

}
