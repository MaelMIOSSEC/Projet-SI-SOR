package server_data.services;

import server_data.dtos.UserDto;

public interface UserService {

    UserDto getUserById(String idUser);

    UserDto createUser(UserDto userDto);

    UserDto updateUser(String idUser, UserDto userDto);

    Boolean deleteUser(String idUser);

}
