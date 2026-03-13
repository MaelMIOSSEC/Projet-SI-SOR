package server_data.entities;

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
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
//import lombok.Data;

@Entity
@Table(name = "\"Board\"")
//@Data
@Getter
@Setter
public class Board {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "board_id")
    private String id;

    @Column(name = "title")
    private String title;

    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<KanbanColumn> kanbanColumns;

    @ManyToMany
    @JoinTable(
        name = "BoardMember",
        joinColumns = @JoinColumn(name = "board_id"), 
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> members;
}
