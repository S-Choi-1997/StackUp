package com.ssafy.stackup.domain.framework.repository;

import com.ssafy.stackup.domain.framework.entity.Framework;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FrameworkRepository extends JpaRepository<Framework, Long> {

    List<Framework> findAllByOrderByIdDesc();

    @Query("SELECT f FROM Framework f JOIN FETCH BoardFramework bf ON f.id = bf.framework.id WHERE bf.board.boardId = :boardId")
    List<Framework> findFrameworksByBoardId(@Param("boardId") Long boardId);
}
