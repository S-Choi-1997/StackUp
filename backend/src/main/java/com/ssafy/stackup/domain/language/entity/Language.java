package com.ssafy.stackup.domain.language.entity;

import com.ssafy.stackup.domain.board.entity.BoardLanguage;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "language")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class Language {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="language_id")
    private Long id;

    private String name;

    @OneToMany(mappedBy = "language", cascade = CascadeType.ALL, orphanRemoval = true)
    List <BoardLanguage> boardLanguages = new ArrayList<>();
}