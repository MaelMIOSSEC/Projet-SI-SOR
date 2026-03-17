package server_data.services.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import server_data.dtos.BoardDto;
import server_data.dtos.KanbanColumnDto;
import server_data.dtos.UserDto;
import server_data.entities.Board;
import server_data.entities.BoardMember;
import server_data.entities.KanbanColumn;
import server_data.entities.Role;
import server_data.entities.User;
import server_data.mappers.BoardMapper;
import server_data.mappers.KanbanColumnMapper;
import server_data.repositories.BoardMemberRepository;
import server_data.repositories.BoardRepository;
import server_data.repositories.UserRepository;
import server_data.services.BoardService;
import server_data.services.KanbanColumnService;

/**
 * Implementation of the BoardService interface, providing methods to manage boards, including creating, updating, and deleting boards, as well as managing board members and kanban columns.
 * This service interacts with the BoardRepository, UserRepository, and BoardMemberRepository to perform database operations, and uses mappers to convert between entities and DTOs.
 * All methods are transactional to ensure data integrity during database operations.
 */
@Service("BoardService")
@Transactional
public class BoardServiceImpl implements BoardService{

    /**
     * Service for managing Kanban columns, used to create and delete columns within boards. This service is injected into the BoardServiceImpl to allow for delegation of column-related operations, ensuring separation of concerns and modularity in the codebase.
     */
    private final KanbanColumnService kanbanColumnService;

    /**
     * Mapper for converting between KanbanColumn entities and KanbanColumnDto objects. This mapper is used to facilitate the transformation of data between the database layer and the service layer, allowing for clean and maintainable code when handling Kanban column data within board operations.
     */
    private final KanbanColumnMapper kanbanColumnMapper;

    /**
     * Repository for managing Board entities in the database. This repository provides methods for performing CRUD operations on boards, and is used by the BoardServiceImpl to interact with the database layer when creating, updating, retrieving, and deleting boards.
     */
    private final BoardRepository boardRepository;

    /**
     * Mapper for converting between Board entities and BoardDto objects. This mapper is used to facilitate the transformation of data between the database layer and the service layer, allowing for clean and maintainable code when handling board data within the application.
     */
    private final BoardMapper boardMapper;

    /**
     * Repository for managing User entities in the database. This repository provides methods for performing CRUD operations on users, and is used by the BoardServiceImpl to interact with the database layer when managing board members and their associated user data.
     */
    private final UserRepository userRepository;

    /**
     * Repository for managing BoardMember entities in the database. This repository provides methods for performing CRUD operations on board members, and is used by the BoardServiceImpl to interact with the database layer when managing the relationships between boards and their members.
     */
    private final BoardMemberRepository boardMemberRepository;

    /**
     * Constructor for the BoardServiceImpl class, which initializes the service with the necessary dependencies, including the BoardRepository, BoardMapper, KanbanColumnService, KanbanColumnMapper, UserRepository, and BoardMemberRepository. These dependencies are injected through the constructor to allow for proper management of the service's interactions with the database and other services.
     *
     * @param boardRepository The repository for managing Board entities in the database.
     * @param boardMapper The mapper for converting between Board entities and BoardDto objects.
     * @param kanbanColumnService The service for managing Kanban columns within boards.
     * @param kanbanColumnMapper The mapper for converting between KanbanColumn entities and KanbanColumnDto objects.
     * @param userRepository The repository for managing User entities in the database.
     * @param boardMemberRepository The repository for managing BoardMember entities in the database.
     */
    public BoardServiceImpl(BoardRepository boardRepository, BoardMapper boardMapper, KanbanColumnService kanbanColumnService, KanbanColumnMapper kanbanColumnMapper, UserRepository userRepository, BoardMemberRepository boardMemberRepository) {
        this.boardRepository = boardRepository;
        this.boardMapper = boardMapper;
        this.kanbanColumnService = kanbanColumnService;
        this.kanbanColumnMapper = kanbanColumnMapper;
        this.userRepository = userRepository;
        this.boardMemberRepository = boardMemberRepository;
    }

    /**
     * Retrieves a list of all boards in the system. This method interacts with the BoardRepository to fetch all Board entities from the database, and uses the BoardMapper to convert these entities into BoardDto objects before returning them as a list.
     *
     * @return A list of BoardDto objects representing all boards in the system.
     */
    @Override
    public List<BoardDto> getAllBoard() {
        return this.boardRepository.findAll().stream().map(this.boardMapper::toDto).toList();
    }

