package com.gowtham.todos.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gowtham.todos.entity.Todo;
import com.gowtham.todos.repository.TodoRepository;
import com.gowtham.todos.service.OpenAIService;
import com.gowtham.todos.service.SlackService;

@RestController
@RequestMapping("/api/todos")
@CrossOrigin(origins = "http://localhost:3000") // Allow React frontend
public class TodoController {

    @Autowired
    private TodoRepository todoRepository;

    // GET all todos
    @GetMapping
    public List<Todo> getAllTodos() {
        return todoRepository.findAll();
    }

    // POST new todo
    @PostMapping
    public Todo createTodo(@RequestBody Todo todo) {
        return todoRepository.save(todo);
    }
    
    // PUT update todo
    @PutMapping("/{id}")
    public Todo updateTodo(@PathVariable Integer id, @RequestBody Todo todoDetails) {
        return todoRepository.findById(id)
            .map(todo -> {
                todo.setTitle(todoDetails.getTitle());
                todo.setDescription(todoDetails.getDescription());
                return todoRepository.save(todo);
            })
            .orElseThrow(() -> new RuntimeException("Todo not found with id: " + id));
    }

    // PATCH update completion status
    @PatchMapping("/{id}")
    public Todo toggleComplete(@PathVariable Integer id) {
        return todoRepository.findById(id)
            .map(todo -> {
                todo.setCompleted(!todo.isCompleted());
                return todoRepository.save(todo);
            })
            .orElseThrow(() -> new RuntimeException("Todo not found with id: " + id));
    }

    // DELETE todo
    @DeleteMapping("/{id}")
    public void deleteTodo(@PathVariable Integer id) {
        todoRepository.deleteById(id);
    }
    
    @Autowired
    private OpenAIService openAIService;
//
//    @PostMapping("/summarize")
//    public String summarizeTodos() {
//        List<Todo> pendingTodos = todoRepository.findByCompletedFalse();
//        return openAIService.summarizeTodos(pendingTodos);
//    }
    
    @Autowired
    private SlackService slackService;

    @PostMapping("/summarize")
    public ResponseEntity<String> summarizeAndSendToSlack() {
        try {
            List<Todo> pendingTodos = todoRepository.findByCompletedFalse();
            String summary = openAIService.summarizeTodos(pendingTodos);
            slackService.sendToSlack(summary);
            return ResponseEntity.ok("Summary sent to Slack!");
        } catch (Exception e) {
            return ResponseEntity.status(429).body("Too many requests. Wait 1 minute and try again.");
        }
    }
}
