package server_data.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import server_data.dtos.BoardMemberDto;
import server_data.dtos.UserDto;
import server_data.services.UserService;

/**
 * Controller for handling requests related to users.
 */
@RestController
@RequestMapping("/users")
public class UserController {

    /** Service for managing users. */
    private final UserService userService;

    /**
     * Constructor for initializing the user service.
     * @param userService the user service to use
     */
    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Retrieves the list of all users.
     * @return a list of user DTOs
     */
    @GetMapping
    public List<UserDto> getUsers() {
        return this.userService.getAllUsers();
    }

    /**
     * Retrieves a user by their ID.
     * @param idUser the ID of the user to retrieve
     * @return the user DTO
     */
    @GetMapping("/{idUser}")
    public UserDto getUser(@PathVariable String idUser) {
        return this.userService.getUserById(idUser);
    }

    /**
     * Searches for a user by email or username.
     * @param email the email of the user to search for (optional)
     * @param username the username of the user to search for (optional)
     * @return the user DTO if found, null otherwise
     */
    @GetMapping("/search")
    public UserDto searchUser(
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String username) {

        if (email != null && !email.isBlank()) {
            return this.userService.getUserByEmail(email);
        } else if (username != null && !username.isBlank()) {
            return this.userService.getUserByUsername(username);
        }

        return null;
    }

    /**
     * Creates a new user with the provided data.
     * @param userDto the DTO containing the data for the new user
     * @return the created user DTO
     */
    @PostMapping
    public UserDto createUser(final @Valid @RequestBody UserDto userDto) {
        return this.userService.createUser(userDto);
    }

    /**
     * Updates an existing user with the provided data.
     * @param idUser the ID of the user to update
     * @param userDto the DTO containing the updated user data
     * @return the updated user DTO
     */
    @PutMapping("/{idUser}")
    public UserDto updateUser(@PathVariable String idUser, @Valid @RequestBody UserDto userDto) {
        return this.userService.updateUser(idUser, userDto);
    }

    /**
     * Deletes a user by their ID.
     * @param idUser the ID of the user to delete
     * @return true if the user was successfully deleted, false otherwise
     */
    @DeleteMapping("/{idUser}")
    public Boolean deleteUser(@PathVariable String idUser) {
        return this.userService.deleteUser(idUser);
    }

    /**
     * Retrieves the list of invitations for a specific user.
     * @param idUser the ID of the user for whom to retrieve invitations
     * @return a list of board member DTOs representing the invitations for the specified user
     */
    @GetMapping("/{idUser}/invitation")
    public List<BoardMemberDto> getInvitationByUserId(@PathVariable String idUser) {
        return this.userService.getInvitationByUserId(idUser);
    }

    /**
     * Accepts an invitation for a user to join a board.
     * @param idUser the ID of the user accepting the invitation
     * @param idBoard the ID of the board for which the invitation is being accepted
     * @return the board member DTO representing the user's membership in the board after accepting the invitation
     */
    @PutMapping("/{idUser}/invitation/{idBoard}")
    public BoardMemberDto acceptInvitation(@PathVariable String idUser, @PathVariable String idBoard) {
        return this.userService.acceptInvitation(idUser, idBoard);
    }

    /**
     * Rejects an invitation for a user to join a board.
     * @param idUser the ID of the user rejecting the invitation
     * @param idBoard the ID of the board for which the invitation is being rejected
     * @return true if the invitation was successfully rejected, false otherwise
     */
    @DeleteMapping("/{idUser}/invitation/{idBoard}")
    public Boolean rejectInvitation(@PathVariable String idUser, @PathVariable String idBoard) {
        return this.userService.rejectInvitation(idUser, idBoard);
    }

}
