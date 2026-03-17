package server_data.services.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import server_data.dtos.KanbanColumnDto;
import server_data.dtos.TaskDto;
import server_data.entities.Board;
import server_data.entities.KanbanColumn;
import server_data.mappers.KanbanColumnMapper;
import server_data.mappers.TaskMapper;
import server_data.repositories.BoardRepository;
import server_data.repositories.KanbanColumnRepository;
import server_data.repositories.TaskRepository;
import server_data.services.KanbanColumnService;

/**
 * The KanbanColumnServiceImpl class provides the implementation of the KanbanColumnService interface, which defines the operations related to managing kanban columns in the application. This service interacts with the KanbanColumnRepository to perform CRUD operations on KanbanColumn entities, uses the KanbanColumnMapper to convert between KanbanColumn entities and KanbanColumnDto objects, and also interacts with TaskRepository and TaskMapper to manage tasks associated with kanban columns. The class is annotated with @Service to indicate that it is a Spring service component.
 */
@Service("KanbanColumnService")
public class KanbanColumnServiceImpl implements KanbanColumnService{

    /**
     * The repository for managing KanbanColumn entities in the database. This repository provides methods for performing CRUD operations on kanban columns, and is used by the KanbanColumnServiceImpl to interact with the database layer when creating, updating, retrieving, and deleting kanban columns.
     */
    private KanbanColumnRepository kanbanColumnRepository;

    /**
     * The mapper for converting between KanbanColumn entities and KanbanColumnDto objects. This mapper is used to facilitate the transformation of data between the database layer and the service layer, allowing for clean and maintainable code when handling kanban column data within the application.
     */
    private KanbanColumnMapper kanbanColumnMapper;

    /**
     * The repository for managing Task entities in the database. This repository provides methods for performing CRUD operations on tasks, and is used by the KanbanColumnServiceImpl to interact with the database layer when managing tasks associated with kanban columns.
     */
    private TaskRepository taskRepository;

    /**
     * The mapper for converting between Task entities and TaskDto objects. This mapper is used to facilitate the transformation of data between the database layer and the service layer, allowing for clean and maintainable code when handling task data associated with kanban columns within the application.
     */
    private TaskMapper taskMapper;

    /**
     * The repository for managing Board entities in the database. This repository provides methods for performing CRUD operations on boards, and is used by the KanbanColumnServiceImpl to interact with the database layer when managing the relationship between kanban columns and their associated boards.
     */
    private BoardRepository boardRepository;

    /**
     * Constructs a new KanbanColumnServiceImpl with the specified KanbanColumnRepository, KanbanColumnMapper, TaskRepository, TaskMapper, and BoardRepository. This constructor is used for dependency injection, allowing the Spring framework to provide the necessary components for the service to function properly.
     *
     * @param kanbanColumnRepository The repository for managing KanbanColumn entities in the database.
     * @param kanbanColumnMapper The mapper for converting between KanbanColumn entities and KanbanColumnDto objects.
     * @param taskRepository The repository for managing Task entities in the database.
     * @param taskMapper The mapper for converting between Task entities and TaskDto objects.
     * @param boardRepository The repository for managing Board entities in the database.
     */
    public KanbanColumnServiceImpl(KanbanColumnRepository kanbanColumnRepository, KanbanColumnMapper kanbanColumnMapper, TaskRepository taskRepository, TaskMapper taskMapper, BoardRepository boardRepository) {
        this.kanbanColumnRepository = kanbanColumnRepository;
        this.kanbanColumnMapper = kanbanColumnMapper;
        this.taskRepository = taskRepository;
        this.taskMapper = taskMapper;
        this.boardRepository = boardRepository;
    }

    /**
     * Retrieves a kanban column by its unique identifier. This method interacts with the KanbanColumnRepository to find a KanbanColumn entity that matches the specified idColumn, and uses the KanbanColumnMapper to convert this entity into a KanbanColumnDto object before returning it. If no kanban column is found with the specified ID, an EntityNotFoundException is thrown.
     *
     * @param idColumn The unique identifier of the kanban column to be retrieved.
     * @return A KanbanColumnDto object representing the kanban column with the specified ID.
     * @throws EntityNotFoundException if no kanban column is found with the specified ID in the database.
     */
    @Override
    public KanbanColumnDto getColumnById(String idColumn) {
        return this.kanbanColumnRepository.findById(idColumn).map(this.kanbanColumnMapper::toDto).orElseThrow(() -> new EntityNotFoundException("Kanban column not found!"));
    }

