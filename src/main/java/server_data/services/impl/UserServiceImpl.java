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

/**
 * The UserServiceImpl class provides the implementation of the UserService interface, which defines the operations related to managing users in the application. This service interacts with the UserRepository to perform CRUD operations on User entities, uses the UserMapper to convert between User entities and UserDto objects, and also interacts with BoardMemberRepository and BoardMemberMapper to manage user invitations to boards. The class is annotated with @Service to indicate that it is a Spring service component, and @Transactional to ensure that database operations are executed within a transaction context.
 */
@Service("UserService")
@Transactional
public class UserServiceImpl implements UserService {

    /**
     * The repository for managing User entities in the database. This repository provides methods for performing CRUD operations on users, and is used by the UserServiceImpl to interact with the database layer when creating, updating, retrieving, and deleting users.
     */
    private final BoardMemberRepository boardMemberRepository;

    /**
     * The mapper for converting between BoardMember entities and BoardMemberDto objects. This mapper is used to facilitate the transformation of data between the database layer and the service layer, allowing for clean and maintainable code when handling user invitations to boards within the application.
     */
    private final BoardMemberMapper boardMemberMapper;

    /**
     * The repository for managing Board entities in the database. This repository provides methods for performing CRUD operations on boards, and is used by the UserServiceImpl to interact with the database layer when managing the relationship between users and their associated boards.
     */
    private final UserRepository userRepository;

    /**
     * The mapper for converting between User entities and UserDto objects. This mapper is used to facilitate the transformation of data between the database layer and the service layer, allowing for clean and maintainable code when handling user data within the application.
     */
    private final UserMapper userMapper;

