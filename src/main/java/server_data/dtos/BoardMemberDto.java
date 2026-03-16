package server_data.dtos;

import javax.management.relation.Role;

import lombok.Data;

@Data
public class BoardMemberDto {

    private UserDto userDto;
    private Role role;
}
