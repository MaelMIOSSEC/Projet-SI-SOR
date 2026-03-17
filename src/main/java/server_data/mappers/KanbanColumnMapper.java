package server_data.mappers;

import org.springframework.stereotype.Component;

import server_data.dtos.KanbanColumnDto;
import server_data.entities.KanbanColumn;

/**
 * Mapper for converting between KanbanColumn entities and KanbanColumn DTOs.
 */
@Component
public class KanbanColumnMapper {

    /**
     * Converts a KanbanColumn entity to a KanbanColumn DTO.
     * 
     * @param kanbanColumn The KanbanColumn entity to convert.
     * @return The corresponding KanbanColumn DTO.
     */
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

    /**
     * Converts a KanbanColumn DTO to a KanbanColumn entity.
     * 
     * @param kanbanColumnDto The KanbanColumn DTO to convert.
     * @return The corresponding KanbanColumn entity.
     */
    public KanbanColumn toEntity(KanbanColumnDto kanbanColumnDto) {
        if (kanbanColumnDto == null) return null;

        KanbanColumn kanbanColumn = new KanbanColumn();
        kanbanColumn.setId(kanbanColumnDto.getId());
        kanbanColumn.setTitle(kanbanColumnDto.getTitle());
        kanbanColumn.setPosition(kanbanColumnDto.getPosition());
        return kanbanColumn;
    }
}
