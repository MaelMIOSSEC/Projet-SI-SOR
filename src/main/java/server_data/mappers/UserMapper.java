package server_data.mappers;

import org.springframework.stereotype.Component;

import server_data.dtos.UserDto;
import server_data.entities.User;

@Component
public class UserMapper {

    public UserDto toDto(User user) {
        if (user == null) return null;

        return new UserDto();
    }

    public User toEntity(UserDto userDto) {
        if (userDto == null) return null;

        return new User();
    }

}