    /**
     * Retrieves a specific board by its unique identifier. This method interacts with the BoardRepository to find a Board entity by its ID, and uses the BoardMapper to convert the entity into a BoardDto object before returning it. If the board is not found, an EntityNotFoundException is thrown.
     *
     * @param idBoard The unique identifier of the board to retrieve.
     * @return A BoardDto object representing the requested board.
     * @throws EntityNotFoundException if the board with the specified ID is not found in the database.
     */
    @Override
    public BoardDto getBoardById(String idBoard) {
        return this.boardRepository.findById(idBoard).map(this.boardMapper::toDto).orElseThrow(() -> new EntityNotFoundException("Board not found!"));
    }

    /**
     * Retrieves a list of boards that a specific user is a member of. This method interacts with the BoardRepository to find all Board entities that have a member with the specified user ID, and uses the BoardMapper to convert these entities into BoardDto objects before returning them as a list.
     *
     * @param idUser The unique identifier of the user whose boards are to be retrieved.
     * @return A list of BoardDto objects representing the boards that the specified user is a member of.
     */
    @Override
    public List<BoardDto> getBoardsByUserId(String idUser) {
        return this.boardRepository.findByMembers_User_Id(idUser)
                .stream()
                .map(this.boardMapper::toDto)
                .toList();
    }

    /**
     * Creates a new board and associates it with a user as the owner. This method takes a BoardDto object representing the board to be created, converts it into a Board entity using the BoardMapper, and saves it to the database using the BoardRepository. It then retrieves the User entity corresponding to the specified user ID, creates a new BoardMember entity to represent the ownership relationship between the user and the board, and adds this membership to the board's list of members. Finally, it saves the updated board to the database and returns a BoardDto object representing the newly created board.
     *
     * @param idUser The unique identifier of the user who will be the owner of the newly created board.
     * @param boardDto A BoardDto object containing the details of the board to be created.
     * @return A BoardDto object representing the newly created board.
     * @throws EntityNotFoundException if the user with the specified ID is not found in the database.
     */
    @Override
    public BoardDto createBoard(String idUser, BoardDto boardDto) {
        var board = this.boardMapper.toEntity(boardDto);
        board = this.boardRepository.save(board);
        User user = this.userRepository.findById(idUser)
            .orElseThrow(() -> new EntityNotFoundException("User not found!"));
        BoardMember boardMember = new BoardMember();
        boardMember.setUser(user);
        boardMember.setBoard(board);
        boardMember.setRole(Role.Owner);

        
        List<BoardMember> lBoardMembers = board.getMembers();
        if (lBoardMembers == null) {
            lBoardMembers = new ArrayList<>();
        }

        lBoardMembers.add(boardMember);
        board.setMembers(lBoardMembers);

        return this.boardMapper.toDto(this.boardRepository.save(board));
    }

    /**
     * Updates an existing board with new details. This method retrieves the Board entity corresponding to the specified board ID, updates its title and kanban columns based on the provided BoardDto object, and saves the updated board to the database using the BoardRepository. If the board is not found, an EntityNotFoundException is thrown. The method returns a BoardDto object representing the updated board.
     *
     * @param idBoard The unique identifier of the board to be updated.
     * @param boardDto A BoardDto object containing the new details for the board.
     * @return A BoardDto object representing the updated board.
     * @throws EntityNotFoundException if the board with the specified ID is not found in the database.
     */
    @Override
    public BoardDto updateBoard(String idBoard, BoardDto boardDto) {
        Board boardToUpdate = this.boardRepository.findById(idBoard)
            .orElseThrow(() -> new EntityNotFoundException("Board not found!"));
        boardToUpdate.setTitle(boardDto.getTitle());
        if (boardDto.getKanbanColumns() != null) {
            boardToUpdate.getKanbanColumns().clear();
        
            List<KanbanColumn> newColumns = boardDto.getKanbanColumns().stream()
                .map(this.kanbanColumnMapper::toEntity)
                .toList();
            newColumns.forEach(col -> col.setBoard(boardToUpdate));
        
            boardToUpdate.getKanbanColumns().addAll(newColumns);
        }
        return this.boardMapper.toDto(this.boardRepository.save(boardToUpdate));
    }

    /**
     * Deletes a board from the system. This method checks if a Board entity with the specified ID exists in the database using the BoardRepository, and if it does, it deletes the board and returns true. If the board does not exist, it returns false.
     *
     * @param idBoard The unique identifier of the board to be deleted.
     * @return true if the board was successfully deleted, false if the board was not found in the database.
     */
    @Override
    public Boolean deleteBoard(String idBoard) {
        if (this.boardRepository.existsById(idBoard)) {
            this.boardRepository.deleteById(idBoard);
            return true;
        } else {
            return false;
        }
    }

