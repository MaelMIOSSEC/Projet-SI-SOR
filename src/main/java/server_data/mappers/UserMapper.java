package server_data.mappers;

import org.springframework.stereotype.Component;

import server_data.dtos.UserDto;
import server_data.entities.User;

@Component
public class UserMapper {

    public UserDto toDto(User user) {
        if (user == null) return null;

        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setUsername(user.getUsername());
        userDto.setName(user.getName());
        userDto.setLastName(user.getLastName());
        userDto.setPassword(user.getPassword());
        userDto.setEmail(user.getEmail());
        userDto.setIsAdmin(user.getIsAdmin());
        userDto.setCreatedAt(user.getCreatedAt());

        return userDto;
    }

    public User toEntity(UserDto userDto) {
        if (userDto == null) return null;

        User user = new User();
        if (userDto.getId() != "") user.setId(userDto.getId());
        user.setId(userDto.getId());
        user.setUsername(userDto.getUsername());
        user.setName(userDto.getName());
        user.setLastName(userDto.getLastName());
        user.setPassword(userDto.getPassword());
        user.setEmail(userDto.getEmail());
        user.setIsAdmin(userDto.getIsAdmin());
        user.setCreatedAt(userDto.getCreatedAt());

        return user;
    }

}
