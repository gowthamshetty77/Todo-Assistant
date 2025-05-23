package com.gowtham.todos.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class SlackService {

 @Value("${slack.webhook.url}")
 private String webhookUrl;

 public void sendToSlack(String summary) {
     RestTemplate restTemplate = new RestTemplate();
     HttpHeaders headers = new HttpHeaders();
     headers.setContentType(MediaType.APPLICATION_JSON);

     String payload = "{\"text\":\"" + summary + "\"}";
     restTemplate.postForEntity(webhookUrl, new HttpEntity<>(payload, headers), String.class);
 }
}
