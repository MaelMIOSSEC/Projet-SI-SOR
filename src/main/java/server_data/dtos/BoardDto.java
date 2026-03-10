package server_data.dtos;

import java.util.List;

import lombok.Data;

@Data
public class BoardDto {

    private String id;

    private String title;

    private List<KanbanColumnDto> kanbanColumns;

    private List<UserDto> members;
}
