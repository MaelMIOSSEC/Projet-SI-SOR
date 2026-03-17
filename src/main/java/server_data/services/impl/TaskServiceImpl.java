package server_data.services.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import server_data.dtos.TaskDto;
import server_data.entities.KanbanColumn;
import server_data.entities.Task;
import server_data.entities.User;
import server_data.mappers.KanbanColumnMapper;
import server_data.mappers.TaskMapper;
import server_data.mappers.UserMapper;
import server_data.repositories.KanbanColumnRepository;
import server_data.repositories.TaskRepository;
import server_data.repositories.UserRepository;
import server_data.services.TaskService;

/**
 * The TaskServiceImpl class provides the implementation of the TaskService interface, which defines the operations related to managing tasks in the application. This service interacts with the TaskRepository to perform CRUD operations on Task entities, uses the TaskMapper to convert between Task entities and TaskDto objects, and also interacts with KanbanColumnRepository, KanbanColumnMapper, UserRepository, and UserMapper to manage the relationships between tasks, kanban columns, and users. The class is annotated with @Service to indicate that it is a Spring service component, and @Transactional to ensure that database operations are executed within a transaction context.
 */
@Service("TaskService")
@Transactional
public class TaskServiceImpl implements TaskService {

    /**
     * The repository for managing Task entities in the database. This repository provides methods for performing CRUD operations on tasks, and is used by the TaskServiceImpl to interact with the database layer when creating, updating, retrieving, and deleting tasks.
     */
    private final TaskRepository taskRepository;

    /**
     * The mapper for converting between Task entities and TaskDto objects. This mapper is used to facilitate the transformation of data between the database layer and the service layer, allowing for clean and maintainable code when handling task data within the application.
     */
    private final TaskMapper taskMapper;

    /**
     * The repository for managing KanbanColumn entities in the database. This repository provides methods for performing CRUD operations on kanban columns, and is used by the TaskServiceImpl to interact with the database layer when managing the relationship between tasks and their associated kanban columns.
     */
    private final KanbanColumnRepository kanbanColumnRepository;

    /**
     * The mapper for converting between KanbanColumn entities and KanbanColumnDto objects. This mapper is used to facilitate the transformation of data between the database layer and the service layer, allowing for clean and maintainable code when handling kanban column data associated with tasks within the application.
     */
    private final KanbanColumnMapper kanbanColumnMapper;

    /**
     * The repository for managing User entities in the database. This repository provides methods for performing CRUD operations on users, and is used by the TaskServiceImpl to interact with the database layer when managing the relationship between tasks and their associated users.
     */
    private final UserRepository userRepository;

    /**
     * The mapper for converting between User entities and UserDto objects. This mapper is used to facilitate the transformation of data between the database layer and the service layer, allowing for clean and maintainable code when handling user data associated with tasks within the application.
     */
    private final UserMapper userMapper;

