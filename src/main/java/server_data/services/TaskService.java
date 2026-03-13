package server_data.services;

import java.util.List;

import server_data.dtos.TaskDto;

public interface TaskService {

    List<TaskDto> getAllTasks();

    List<TaskDto> getTasksByIdBoard(String idBoard);

    TaskDto getTaskById(String idTask);

    TaskDto createTask(TaskDto taskDto);

    TaskDto updateTask(String idTask, TaskDto taskDto);

    Boolean deleteTask(String idTask);

    Boolean addingUser(String idTask, String idUser, TaskDto taskDto);
}
