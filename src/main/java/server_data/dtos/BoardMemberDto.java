package server_data.dtos;

import server_data.entities.Role;

import lombok.Data;

@Data
public class BoardMemberDto {

    private UserDto userDto;
    private Role role;
}
