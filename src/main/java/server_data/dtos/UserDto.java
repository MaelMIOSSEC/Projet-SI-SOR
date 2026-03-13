package server_data.dtos;

import java.time.LocalDate;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
public class UserDto {

    private String id;

    @NotBlank(message = "The username is required.")
    private String username;

    @NotBlank(message = "The name is required.")
    private String name;

    @NotBlank(message = "The last name is required.")
    private String lastName;

    @NotBlank(message = "The password is required.")
    private String password;

    @NotBlank(message = "The email is required.")
    private String email;

    @NotNull(message = "The role is required.")
    private Integer isAdmin;

    private LocalDate createdAt;

}
