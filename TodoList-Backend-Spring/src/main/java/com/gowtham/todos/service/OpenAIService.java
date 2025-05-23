package com.gowtham.todos.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.gowtham.todos.entity.Todo;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatCompletionResult;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.service.OpenAiService;

@Service
public class OpenAIService {

	 @Value("${openai.api.key}")
	 private String apiKey;

	 public String summarizeTodos(List<Todo> todos) {
	     OpenAiService service = new OpenAiService(apiKey);
	     String prompt = "Summarize these pending tasks in a concise, actionable way: " + todos.toString();
	
	     ChatCompletionRequest request = ChatCompletionRequest.builder()
	             .model("gpt-3.5-turbo")
	             .messages(List.of(new ChatMessage("user", prompt)))
	             .build();
	
	     ChatCompletionResult result = service.createChatCompletion(request);
	     return result.getChoices().get(0).getMessage().getContent();
	 }
	 
}
