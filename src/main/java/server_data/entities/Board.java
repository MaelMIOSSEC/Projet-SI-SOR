package server_data.entities;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import jakarta.persistence.OneToMany;

/**
 * Represents a board in the Kanban application.
 * A board can have multiple columns and members.
 */
@Entity
@Table(name = "\"Board\"")
@Getter
@Setter
public class Board {

    /**
     * Unique identifier for the board, generated as a UUID.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "board_id")
    private String id;

    /**
     * Title of the board.
     */
    @Column(name = "title")
    private String title;

    /**
     * List of columns associated with the board.
     * CascadeType.ALL ensures that operations on the board will cascade to its columns.
     * orphanRemoval = true ensures that if a column is removed from the board, it will be deleted from the database.
     */
    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<KanbanColumn> kanbanColumns = new ArrayList<>();

    /**
     * List of members associated with the board.
     * CascadeType.ALL ensures that operations on the board will cascade to its members.
     * orphanRemoval = true ensures that if a member is removed from the board, it will be deleted from the database.
     */
    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BoardMember> members = new ArrayList<>();
}
