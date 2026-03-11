package server_data.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import server_data.dtos.KanbanColumnDto;
import server_data.dtos.TaskDto;
import server_data.services.KanbanColumnService;


@RestController
@RequestMapping("/columns")
public class KanbanColumnController {

    private final KanbanColumnService kanbanColumnService;

    public KanbanColumnController(KanbanColumnService kanbanColumnService) {
        this.kanbanColumnService = kanbanColumnService;
    }

    @GetMapping("/{idColumn}")
    public KanbanColumnDto getColumnById(@PathVariable String idColumn) {
        return this.kanbanColumnService.getColumnById(idColumn);
    }

    @PutMapping("/{idColumn}")
    public KanbanColumnDto updateColumn(@PathVariable String idColumn, @RequestBody KanbanColumnDto kanbanColumnDto) {
        return this.kanbanColumnService.updateColumn(idColumn, kanbanColumnDto);
    }

    @GetMapping("/{idColumn}/tasks")
    public List<TaskDto> getTasksByColumn(@PathVariable String idColumn) {
        return this.kanbanColumnService.getTasksByColumn(idColumn);
    }
    

}