    /**
     * Constructs a new TaskServiceImpl with the specified TaskRepository, TaskMapper, KanbanColumnRepository, KanbanColumnMapper, UserRepository, and UserMapper. This constructor is used for dependency injection, allowing the Spring framework to provide the necessary components for the service to function properly.
     *
     * @param taskRepository The repository for managing Task entities in the database.
     * @param taskMapper The mapper for converting between Task entities and TaskDto objects.
     * @param kanbanColumnRepository The repository for managing KanbanColumn entities in the database.
     * @param kanbanColumnMapper The mapper for converting between KanbanColumn entities and KanbanColumnDto objects.
     * @param userRepository The repository for managing User entities in the database.
     * @param userMapper The mapper for converting between User entities and UserDto objects.
     */
    public TaskServiceImpl(TaskRepository taskRepository, TaskMapper taskMapper, KanbanColumnRepository kanbanColumnRepository, KanbanColumnMapper kanbanColumnMapper, UserRepository userRepository, UserMapper userMapper) {
        this.taskRepository = taskRepository;
        this.taskMapper = taskMapper;
        this.kanbanColumnRepository = kanbanColumnRepository;
        this.kanbanColumnMapper = kanbanColumnMapper;
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    /**
     * Retrieves a list of all tasks in the system. This method interacts with the TaskRepository to find all Task entities in the database, and uses the TaskMapper to convert these entities into TaskDto objects before returning them as a list.
     *
     * @return A list of TaskDto objects representing all tasks in the system.
     */
    @Override
    public List<TaskDto> getAllTasks() {
        return this.taskRepository.findAll().stream().map(taskMapper::toDto).toList();
    }

    /**
     * Retrieves a list of tasks associated with a specific board. This method interacts with the TaskRepository to find all Task entities that have a kanban column with a board ID matching the specified idBoard, and uses the TaskMapper to convert these entities into TaskDto objects before returning them as a list.
     *
     * @param idBoard The unique identifier of the board for which tasks are to be retrieved.
     * @return A list of TaskDto objects representing the tasks associated with the specified board.
     */
    @Override
    public List<TaskDto> getTasksByIdBoard(String idBoard) {
        return this.taskRepository.findByKanbanColumn_Board_Id(idBoard).stream().map(this.taskMapper::toDto).toList();
    }

    /**
     * Retrieves a task by its unique identifier. This method interacts with the TaskRepository to find a Task entity that matches the specified idTask, and uses the TaskMapper to convert this entity into a TaskDto object before returning it. If no task is found with the specified ID, an EntityNotFoundException is thrown.
     *
     * @param idTask The unique identifier of the task to be retrieved.
     * @return A TaskDto object representing the task with the specified ID.
     * @throws EntityNotFoundException if no task is found with the specified ID in the database.
     */
    @Override
    public TaskDto getTaskById(String idTask) {
        return this.taskRepository.findById(idTask).map(this.taskMapper::toDto).orElseThrow(() -> new EntityNotFoundException("Task not found!"));
    }

    /**
     * Creates a new task based on the provided TaskDto object. This method converts the TaskDto into a Task entity using the TaskMapper, retrieves the associated KanbanColumn and User entities from the database using the KanbanColumnRepository and UserRepository, sets the relationships on the Task entity, and saves the new task to the database using the TaskRepository. The method then converts the saved Task entity back into a TaskDto and returns it. If no kanban column or user is found with the specified IDs, an EntityNotFoundException is thrown.
     *
     * @param taskDto A TaskDto object containing the details of the task to be created.
     * @return A TaskDto object representing the newly created task.
     * @throws EntityNotFoundException if no kanban column or user is found with the specified IDs in the database.
     */
    @Override
    public TaskDto createTask(TaskDto taskDto) {
        var task = this.taskMapper.toEntity(taskDto);
        KanbanColumn kanbanColumn = this.kanbanColumnRepository.findById(taskDto.getKanbanColumn().getId())
            .orElseThrow(() -> new EntityNotFoundException("Column not found!"));
        task.setKanbanColumn(kanbanColumn);
        User user = userRepository.findById(taskDto.getUser().getId())
            .orElseThrow(() -> new EntityNotFoundException("User not found"));
        task.setUser(user);
        return this.taskMapper.toDto(this.taskRepository.save(task));
    }

    /**
     * Updates an existing task with new information. This method takes the unique identifier of the task to be updated and a TaskDto object containing the updated information. It retrieves the existing Task entity from the database, updates its properties based on the provided TaskDto, and saves the updated entity back to the database using the TaskRepository. The method then converts the updated Task entity into a TaskDto object and returns it. If no task is found with the specified ID, an EntityNotFoundException is thrown.
     *
     * @param idTask The unique identifier of the task to be updated.
     * @param taskDto A TaskDto object containing the updated information for the task.
     * @return A TaskDto object representing the updated task.
     * @throws EntityNotFoundException if no task is found with the specified ID in the database.
     */
    @Override
    public TaskDto updateTask(String idTask, TaskDto taskDto) {
        Task taskToUpdate = this.taskRepository.findById(idTask)
            .orElseThrow(() -> new EntityNotFoundException("Task not found!"));
        taskToUpdate.setTitle(taskDto.getTitle());
        taskToUpdate.setDescription(taskDto.getDescription());
        taskToUpdate.setPosition(taskDto.getPosition());
        taskToUpdate.setPriority(taskDto.getPriority());
        taskToUpdate.setKanbanColumn(this.kanbanColumnMapper.toEntity(taskDto.getKanbanColumn()));
        taskToUpdate.setUser(this.userMapper.toEntity(taskDto.getUser()));
        return this.taskMapper.toDto(this.taskRepository.save(taskToUpdate));
    }

    /**
     * Deletes a task by its unique identifier. This method checks if a task with the specified ID exists in the database, and if so, removes it using the TaskRepository. The method returns a Boolean indicating whether the deletion was successful.
     *
     * @param idTask The unique identifier of the task to be deleted.
     * @return A Boolean indicating whether the deletion was successful.
     */
    @Override
    public Boolean deleteTask(String idTask) {
        if (this.taskRepository.existsById(idTask)) {
            this.taskRepository.deleteById(idTask);
            return true;
        } else {
            return false;
        }

    }

    /**
     * Adds a user to a specific task. This method takes the unique identifier of the task, the unique identifier of the user, and a TaskDto object representing the task to which the user will be added. It retrieves the existing Task entity from the database, retrieves the User entity based on the provided user ID, sets the user on the Task entity, and saves the updated task back to the database using the TaskRepository. The method returns a Boolean indicating whether the operation was successful. If no task or user is found with the specified IDs, an EntityNotFoundException is thrown.
     *
     * @param idTask The unique identifier of the task to which the user will be added.
     * @param idUser The unique identifier of the user to be added to the task.
     * @param taskDto A TaskDto object containing the details of the task to which the user will be added.
     * @return A Boolean indicating whether the operation was successful.
     * @throws EntityNotFoundException if no task or user is found with the specified IDs in the database.
     */
    @Override
    public Boolean addingUser(String idTask, String idUser, TaskDto taskDto) {
        Task task = this.taskRepository.findById(idTask)
            .orElseThrow(() -> new EntityNotFoundException("Tâche non trouvée"));

        User user = this.userRepository.findById(idUser)
            .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé"));

        task.setUser(user);

        this.taskRepository.save(task);
        return true;
    }

}
