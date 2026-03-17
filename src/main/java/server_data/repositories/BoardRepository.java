package server_data.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import server_data.entities.Board;

/**
 * Repository interface for managing Board entities.
 * Extends JpaRepository to provide CRUD operations and custom query methods.
 */
public interface BoardRepository extends JpaRepository<Board, String>{

    /**
     * Finds all Board entities associated with a specific user ID through their membership.
     *
     * @param userId the ID of the user
     * @return a list of Board entities associated with the given user ID
     */
    List<Board> findByMembers_User_Id(String userId);

    /**
     * Finds all Board entities with a specific title.
     *
     * @param title the title of the boards to find
     * @return a list of Board entities with the given title
     */
    List<Board> findByTitle(String title);

}
