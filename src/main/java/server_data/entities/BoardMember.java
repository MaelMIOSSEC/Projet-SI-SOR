package server_data.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

/**
 * Represents the association between a user and a board, along with the user's role on that board.
 * This entity uses a composite primary key consisting of user_id and board_id.
 */
@Data
@Entity
@Table(name = "\"BoardMember\"")
@IdClass(BoardMemberId.class)
public class BoardMember {

    /**
     * The user associated with the board member.
     * This is part of the composite primary key.
     */
    @Id
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    /**
     * The board associated with the board member.
     * This is part of the composite primary key.
     */
    @Id
    @ManyToOne
    @JoinColumn(name = "board_id")
    private Board board;

    /**
     * The role of the user on the board (e.g., OWNER, MEMBER).
     * This is stored as a string in the database.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private Role role;
}
