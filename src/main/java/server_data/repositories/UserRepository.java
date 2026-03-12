package server_data.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import server_data.entities.User;

public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
    
    Optional<User> findByUsername(String username);
}
