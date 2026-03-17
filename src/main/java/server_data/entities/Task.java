package server_data.entities;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

/**
 * Represents a task in the Kanban application.
 * Each task has a title, description, deadline, priority, and is associated with a user and a Kanban column.
 */
@Entity
@Table(name = "\"Task\"")
@Data
public class Task {

    /**
     * Unique identifier for the task, generated as a UUID.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "task_id")
    private String id;

    /**
     * Title of the task.
     */
    @Column(name = "title")
    private String title;

    /**
     * Description of the task.
     */
    @Column(name = "description")
    private String description;
    
    /**
     * Deadline for the task.
     */
    @Column(name = "deadline")
    private LocalDate deadline;

    /**
     * Priority level of the task (e.g., Low, Medium, Strong).
     * This is stored as a string in the database.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "priority")
    private Priority priority;

    /**
     * The user to whom the task is assigned.
     * This is a many-to-one relationship, as multiple tasks can be assigned to the same user.
     */
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * The Kanban column that this task belongs to.
     * This is a many-to-one relationship, as multiple tasks can belong to the same column.
     */
    @ManyToOne
    @JoinColumn(name = "kanban_column_id", nullable = false)
    private KanbanColumn kanbanColumn;

    /**
     * Position of the task within the column, used for ordering.
     */
    @Column(name = "position")
    private int position;

    /**
     * List of comments associated with the task.
     * This field is marked as @Transient because comments are stored in a separate MongoDB collection and are not directly mapped to the Task entity in the relational database.
     */
    @Transient
    private List<Comment> comments;
}
