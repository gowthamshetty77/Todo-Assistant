-- ********** TodoList Project **********
-- Gowtham

-- Create database for todolist project
CREATE DATABASE TODOLIST;

USE TODOLIST;

CREATE TABLE `todo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `completed` bit(1) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci