package server_data.services;

import java.util.List;

import server_data.dtos.BoardMemberDto;
import server_data.dtos.UserDto;

/**
 * Service interface for managing User entities and related operations.
 * Defines methods for retrieving, creating, updating, and deleting users, as well as managing user invitations to boards.
 */
public interface UserService {

    /**
     * Retrieves a list of all User entities.
     *
     * @return a list of UserDto objects representing all users
     */
    List<UserDto> getAllUsers();

    /**
     * Retrieves a User entity by its ID.
     *
     * @param idUser the ID of the user to find
     * @return the UserDto object representing the found user, or null if not found
     */
    UserDto getUserById(String idUser);

    /**
     * Retrieves a User entity by its email.
     *
     * @param email the email of the user to find
     * @return the UserDto object representing the found user, or null if not found
     */
    UserDto getUserByEmail(String email);

    /**
     * Retrieves a User entity by its username.
     *
     * @param username the username of the user to find
     * @return the UserDto object representing the found user, or null if not found
     */
    UserDto getUserByUsername(String username);

    /**
     * Creates a new User entity.
     *
     * @param userDto the UserDto object containing the details of the user to create
     * @return the UserDto object representing the created user
     */
    UserDto createUser(UserDto userDto);

    /**
     * Updates an existing User entity identified by its ID with new details.
     *
     * @param idUser the ID of the user to update
     * @param userDto the UserDto object containing the updated details of the user
     * @return the UserDto object representing the updated user, or null if the user was not found
     */
    UserDto updateUser(String idUser, UserDto userDto);

    /**
     * Deletes a User entity identified by its ID.
     *
     * @param idUser the ID of the user to delete
     * @return true if the user was successfully deleted, false otherwise
     */
    Boolean deleteUser(String idUser);

    /**
     * Retrieves a list of board invitations for a specific user ID.
     *
     * @param idUser the ID of the user
     * @return a list of BoardMemberDto objects representing board invitations associated with the given user ID
     */
    List<BoardMemberDto> getInvitationByUserId(String idUser);

    /**
     * Accepts a board invitation for a specific user ID and board ID.
     *
     * @param idUser the ID of the user accepting the invitation
     * @param idBoard the ID of the board for which the invitation is being accepted
     * @return the BoardMemberDto object representing the accepted board membership, or null if the invitation was not found
     */
    BoardMemberDto acceptInvitation(String idUser, String idBoard);

    /**
     * Rejects a board invitation for a specific user ID and board ID.
     *
     * @param idUser the ID of the user rejecting the invitation
     * @param idBoard the ID of the board for which the invitation is being rejected
     * @return true if the invitation was successfully rejected, false otherwise
     */
    Boolean rejectInvitation(String idUser, String idBoard);

}
