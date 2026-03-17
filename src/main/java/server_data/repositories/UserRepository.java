package server_data.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import server_data.entities.User;

/**
 * Repository interface for managing User entities.
 * Extends JpaRepository to provide CRUD operations and custom query methods.
 */
public interface UserRepository extends JpaRepository<User, String> {

    /**
     * Finds a User entity by its email address.
     *
     * @param email the email address of the user to find
     * @return an Optional containing the User entity if found, or empty if not found
     */
    Optional<User> findByEmail(String email);
    
    /**
     * Finds a User entity by its username.
     *
     * @param username the username of the user to find
     * @return an Optional containing the User entity if found, or empty if not found
     */
    Optional<User> findByUsername(String username);
}
