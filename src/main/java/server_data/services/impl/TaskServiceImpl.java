package server_data.services.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import server_data.dtos.TaskDto;
import server_data.mappers.TaskMapper;
import server_data.repositories.TaskRepository;
import server_data.services.TaskService;

@Service("TaskService")
@Transactional
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final TaskMapper taskMapper;

    public TaskServiceImpl(TaskRepository taskRepository, TaskMapper taskMapper) {
        this.taskRepository = taskRepository;
        this.taskMapper = taskMapper;
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
        if (!this.taskRepository.existsById(idTask)) return false;
        var task = this.taskMapper.toEntity(taskDto);
        task.setUserId(idUser);
        return true;
    }

}
