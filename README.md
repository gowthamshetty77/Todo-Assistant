# Todo Summary Assistant


A full-stack application that helps users manage todos, generate AI-powered summaries using LLMs, and send them to Slack channels.

**Developed By:** Gowtham P

## ✨ Features

- **Todo Management**
  - Create todos with title & description
  - Edit existing todos
  - Delete todos
  - Mark todos as complete/incomplete
- **AI Integration**
  - Generate meaningful summaries using OpenAI
  - Process pending todos only
- **Slack Integration**
  - Send generated summaries to Slack channel
  - Real-time success/failure notifications
- **Responsive UI**
  - Clean and intuitive interface
  - Form validations
  - Error handling

## 🛠 Tech Stack

**Frontend**
- React.js
- Axios (HTTP client)
- CSS3

**Backend**
- Java Spring Boot
- Spring Data JPA
- MySQL Database
- OpenAI API
- Slack Webhook

**Tools**
- Lombok
- Postman (API testing)
- Maven (Build tool)

## 🚀 Installation

### Prerequisites
- Java JDK 17+
- Node.js 16+
- MySQL 8+
- OpenAI API key
- Slack workspace with webhook URL

### Frontend Setup

1. Clone repository
bash
git clone https://github.com/yourusername/todo-summary-assistant.git
cd todo-summary-assistant/frontend

- Install dependencies
npm install

npm start

Backend Setup
Navigate to backend directory

bash
cd todo-summary-assistant/backend
Configure MySQL

sql
CREATE DATABASE todolist;

- Update application properties

# src/main/resources/application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/todo_db
spring.datasource.username=todo_user
spring.datasource.password=password
Build and run

mvn spring-boot:run
⚙ Configuration
Environment Variables
Frontend (.env)

env
REACT_APP_API_URL=http://localhost:8080/api
Backend (application.properties)

properties
openai.api.key=your_openai_key
slack.webhook.url=your_slack_webhook_url
Required Services
Slack Webhook

Create incoming webhook at Slack API

OpenAI API

Get API key from OpenAI Dashboard

🏃♀️ Running the Application
Start backend server

cd backend && mvn spring-boot:run
Start frontend

cd frontend && npm start
Access application at:

bash
http://localhost:3000
📂 Project Structure
todo-summary-assistant/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── .env
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/
│   │       │       └── todo/
│   │       │           ├── controller/
│   │       │           ├── model/
│   │       │           ├── repository/
│   │       │           └── service/
│   │       └── resources/
│   │           └── application.properties
│   └── pom.xml
│
├── .gitignore
└── README.md


🔧 Troubleshooting
Common Issues

Connection Refused Error

Ensure backend is running on port 8080

Check CORS configuration

Slack Integration Failure

Verify webhook URL validity

Check Slack channel permissions

OpenAI API Errors

Confirm API key validity

Monitor rate limits (3 requests/minute on free tier)

- Error Messages

429 Too Many Requests -> Wait 1 minute before retrying
500 Internal Server Error -> Check server logs
401 Unauthorized -> Verify API keys

** Best regards **,
Gowtham P

# Thank you for checking out Todo Summary Assistant!
