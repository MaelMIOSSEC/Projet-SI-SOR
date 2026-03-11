package server_data.mappers;

import org.springframework.stereotype.Component;

import server_data.dtos.TaskDto;
import server_data.entities.Task;

@Component
public class TaskMapper {

    public TaskDto toDto(Task task) {
        if (task == null) return null;

        TaskDto taskDto = new TaskDto();
        taskDto.setId(task.getId());
        taskDto.setTitle(task.getTitle());
        taskDto.setDescription(task.getDescription());
        taskDto.setDeadline(task.getDeadline());
        taskDto.setPriority(task.getPriority());
        taskDto.setUserId(task.getUserId());
        taskDto.setKanbanColumnId(task.getKanbanColumnId());
        taskDto.setPosition(task.getPosition());
        taskDto.setComments(task.getComments());
        return taskDto;
    }

    public Task toEntity(TaskDto taskDto) {
        if (taskDto == null) return null;

        Task task = new Task();
        if (taskDto.getId() != "") task.setId(taskDto.getId());
        task.setTitle(taskDto.getTitle());
        task.setDescription(taskDto.getDescription());
        task.setDeadline(taskDto.getDeadline());
        task.setPriority(taskDto.getPriority());
        task.setUserId(taskDto.getUserId());
        task.setKanbanColumnId(taskDto.getKanbanColumnId());
        task.setPosition(taskDto.getPosition());
        task.setComments(taskDto.getComments());
        return task;
    }
}
