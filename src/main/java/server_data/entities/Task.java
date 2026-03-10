package server_data.entities;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "Task")
@Data
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "task_id")
    private String id;

    @Column(name = "title")
    private String title;

    @Column(name = "description")
    private String description;
    
    @Column(name = "deadline")
    private LocalDate deadline;

    @Column(name = "priority")
    private Priority priority;

    @CollectionTable(name = "fk_Task_User1", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "user_id")
    private String userId;

    @CollectionTable(name = "fk_Task_KanbanColumn1", joinColumns = @JoinColumn(name = "kanban_column_id"))
    @Column(name = "kanban_column_id")
    private String kanbanColumnId;

    @Column(name = "position")
    private int position;

    // Avoir plus tard car les commentaires sont dans la BDD MongoDB
    private List<Comment> comments;
}
