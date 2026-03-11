package server_data.dtos;

import lombok.Data;

@Data
public class KanbanColumnDto {

    private String id;

    private String title;

    private int position;

    private String idBoard;
}
