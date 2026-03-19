package server_data.dtos;

import java.time.LocalDate;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Data Transfer Object for representing a user.
 */
@Data
public class UserDto {

    /**
     * The ID of the user.
     */
    private String id;

    /**
     * The username of the user.
     */
    @NotBlank(message = "The username is required.")
    private String username;

    /**
     * The name of the user.
     */
    @NotBlank(message = "The name is required.")
    private String name;

    /**
     * The last name of the user.
     */
    @NotBlank(message = "The last name is required.")
    private String lastName;

    /**
     * The password of the user.
     */
    private String password;

    /**
     * The email of the user.
     */
    private String email;

    /**
     * The role of the user.
     */
    @NotNull(message = "The role is required.")
    private Integer isAdmin;

    /**
     * The date when the user was created.
     */
    private LocalDate createdAt;

}
