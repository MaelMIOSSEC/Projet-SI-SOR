package server_data.controllers;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import server_data.dtos.UserDto;
import server_data.services.UserService;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{idUser}")
    public UserDto getUser(@PathVariable String idUser) {
        return this.userService.getUserById(idUser);
    }

    @PostMapping
    public UserDto createUser(final @RequestBody UserDto userDto) {
        return this.userService.createUser(userDto);
    }

    @PutMapping("/{idUser}")
    public UserDto updateUser(@PathVariable String idUser, @RequestBody UserDto userDto) {
        return this.userService.updateUser(idUser, userDto);
    }

    @DeleteMapping("/{idUser}")
    public Boolean deleteUser(@PathVariable String idUser) {
        return this.userService.deleteUser(idUser);
    }

}
