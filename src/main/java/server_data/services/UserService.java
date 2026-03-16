package server_data.services;

import java.util.List;

import server_data.dtos.BoardMemberDto;
import server_data.dtos.UserDto;

public interface UserService {

    List<UserDto> getAllUsers();

    UserDto getUserById(String idUser);

    UserDto getUserByEmail(String email);

    UserDto getUserByUsername(String username);

    UserDto createUser(UserDto userDto);

    UserDto updateUser(String idUser, UserDto userDto);

    Boolean deleteUser(String idUser);

    List<BoardMemberDto> getInvitationByUserId(String idUser);

}
