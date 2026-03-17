package server_data.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import server_data.entities.BoardMember;
import server_data.entities.BoardMemberId;

/**
 * Repository interface for managing BoardMember entities.
 * Extends JpaRepository to provide CRUD operations and custom query methods.
 */
public interface BoardMemberRepository extends JpaRepository<BoardMember, BoardMemberId>{

    /**
     * Finds all BoardMember entities associated with a specific user ID.
     *
     * @param idUser the ID of the user
     * @return a list of BoardMember entities associated with the given user ID
     */
    List<BoardMember> findByUser_Id(String idUser);

}
