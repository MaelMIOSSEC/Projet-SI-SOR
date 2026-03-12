package server_data.dtos;

import java.time.LocalDate;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

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

    @NotBlank(message = "The role required.")
    private Integer isAdmin;

    @NotBlank(message = "The created at date is required.")
    private LocalDate createdAt;

}
