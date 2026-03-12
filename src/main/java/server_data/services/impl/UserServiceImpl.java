package server_data.services.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import server_data.dtos.UserDto;
import server_data.entities.User;
import server_data.mappers.UserMapper;
import server_data.repositories.UserRepository;

@Service("UserService")
@Transactional
public class UserServiceImpl {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public UserServiceImpl(UserRepository userRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    public List<UserDto> getAllUsers() {
        return this.userRepository.findAll().stream().map(userMapper::toDto).toList();
    }

    public UserDto getUserById(String idUser) {
        return this.userRepository.findById(idUser).map(this.userMapper::toDto).orElseThrow(() -> new EntityNotFoundException("User not found!"));
    }

    public UserDto getUserByEmail(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        return userMapper.toDto(user);
    }

    public UserDto getUserByUsername(String username) {
        User user = userRepository.findByUsername(username).orElse(null);
        return userMapper.toDto(user);
    }

    public UserDto createUser(UserDto userDTO) {
        var User = this.userMapper.toEntity(userDTO);
        return this.userMapper.toDto(this.userRepository.save(User));
    }

    public UserDto updateUser(String idUser, UserDto userDTO) {
        if (!this.userRepository.existsById(idUser)) throw new EntityNotFoundException(" User not found!");
        var User = this.userMapper.toEntity(userDTO);
        User.setId(idUser);
        return this.userMapper.toDto(this.userRepository.save(User));
    }

    public Boolean deleteUser(String idUser) {
        if (this.userRepository.existsById(idUser)) {
            this.userRepository.deleteById(idUser);
            return true;
        } else {
            return false;
        }

    }
}
