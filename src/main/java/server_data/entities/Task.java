package server_data.entities;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "\"Task\"")
@Data
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "task_id")
    private String id;

    @Column(name = "title")
    private String title;

    @Column(name = "description")
    private String description;
    
    @Column(name = "deadline")
    private LocalDate deadline;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority")
    private Priority priority;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "kanban_column_id", nullable = false)
    private KanbanColumn kanbanColumn;

    @Column(name = "position")
    private int position;

    // Avoir plus tard car les commentaires sont dans la BDD MongoDB
    @Transient
    private List<Comment> comments;
}