    /**
     * Creates a new Kanban column and associates it with a specific board. This method takes the unique identifier of the board and a KanbanColumnDto object representing the column to be created, sets the board ID on the column DTO, and delegates the creation of the column to the KanbanColumnService. The method returns a KanbanColumnDto object representing the newly created column.
     *
     * @param idBoard The unique identifier of the board to which the new column will be added.
     * @param kanbanColumnDto A KanbanColumnDto object containing the details of the column to be created.
     * @return A KanbanColumnDto object representing the newly created column.
     */
    @Override
    public KanbanColumnDto createColumnToBoard(String idBoard, KanbanColumnDto kanbanColumnDto) {
        kanbanColumnDto.setIdBoard(idBoard);
        return this.kanbanColumnService.createColumn(kanbanColumnDto);
        
    }

    /**
     * Deletes a Kanban column from a specific board. This method takes the unique identifiers of the board and the column to be deleted, retrieves the Board entity corresponding to the specified board ID, and attempts to remove the column with the specified column ID from the board's list of Kanban columns. If the column is successfully removed, the updated board is saved to the database using the BoardRepository, and the method returns true. If the column is not found in the board's list of columns, it returns false. If the board is not found, an EntityNotFoundException is thrown.
     *
     * @param idBoard The unique identifier of the board from which the column will be deleted.
     * @param idKanbanColumn The unique identifier of the column to be deleted.
     * @return true if the column was successfully deleted from the board, false if the column was not found in the board's list of columns.
     * @throws EntityNotFoundException if the board with the specified ID is not found in the database.
     */
    @Override
    public Boolean deleteColumnToBoard(String idBoard, String idKanbanColumn) {
        Board board = this.boardRepository.findById(idBoard).orElseThrow(() -> new EntityNotFoundException("Board not found!"));

        boolean removed = board.getKanbanColumns().removeIf(column -> 
            column.getId().equals(idKanbanColumn)
        );

        if (removed) {
            this.boardRepository.save(board);
            return removed;
        }

        return removed;
    }

    /**
     * Adds a user to a specific board as a member. This method takes the unique identifier of the board and a UserDto object representing the user to be added, retrieves the Board and User entities corresponding to the specified IDs, and checks if the user is already a member of the board. If the user is not already a member, a new BoardMember entity is created to represent the relationship between the user and the board, with the role set to "Invited". This membership is added to the board's list of members, and both the updated board and the new membership are saved to the database using the BoardRepository and BoardMemberRepository, respectively. The method returns a UserDto object representing the user that was added to the board. If either the board or the user is not found, an EntityNotFoundException is thrown.
     *
     * @param idBoard The unique identifier of the board to which the user will be added.
     * @param userDto A UserDto object containing the details of the user to be added.
     * @return A UserDto object representing the user that was added to the board.
     * @throws EntityNotFoundException if either the board with the specified ID or the user with the specified ID is not found in the database.
     */
    @Override
    public UserDto addUserToBoard(String idBoard, UserDto userDto) {
        Board board = this.boardRepository.findById(idBoard)
            .orElseThrow(() -> new EntityNotFoundException("Board not found!"));

        User user = this.userRepository.findById(userDto.getId())
            .orElseThrow(() -> new EntityNotFoundException("User not found!"));
        
        if (board.getMembers().stream().anyMatch(m -> m.getUser().getId().equals(user.getId()))) {
            return userDto; 
        }

        BoardMember membership = new BoardMember();
        membership.setBoard(board);
        membership.setUser(user);
        membership.setRole(Role.Invited);

        board.getMembers().add(membership);

        this.boardRepository.save(board);
        this.boardMemberRepository.save(membership);

        return userDto;
    }

    /**
     * Removes a user from a specific board. This method takes the unique identifiers of the board and the user to be removed, retrieves the Board entity corresponding to the specified board ID, and attempts to remove the membership associated with the specified user ID from the board's list of members. If the membership is successfully removed, the updated board is saved to the database using the BoardRepository, and the method returns true. If the membership is not found in the board's list of members, it returns false. If the board is not found, an EntityNotFoundException is thrown.
     *
     * @param idBoard The unique identifier of the board from which the user will be removed.
     * @param idUser The unique identifier of the user to be removed from the board.
     * @return true if the user was successfully removed from the board, false if the user's membership was not found in the board's list of members.
     * @throws EntityNotFoundException if the board with the specified ID is not found in the database.
     */
    @Override
    public Boolean delUserToBoard(String idBoard, String idUser) {
        Board board = this.boardRepository.findById(idBoard)
            .orElseThrow(() -> new EntityNotFoundException("Board not found!"));

        System.out.println("Tentative de suppression de l'user : " + idUser);
        System.out.println("Nombre de membres avant : " + board.getMembers().size());

        boolean removed = board.getMembers().removeIf(membership -> {
            String memberId = membership.getUser().getId();
            boolean matches = memberId.equals(idUser);
            if (matches) {
                System.out.println("Match trouvé pour l'utilisateur : " + memberId);
            }
            return matches;
        });

        if (removed) {
            this.boardRepository.save(board);
            System.out.println("Nombre de membres après : " + board.getMembers().size());
        }

        return removed;
    }

}
