package server_data.mappers;

import server_data.dtos.KanbanColumnDto;
import server_data.entities.KanbanColumn;

public class KanbanColumnMapper {
    
    public KanbanColumnDto toDto(KanbanColumn kanbanColumn) {
        if (kanbanColumn == null) return null;

        return new KanbanColumnDto();
    }

    public KanbanColumn toEntity(KanbanColumnDto kanbanColumnDto) {
        if (kanbanColumnDto == null) return null;

        return new KanbanColumn();
    }
}
