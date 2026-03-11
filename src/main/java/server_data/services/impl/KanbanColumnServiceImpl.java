package server_data.services.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import server_data.dtos.KanbanColumnDto;
import server_data.dtos.TaskDto;
import server_data.mappers.KanbanColumnMapper;
import server_data.mappers.TaskMapper;
import server_data.repositories.KanbanColumnRepository;
import server_data.repositories.TaskRepository;
import server_data.services.KanbanColumnService;

@Service("KanbanColumnService")
public class KanbanColumnServiceImpl implements KanbanColumnService{

    private KanbanColumnRepository kanbanColumnRepository;
    private KanbanColumnMapper kanbanColumnMapper;
    private TaskRepository taskRepository;
    private TaskMapper taskMapper;

    public KanbanColumnServiceImpl(KanbanColumnRepository kanbanColumnRepository, KanbanColumnMapper kanbanColumnMapper, TaskRepository taskRepository, TaskMapper taskMapper) {
        this.kanbanColumnRepository = kanbanColumnRepository;
        this.kanbanColumnMapper = kanbanColumnMapper;
        this.taskRepository = taskRepository;
        this.taskMapper = taskMapper;
    }

    @Override
    public KanbanColumnDto getColumnById(String idColumn) {
        return this.kanbanColumnRepository.findById(idColumn).map(this.kanbanColumnMapper::toDto).orElseThrow(() -> new EntityNotFoundException("Kanban column not found!"));
    }

    @Override
    public KanbanColumnDto updateColumn(String idColumn, KanbanColumnDto kanbanColumnDto) {
        if (!this.kanbanColumnRepository.existsById(idColumn)) return null;

        var kanbanColumn = this.kanbanColumnMapper.toEntity(kanbanColumnDto);
        kanbanColumn.setId(idColumn);
        return this.kanbanColumnMapper.toDto(this.kanbanColumnRepository.save(kanbanColumn));
    }

    @Override
    public List<TaskDto> getTasksByColumn(String idColumn) {
        if (this.kanbanColumnRepository.existsById(idColumn)) return null;

        return this.taskRepository.findByKanbanColumnId(idColumn).stream().map(this.taskMapper::toDto).toList();
    }

}
