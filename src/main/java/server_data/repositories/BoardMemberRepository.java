package server_data.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import server_data.entities.BoardMember;
import server_data.entities.BoardMemberId;

public interface BoardMemberRepository extends JpaRepository<BoardMember, BoardMemberId>{

    List<BoardMember> findByUser_Id(String idUser);

}
