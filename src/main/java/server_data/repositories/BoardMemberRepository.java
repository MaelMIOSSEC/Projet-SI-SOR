package server_data.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import server_data.entities.BoardMember;
import server_data.entities.BoardMemberId;

public interface BoardMemberRepository extends JpaRepository<BoardMember, BoardMemberId>{

}
