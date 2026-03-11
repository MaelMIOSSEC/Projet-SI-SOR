package server_data.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import server_data.entities.KanbanColumn;

public interface KanbanColumnRepository extends JpaRepository<KanbanColumn, String> {

    List<KanbanColumn> findByBoardIdByPositionAsc(String boardId);

    KanbanColumn findByTitleAndBoardId(String title, String boardId);

}
