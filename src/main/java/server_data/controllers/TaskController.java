package server_data.controllers;

import server_data.dtos.TaskDto;
import server_data.services.TaskService;

import java.util.List;

import org.springframework.web.bind.annotation.*;

@RestController
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    public List<TaskDto> getTasks(@PathVariable String idBoard) {
        return this.taskService.getTasksByIdBoard(idBoard);
    }

    public TaskDto getTask(@PathVariable String idTask) {
        return this.taskService.getTaskById(idTask);
    }

    public TaskDto createTask(final @RequestBody TaskDto taskDto) {
        return this.taskService.createTask(taskDto);
    }

    public TaskDto updateTask(@PathVariable String idTask, @RequestBody TaskDto taskDto) {
        return this.taskService.updateTask(idTask, taskDto);
    }

    public Boolean deleteTask(@PathVariable String idTask) {
        return this.taskService.deleteTask(idTask);
    }

    public Boolean addingUser(@PathVariable String idTask, @PathVariable String idUser) {
        return this.taskService(idTask, idUser);
    }

}
