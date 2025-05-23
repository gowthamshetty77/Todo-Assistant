package com.gowtham.todos.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gowtham.todos.entity.Todo;

public interface TodoRepository extends JpaRepository<Todo, Integer> {

	List<Todo> findByCompletedFalse();

}
