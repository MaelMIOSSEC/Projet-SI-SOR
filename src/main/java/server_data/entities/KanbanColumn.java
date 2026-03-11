package server_data.entities;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "KanbanColumn")
@Data
public class KanbanColumn {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "kanban_column_id")
    private String id;

    @Column(name = "title")
    private String title;

    @Column(name = "position")
    private int position;

    @CollectionTable(name = "fk_KanbanColumn_Board1_idx", joinColumns = @JoinColumn(name = "board_id"))
    @Column(name = "board_id")
    private String idBoard;
}
