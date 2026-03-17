package server_data.controllers;

import server_data.dtos.TaskDto;
import server_data.services.TaskService;

import java.util.List;

import org.springframework.web.bind.annotation.*;

/**
 * Controller for handling requests related to tasks.
 */
@RestController
@RequestMapping("/tasks")
public class TaskController {

    /** Service for managing tasks. */
    private final TaskService taskService;

    /**
     * Constructor for initializing the task service.
     * @param taskService the task service to use
     */
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    /**
     * Retrieves the list of all tasks.
     * @return a list of task DTOs
     */
    @GetMapping
    public List<TaskDto> getTasks() {
        return this.taskService.getAllTasks();
    }

    /**
     * Retrieves the list of tasks associated with a specific board.
     * @param idBoard the ID of the board for which to retrieve tasks
     * @return a list of task DTOs associated with the specified board
     */
    @GetMapping("/board/{idBoard}")
    public List<TaskDto> getTasksByBoard(@PathVariable String idBoard) {
        return this.taskService.getTasksByIdBoard(idBoard);
    }

    /**
     * Retrieves a task by its ID.
     * @param idTask the ID of the task to retrieve
     * @return the task DTO
     */
    @GetMapping("/{idTask}")
    public TaskDto getTask(@PathVariable String idTask) {
        return this.taskService.getTaskById(idTask);
    }

    /**
     * Creates a new task with the provided data.
     * @param taskDto the DTO containing the data for the new task
     * @return the created task DTO
     */
    @PostMapping
    public TaskDto createTask(final @RequestBody TaskDto taskDto) {
        return this.taskService.createTask(taskDto);
    }

    /**
     * Updates an existing task with the provided data.
     * @param idTask the ID of the task to update
     * @param taskDto the DTO containing the updated task data
     * @return the updated task DTO
     */
    @PutMapping("/{idTask}")
    public TaskDto updateTask(@PathVariable String idTask, @RequestBody TaskDto taskDto) {
        return this.taskService.updateTask(idTask, taskDto);
    }

    /**
     * Deletes a task by its ID.
     * @param idTask the ID of the task to delete
     * @return true if the task was successfully deleted, false otherwise
     */
    @DeleteMapping("/{idTask}")
    public Boolean deleteTask(@PathVariable String idTask) {
        return this.taskService.deleteTask(idTask);
    }

    /**
    * Adds a user to a task.
    * @param idTask the ID of the task to which the user will be added
    * @param idUser the ID of the user to add to the task
    * @param taskDto the DTO containing the updated task data after adding the user
    * @return true if the user was successfully added to the task, false otherwise
    */
    @PostMapping("/{idTask}/users/{idUser}")
    public Boolean addingUser(@PathVariable String idTask, @PathVariable String idUser, @RequestBody TaskDto taskDto) {
        return this.taskService.addingUser(idTask, idUser, taskDto);
    }

}
