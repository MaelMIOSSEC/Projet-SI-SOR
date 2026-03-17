package server_data.services.impl;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import server_data.dtos.BoardDto;
import server_data.entities.Board;
import server_data.entities.BoardMember;
import server_data.entities.BoardMemberId;
import server_data.dtos.BoardMemberDto;
import server_data.dtos.UserDto;
import server_data.entities.Role;
import server_data.entities.User;
import server_data.mappers.BoardMemberMapper;
import server_data.mappers.UserMapper;
import server_data.repositories.BoardMemberRepository;
import server_data.repositories.BoardRepository;
import server_data.repositories.UserRepository;
import server_data.services.UserService;

@Service("UserService")
@Transactional
public class UserServiceImpl implements UserService {

    private final BoardMemberRepository boardMemberRepository;
    private final BoardMemberMapper boardMemberMapper;
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final BoardRepository boardRepository;

    public UserServiceImpl(UserRepository userRepository, UserMapper userMapper, BoardMemberRepository boardMemberRepository, BoardMemberMapper boardMemberMapper, BoardRepository boardRepository) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.boardMemberRepository = boardMemberRepository;
        this.boardMemberMapper = boardMemberMapper;
        this.boardRepository = boardRepository;
    }

    @Override
    public List<UserDto> getAllUsers() {
        return this.userRepository.findAll().stream().map(userMapper::toDto).toList();
    }

    @Override
    public UserDto getUserById(String idUser) {
        return this.userRepository.findById(idUser).map(this.userMapper::toDto).orElseThrow(() -> new EntityNotFoundException("User not found!"));
    }

    @Override
    public UserDto getUserByEmail(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        return userMapper.toDto(user);
    }

    @Override
    public UserDto getUserByUsername(String username) {
        User user = userRepository.findByUsername(username).orElse(null);
        return userMapper.toDto(user);
    }

    @Override
    public UserDto createUser(UserDto userDTO) {
        var user = this.userMapper.toEntity(userDTO);
        user.setCreatedAt(LocalDate.now());
        return this.userMapper.toDto(this.userRepository.save(user));
    }

    @Override
    public UserDto updateUser(String idUser, UserDto userDTO) {
        User userToUpdate = this.userRepository.findById(idUser)
            .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + idUser));
        userToUpdate.setUsername(userDTO.getUsername());
        userToUpdate.setName(userDTO.getName());
        userToUpdate.setLastName(userDTO.getLastName());
        userToUpdate.setEmail(userDTO.getEmail());

        if (userDTO.getPassword() != null && !userDTO.getPassword().isBlank()) {
            userToUpdate.setPassword(userDTO.getPassword());
        }
    
        userToUpdate.setIsAdmin(userDTO.getIsAdmin());

        return this.userMapper.toDto(this.userRepository.save(userToUpdate));
    }

    @Override
    public Boolean deleteUser(String idUser) {
        if (this.userRepository.existsById(idUser)) {
            this.userRepository.deleteById(idUser);
            return true;
        } else {
            return false;
        }

    }

    @Override
    public List<BoardMemberDto> getInvitationByUserId(String idUser) {
        return this.boardMemberRepository.findByUser_Id(idUser).stream().map(this.boardMemberMapper::toDto).toList();
    }

    @Override
    public BoardMemberDto acceptInvitation(String idUser, String idBoard) {
        BoardMemberId boardMemberId = new BoardMemberId();
        boardMemberId.setUser(idUser);
        boardMemberId.setBoard(idBoard);

        var memberOpt = this.boardMemberRepository.findById(boardMemberId);
        if (memberOpt.isEmpty()) {
            throw new EntityNotFoundException("Invitation introuvable pour cet utilisateur et ce tableau");
        }

        BoardMember member = memberOpt.get();
        member.setRole(Role.Member);

        BoardMember updatedMember = this.boardMemberRepository.save(member);

        return this.boardMemberMapper.toDto(updatedMember);
    }

    @Override
    public Boolean rejectInvitation(String idUser, String idBoard) {
        BoardMemberId boardMemberId = new BoardMemberId();
        boardMemberId.setUser(idUser);
        boardMemberId.setBoard(idBoard);
        if (this.boardMemberRepository.existsById(boardMemberId)) {
            this.boardMemberRepository.deleteById(boardMemberId);
            return true;
        }
        return false;
    }
}
