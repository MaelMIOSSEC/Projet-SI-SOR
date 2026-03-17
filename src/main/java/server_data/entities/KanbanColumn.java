package server_data.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

/**
 * Represents a column in a Kanban board.
 * Each column belongs to a specific board and has a title and position.
 */
@Entity
@Table(name = "\"KanbanColumn\"")
@Data
public class KanbanColumn {

    /**
     * Unique identifier for the Kanban column, generated as a UUID.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "kanban_column_id")
    private String id;

    /**
     * Title of the Kanban column.
     */
    @Column(name = "title")
    private String title;

    /**
     * Position of the column within the board, used for ordering.
     */
    @Column(name = "position")
    private int position;

    /**
     * The board that this column belongs to.
     * This is a many-to-one relationship, as multiple columns can belong to the same board.
     */
    @ManyToOne
    @JoinColumn(name = "board_id", nullable = false)
    private Board board;
}
