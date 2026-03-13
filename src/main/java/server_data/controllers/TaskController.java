package server_data.controllers;

import server_data.dtos.TaskDto;
import server_data.services.TaskService;

import java.util.List;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public List<TaskDto> getTasks() {
        return this.taskService.getAllTasks();
    }

    @GetMapping("/board/{idBoard}")
    public List<TaskDto> getTasksByBoard(@PathVariable String idBoard) {
        return this.taskService.getTasksByIdBoard(idBoard);
    }

    @GetMapping("/{idTask}")
    public TaskDto getTask(@PathVariable String idTask) {
        return this.taskService.getTaskById(idTask);
    }

    @PostMapping
    public TaskDto createTask(final @RequestBody TaskDto taskDto) {
        return this.taskService.createTask(taskDto);
    }

    @PutMapping("/{idTask}")
    public TaskDto updateTask(@PathVariable String idTask, @RequestBody TaskDto taskDto) {
        return this.taskService.updateTask(idTask, taskDto);
    }

    @DeleteMapping("/{idTask}")
    public Boolean deleteTask(@PathVariable String idTask) {
        return this.taskService.deleteTask(idTask);
    }

    @PostMapping("/{idTask}/users/{idUser}")
    public Boolean addingUser(@PathVariable String idTask, @PathVariable String idUser, @RequestBody TaskDto taskDto) {
        return this.taskService.addingUser(idTask, idUser, taskDto);
    }

}
