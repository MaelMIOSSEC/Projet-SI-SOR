package server_data.mappers;

import org.springframework.stereotype.Component;

import server_data.dtos.KanbanColumnDto;
import server_data.entities.KanbanColumn;

@Component
public class KanbanColumnMapper {
    
    public KanbanColumnDto toDto(KanbanColumn kanbanColumn) {
        if (kanbanColumn == null) return null;
        
        KanbanColumnDto kanbanColumnDto = new KanbanColumnDto();
        kanbanColumnDto.setId(kanbanColumn.getId());
        kanbanColumnDto.setTitle(kanbanColumn.getTitle());
        kanbanColumnDto.setPosition(kanbanColumn.getPosition());
        if (kanbanColumn.getBoard() != null) {
            kanbanColumnDto.setIdBoard(kanbanColumn.getBoard().getId());
        }
        return kanbanColumnDto;
    }

    public KanbanColumn toEntity(KanbanColumnDto kanbanColumnDto) {
        if (kanbanColumnDto == null) return null;

        KanbanColumn kanbanColumn = new KanbanColumn();
        kanbanColumn.setId(kanbanColumnDto.getId());
        kanbanColumn.setTitle(kanbanColumnDto.getTitle());
        kanbanColumn.setPosition(kanbanColumnDto.getPosition());
        //kanbanColumn.setId(kanbanColumnDto.getIdBoard());
        return kanbanColumn;
    }
}
