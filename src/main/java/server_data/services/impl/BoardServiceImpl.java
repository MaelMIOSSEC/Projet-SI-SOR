package server_data.services.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import server_data.dtos.BoardDto;
import server_data.dtos.KanbanColumnDto;
import server_data.dtos.UserDto;
import server_data.entities.Board;
import server_data.entities.KanbanColumn;
import server_data.mappers.BoardMapper;
import server_data.mappers.KanbanColumnMapper;
import server_data.repositories.BoardRepository;
import server_data.services.BoardService;
import server_data.services.KanbanColumnService;

@Service("BoardService")
@Transactional
public class BoardServiceImpl implements BoardService{

    private final KanbanColumnService kanbanColumnService;
    private final KanbanColumnMapper kanbanColumnMapper;
    private final BoardRepository boardRepository;
    private final BoardMapper boardMapper;

    public BoardServiceImpl(BoardRepository boardRepository, BoardMapper boardMapper, KanbanColumnService kanbanColumnService, KanbanColumnMapper kanbanColumnMapper) {
        this.boardRepository = boardRepository;
        this.boardMapper = boardMapper;
        this.kanbanColumnService = kanbanColumnService;
        this.kanbanColumnMapper = kanbanColumnMapper;
    }

    @Override
    public List<BoardDto> getAllBoard() {
        return this.boardRepository.findAll().stream().map(this.boardMapper::toDto).toList();
    }

    @Override
    public BoardDto getBoardById(String idBoard) {
        return this.boardRepository.findById(idBoard).map(this.boardMapper::toDto).orElseThrow(() -> new EntityNotFoundException("Board not found!"));
    }

    @Override
    public BoardDto createBoard(BoardDto boardDto) {
        var board = this.boardMapper.toEntity(boardDto);
        return this.boardMapper.toDto(this.boardRepository.save(board));
    }

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

    @Override
    public Boolean deleteBoard(String idBoard) {
        if (this.boardRepository.existsById(idBoard)) {
            this.boardRepository.deleteById(idBoard);
            return true;
        } else {
            return false;
        }
    }

    @Override
    public KanbanColumnDto createColumnToBoard(String idBoard, KanbanColumnDto kanbanColumnDto) {
        kanbanColumnDto.setIdBoard(idBoard);
        return this.kanbanColumnService.createColumn(kanbanColumnDto);
        
    }

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

    @Override
    public UserDto addUserToBoard(String idBoard, UserDto userDto) {
        BoardDto boardDto = this.boardRepository.findById(idBoard).map(this.boardMapper::toDto).orElseThrow(() -> new EntityNotFoundException("Board not found!"));
        if (boardDto.getMembers().contains(userDto)) return null;

        List<UserDto> lUserDto = boardDto.getMembers();
        lUserDto.add(userDto);
        boardDto.setMembers(lUserDto);
        var board = this.boardMapper.toEntity(boardDto);
        this.boardMapper.toDto(this.boardRepository.save(board));
        return userDto;
    }

    @Override
    public Boolean delUserToBoard(String idBoard, String idUser) {
        Board board = this.boardRepository.findById(idBoard).orElseThrow(() -> new EntityNotFoundException("Board not found!"));

        boolean remove = board.getMembers().removeIf(user ->
            user.getId().equals(idUser)
        );

        if (remove) {
            this.boardRepository.save(board);
            return remove;
        }

        return remove;
    }

}
