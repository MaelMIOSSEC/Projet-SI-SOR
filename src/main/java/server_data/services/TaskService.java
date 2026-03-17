package server_data.services;

import java.util.List;

import server_data.dtos.TaskDto;

/**
 * Service interface for managing Task entities and related operations.
 * Defines methods for retrieving, creating, updating, and deleting tasks, as well as managing task assignments to users.
 */
public interface TaskService {

    /**
     * Retrieves a list of all Task entities.
     *
     * @return a list of TaskDto objects representing all tasks
     */
    List<TaskDto> getAllTasks();

    /**
     * Retrieves a list of Task entities associated with a specific board ID.
     *
     * @param idBoard the ID of the board
     * @return a list of TaskDto objects representing tasks associated with the given board ID
     */
    List<TaskDto> getTasksByIdBoard(String idBoard);

    /**
     * Retrieves a Task entity by its ID.
     *
     * @param idTask the ID of the task to find
     * @return the TaskDto object representing the found task, or null if not found
     */
    TaskDto getTaskById(String idTask);

    /**
     * Creates a new Task entity.
     *
     * @param taskDto the TaskDto object containing the details of the task to create
     * @return the TaskDto object representing the created task
     */
    TaskDto createTask(TaskDto taskDto);

    /**
     * Updates an existing Task entity identified by its ID with new details.
     *
     * @param idTask the ID of the task to update
     * @param taskDto the TaskDto object containing the updated details of the task
     * @return the TaskDto object representing the updated task, or null if the task was not found
     */
    TaskDto updateTask(String idTask, TaskDto taskDto);

    /**
     * Deletes a Task entity identified by its ID.
     *
     * @param idTask the ID of the task to delete
     * @return true if the task was successfully deleted, false otherwise
     */
    Boolean deleteTask(String idTask);

    /**
     * Adds a user to a task.
     *
     * @param idTask the ID of the task
     * @param idUser the ID of the user to add
     * @param taskDto the TaskDto object containing the details of the task
     * @return true if the user was successfully added to the task, false otherwise
     */
    Boolean addingUser(String idTask, String idUser, TaskDto taskDto);
}
