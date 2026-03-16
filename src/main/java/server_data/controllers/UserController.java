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

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<UserDto> getUsers() {
        return this.userService.getAllUsers();
    }

    @GetMapping("/{idUser}")
    public UserDto getUser(@PathVariable String idUser) {
        return this.userService.getUserById(idUser);
    }

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

    @PostMapping
    public UserDto createUser(final @Valid @RequestBody UserDto userDto) {
        return this.userService.createUser(userDto);
    }

    @PutMapping("/{idUser}")
    public UserDto updateUser(@PathVariable String idUser, @Valid @RequestBody UserDto userDto) {
        return this.userService.updateUser(idUser, userDto);
    }

    @DeleteMapping("/{idUser}")
    public Boolean deleteUser(@PathVariable String idUser) {
        return this.userService.deleteUser(idUser);
    }

    @GetMapping("/{idUser}/invitation")
    public List<BoardMemberDto> getInvitationByUserId(@PathVariable String idUser) {
        return this.userService.getInvitationByUserId(idUser);
    }

}
