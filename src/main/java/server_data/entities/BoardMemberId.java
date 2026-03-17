package server_data.entities;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents the composite primary key for the BoardMember entity, consisting of user_id and board_id.
 * This class must implement Serializable and have a default constructor, as required by JPA for composite keys.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BoardMemberId implements Serializable {

    /**
     * The user ID associated with the board member.
     */
    private String user;

    /**
     * The board ID associated with the board member.
     */
    private String board;

}
