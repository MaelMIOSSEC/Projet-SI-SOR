package server_data.entities;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

/**
 * Represents a user in the Kanban application.
 * Each user has a unique ID, username, name, last name, password, email, admin status, and creation date.
 */
@Entity
@Table(name = "\"User\"")
@Data
public class User {

    /**
     * Unique identifier for the user, generated as a UUID.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "user_id")
    private String id;

    /**
     * Username of the user, used for authentication.
     */
    @Column(name = "username")
    private String username;

    /**
     * First name of the user.
     */
    @Column(name = "name")
    private String name;

    /**
     * Last name of the user.
     */
    @Column(name = "last_name")
    private String lastName;

    /**
     * Password of the user, used for authentication.
     */
    @Column(name = "password")
    private String password;

    /**
     * Email address of the user.
     */
    @Column(name = "email")
    private String email;

    /**
     * Admin status of the user, where 1 indicates an admin and 0 indicates a regular user.
     */
    @Column(name = "is_admin")
    private Integer isAdmin;

    /**
     * The timestamp when the user account was created.
     */
    @Column(name = "created_at")
    private LocalDate createdAt;

}
