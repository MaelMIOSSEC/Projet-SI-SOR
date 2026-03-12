package server_data.services.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import server_data.dtos.TaskDto;
import server_data.entities.KanbanColumn;
import server_data.entities.Task;
import server_data.entities.User;
import server_data.mappers.TaskMapper;
import server_data.repositories.KanbanColumnRepository;
import server_data.repositories.TaskRepository;
import server_data.repositories.UserRepository;
import server_data.services.TaskService;

@Service("TaskService")
@Transactional
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final TaskMapper taskMapper;
    private final KanbanColumnRepository kanbanColumnRepository;
    private final UserRepository userRepository;

    public TaskServiceImpl(TaskRepository taskRepository, TaskMapper taskMapper, KanbanColumnRepository kanbanColumnRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.taskMapper = taskMapper;
        this.kanbanColumnRepository = kanbanColumnRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<TaskDto> getTasksByIdBoard(String idBoard) {
        return this.taskRepository.findByBoardId(idBoard).stream().map(this.taskMapper::toDto).toList();
    }

    @Override
    public TaskDto getTaskById(String idTask) {
        return this.taskRepository.findById(idTask).map(this.taskMapper::toDto).orElseThrow(() -> new EntityNotFoundException("Task not found!"));
    }

    @Override
    public TaskDto createTask(TaskDto taskDto) {
        var task = this.taskMapper.toEntity(taskDto);
        KanbanColumn kanbanColumn = this.kanbanColumnRepository.findById(taskDto.getKanbanColumnId())
            .orElseThrow(() -> new EntityNotFoundException("Column not found!"));
        task.setKanbanColumn(kanbanColumn);
        User user = userRepository.findById(taskDto.getUserId())
            .orElseThrow(() -> new EntityNotFoundException("User not found"));
        task.setUser(user);
        return this.taskMapper.toDto(this.taskRepository.save(task));
    }

    @Override
    public TaskDto updateTask(String idTask, TaskDto taskDto) {
        if (!this.taskRepository.existsById(idTask)) throw new EntityNotFoundException(" Task not found!");
        var task = this.taskMapper.toEntity(taskDto);
        task.setId(idTask);
        return this.taskMapper.toDto(this.taskRepository.save(task));
    }

    @Override
    public Boolean deleteTask(String idTask) {
        if (this.taskRepository.existsById(idTask)) {
            this.taskRepository.deleteById(idTask);
            return true;
        } else {
            return false;
        }

    }

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