    /**
     * Constructs a new UserServiceImpl with the specified UserRepository, UserMapper, BoardMemberRepository, BoardMemberMapper, and BoardRepository. This constructor is used for dependency injection, allowing the Spring framework to provide the necessary components for the service to function properly.
     *
     * @param userRepository The repository for managing User entities in the database.
     * @param userMapper The mapper for converting between User entities and UserDto objects.
     * @param boardMemberRepository The repository for managing BoardMember entities in the database.
     * @param boardMemberMapper The mapper for converting between BoardMember entities and BoardMemberDto objects.
     * @param boardRepository The repository for managing Board entities in the database.
     */
    public UserServiceImpl(UserRepository userRepository, UserMapper userMapper, BoardMemberRepository boardMemberRepository, BoardMemberMapper boardMemberMapper, BoardRepository boardRepository) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.boardMemberRepository = boardMemberRepository;
        this.boardMemberMapper = boardMemberMapper;
    }

    /**
     * Retrieves a list of all users in the system. This method interacts with the UserRepository to find all User entities in the database, and uses the UserMapper to convert these entities into UserDto objects before returning them as a list.
     *
     * @return A list of UserDto objects representing all users in the system.
     */
    @Override
    public List<UserDto> getAllUsers() {
        return this.userRepository.findAll().stream().map(userMapper::toDto).toList();
    }

    /**
     * Retrieves a user by their unique identifier. This method interacts with the UserRepository to find a User entity that matches the specified idUser, and uses the UserMapper to convert this entity into a UserDto object before returning it. If no user is found with the specified ID, an EntityNotFoundException is thrown.
     *
     * @param idUser The unique identifier of the user to be retrieved.
     * @return A UserDto object representing the user with the specified ID.
     * @throws EntityNotFoundException if no user is found with the specified ID in the database.
     */
    @Override
    public UserDto getUserById(String idUser) {
        return this.userRepository.findById(idUser).map(this.userMapper::toDto).orElseThrow(() -> new EntityNotFoundException("User not found!"));
    }

    /**
     * Retrieves a user by their email address. This method interacts with the UserRepository to find a User entity that matches the specified email, and uses the UserMapper to convert this entity into a UserDto object before returning it. If no user is found with the specified email, null is returned.
     *
     * @param email The email address of the user to be retrieved.
     * @return A UserDto object representing the user with the specified email, or null if no user is found.
     */
    @Override
    public UserDto getUserByEmail(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        return userMapper.toDto(user);
    }

    /**
     * Retrieves a user by their username. This method interacts with the UserRepository to find a User entity that matches the specified username, and uses the UserMapper to convert this entity into a UserDto object before returning it. If no user is found with the specified username, null is returned.
     *
     * @param username The username of the user to be retrieved.
     * @return A UserDto object representing the user with the specified username, or null if no user is found.
     */
    @Override
    public UserDto getUserByUsername(String username) {
        User user = userRepository.findByUsername(username).orElse(null);
        return userMapper.toDto(user);
    }

    /**
     * Creates a new user based on the provided UserDto object. This method converts the UserDto into a User entity using the UserMapper, sets the creation date on the User entity, and saves the new user to the database using the UserRepository. The method then converts the saved User entity back into a UserDto and returns it.
     *
     * @param userDTO A UserDto object containing the details of the user to be created.
     * @return A UserDto object representing the newly created user.
     */
    @Override
    public UserDto createUser(UserDto userDTO) {
        var user = this.userMapper.toEntity(userDTO);
        user.setCreatedAt(LocalDate.now());
        return this.userMapper.toDto(this.userRepository.save(user));
    }

    /**
     * Updates an existing user with new information. This method takes the unique identifier of the user to be updated and a UserDto object containing the updated information. It retrieves the existing User entity from the database, updates its properties based on the provided UserDto, and saves the updated entity back to the database using the UserRepository. The method then converts the updated User entity into a UserDto object and returns it. If no user is found with the specified ID, an EntityNotFoundException is thrown.
     *
     * @param idUser The unique identifier of the user to be updated.
     * @param userDTO A UserDto object containing the updated information for the user.
     * @return A UserDto object representing the updated user.
     * @throws EntityNotFoundException if no user is found with the specified ID in the database.
     */
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

    /**
     * Deletes a user by their unique identifier. This method checks if a user with the specified ID exists in the database, and if so, removes it using the UserRepository. The method returns a Boolean indicating whether the deletion was successful.
     *
     * @param idUser The unique identifier of the user to be deleted.
     * @return A Boolean indicating whether the deletion was successful.
     */
    @Override
    public Boolean deleteUser(String idUser) {
        if (this.userRepository.existsById(idUser)) {
            this.userRepository.deleteById(idUser);
            return true;
        } else {
            return false;
        }

    }

    /**
     * Retrieves a list of board invitations for a specific user. This method interacts with the BoardMemberRepository to find all BoardMember entities that have a user ID matching the specified idUser, and uses the BoardMemberMapper to convert these entities into BoardMemberDto objects before returning them as a list.
     *
     * @param idUser The unique identifier of the user for whom board invitations are to be retrieved.
     * @return A list of BoardMemberDto objects representing the board invitations for the specified user.
     */
    @Override
    public List<BoardMemberDto> getInvitationByUserId(String idUser) {
        return this.boardMemberRepository.findByUser_Id(idUser).stream().map(this.boardMemberMapper::toDto).toList();
    }

    /**
     * Accepts an invitation for a user to join a specific board. This method takes the unique identifier of the user and the unique identifier of the board, retrieves the corresponding BoardMember entity from the database, updates its role to "Member", and saves the updated entity back to the database using the BoardMemberRepository. The method then converts the updated BoardMember entity into a BoardMemberDto object and returns it. If no invitation is found for the specified user and board, an EntityNotFoundException is thrown.
     *
     * @param idUser The unique identifier of the user accepting the invitation.
     * @param idBoard The unique identifier of the board for which the invitation is being accepted.
     * @return A BoardMemberDto object representing the updated board member after accepting the invitation.
     * @throws EntityNotFoundException if no invitation is found for the specified user and board in the database.
     */
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

    /**
     * Rejects an invitation for a user to join a specific board. This method takes the unique identifier of the user and the unique identifier of the board, checks if a corresponding BoardMember entity exists in the database, and if so, deletes it using the BoardMemberRepository. The method returns a Boolean indicating whether the rejection was successful.
     *
     * @param idUser The unique identifier of the user rejecting the invitation.
     * @param idBoard The unique identifier of the board for which the invitation is being rejected.
     * @return A Boolean indicating whether the rejection was successful.
     */
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