    /**
     * Updates an existing kanban column with new information. This method takes the unique identifier of the kanban column to be updated and a KanbanColumnDto object containing the updated information. It retrieves the existing KanbanColumn entity from the database, updates its properties based on the provided KanbanColumnDto, and saves the updated entity back to the database using the KanbanColumnRepository. The method then converts the updated KanbanColumn entity into a KanbanColumnDto object and returns it. If no kanban column is found with the specified ID, an EntityNotFoundException is thrown.
     *
     * @param idColumn The unique identifier of the kanban column to be updated.
     * @param kanbanColumnDto A KanbanColumnDto object containing the updated information for the kanban column.
     * @return A KanbanColumnDto object representing the updated kanban column.
     * @throws EntityNotFoundException if no kanban column is found with the specified ID in the database.
     */
    @Override
    public KanbanColumnDto updateColumn(String idColumn, KanbanColumnDto kanbanColumnDto) {
        KanbanColumn existingColumn = this.kanbanColumnRepository.findById(idColumn)
            .orElseThrow(() -> new EntityNotFoundException("Kanban column not found!"));

        String boardId = kanbanColumnDto.getIdBoard();
        if (boardId == null) {
            boardId = existingColumn.getBoard().getId();
        }

        KanbanColumn kanbanColumn = this.kanbanColumnMapper.toEntity(kanbanColumnDto);
        kanbanColumn.setId(idColumn);

        if (kanbanColumnDto.getIdBoard() == null) {
            throw new IllegalArgumentException("L'ID du Board est requis pour mettre à jour la colonne.");
        }
        Board board = this.boardRepository.findById(boardId)
            .orElseThrow(() -> new EntityNotFoundException("Board not found!"));
        kanbanColumn.setBoard(board);
    
        return this.kanbanColumnMapper.toDto(this.kanbanColumnRepository.save(kanbanColumn));
    }

    /**
     * Deletes a kanban column by its unique identifier. This method checks if a kanban column with the specified ID exists in the database, and if so, removes it using the KanbanColumnRepository. The method returns a Boolean indicating whether the deletion was successful.
     *
     * @param idColumn The unique identifier of the kanban column to be deleted.
     * @return A Boolean indicating whether the deletion was successful.
     */
    @Override
    public List<TaskDto> getTasksByColumn(String idColumn) {
        if (!this.kanbanColumnRepository.existsById(idColumn)) return null;

        return this.taskRepository.findByKanbanColumn_Id(idColumn).stream().map(this.taskMapper::toDto).toList();
    }

    /**
     * Creates a new kanban column based on the provided KanbanColumnDto object. This method converts the KanbanColumnDto into a KanbanColumn entity using the KanbanColumnMapper, retrieves the associated Board entity from the database using the BoardRepository, sets the position of the new kanban column based on the existing columns in the board, and saves the new kanban column to the database using the KanbanColumnRepository. The method then converts the saved KanbanColumn entity back into a KanbanColumnDto and returns it. If no board is found with the specified ID, an EntityNotFoundException is thrown.
     *
     * @param kanbanColumnDto A KanbanColumnDto object containing the details of the kanban column to be created.
     * @return A KanbanColumnDto object representing the newly created kanban column.
     * @throws EntityNotFoundException if no board is found with the specified ID in the database.
     */
    @Override
    public KanbanColumnDto createColumn(KanbanColumnDto kanbanColumnDto) {
        KanbanColumn kanbanColumn = this.kanbanColumnMapper.toEntity(kanbanColumnDto);

        Board board = this.boardRepository.findById(kanbanColumnDto.getIdBoard()).orElseThrow(() -> new EntityNotFoundException("Board not found!"));

        List<KanbanColumn> lKanbanColumns = board.getKanbanColumns();
        if (lKanbanColumns.size() < kanbanColumn.getPosition()) {
            kanbanColumn.setPosition(lKanbanColumns.size() + 1);
        }
        for (int i = 0; i < lKanbanColumns.size() - 1; i++) {
            if (lKanbanColumns.get(i).getPosition() == kanbanColumn.getPosition()) {
                kanbanColumn.setPosition(lKanbanColumns.size() + 1);
            }
        }
        kanbanColumn.setBoard(board);

        return this.kanbanColumnMapper.toDto(this.kanbanColumnRepository.save(kanbanColumn));
    }

}
