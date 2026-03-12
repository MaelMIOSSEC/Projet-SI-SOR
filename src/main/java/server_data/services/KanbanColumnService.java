package server_data.services;

import java.util.List;

import server_data.dtos.KanbanColumnDto;
import server_data.dtos.TaskDto;

public interface KanbanColumnService {

    KanbanColumnDto getColumnById(String idColumn);

    KanbanColumnDto updateColumn(String idColumn, KanbanColumnDto kanbanColumnDto);

    List<TaskDto> getTasksByColumn(String idColumn);

    KanbanColumnDto createColumn(KanbanColumnDto kanbanColumnDto);
}
