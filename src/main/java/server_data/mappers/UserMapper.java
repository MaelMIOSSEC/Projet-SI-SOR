package server_data.mappers;

import org.springframework.stereotype.Component;

import server_data.dtos.UserDto;
import server_data.entities.User;

/**
 * Mapper for converting between User entities and User DTOs.
 */
@Component
public class UserMapper {

    /**
     * Converts a User entity to a User DTO.
     * 
     * @param user The User entity to convert.
     * @return The corresponding User DTO.
     */
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

    /**
     * Converts a User DTO to a User entity.
     * 
     * @param userDto The User DTO to convert.
     * @return The corresponding User entity.
     */
    public User toEntity(UserDto userDto) {
        if (userDto == null) return null;

        User user = new User();
        if (userDto.getId() != null && !userDto.getId().isEmpty()) {
            user.setId(userDto.getId());
        }
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
