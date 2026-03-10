package server_data.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import server_data.entities.Board;

public interface BoardRepository extends JpaRepository<Board, String>{

    List<Board> findAllBoards();

    List<Board> findByUser(String userId);

    List<Board> findByTitle(String title);

}
