package server_data.tests;


import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import server_data.mappers.BoardMapper;
import server_data.repositories.BoardRepository;
import server_data.services.impl.BoardServiceImpl;

import org.hibernate.validator.constraints.ModCheck;
import org.junit.jupiter.api.Test;

@ExtendWith(MockitoExtension.class)
public class BoardServiceImplTest {

    @Mock
    private BoardRepository boardRepository;

    @Mock
    private BoardMapper boardMapper;

    @InjectMocks
    private BoardServiceImpl boardServiceImpl;

    @Test 
    void getBoardById1() {
    }



}
