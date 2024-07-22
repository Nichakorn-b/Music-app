# Online Music Subscription Application
## Overview
The Online Music Subscription Application is a cloud-based web application that allows users to query, subscribe, and manage music subscriptions. The application leverages various AWS services to ensure a seamless, secure, and scalable user experience.

![image](https://github.com/user-attachments/assets/aa96cb70-c489-4b4c-9fd7-1ddc0ac40e41)


## Features
- **User Authentication and Registratio**n: Secure login and registration system with credential storage in DynamoDB.
- **Music Subscription Management**: Allows users to query music by title, artist, or year, and manage their subscriptions.
- **Real-time Updates**: Artist images stored in S3 with real-time subscription updates.
- **Secure API Endpoints**: API endpoints secured using API keys to ensure only authorized access.
- **Responsive Design**: Built using React and Bootstrap for a responsive and intuitive user interface.
- **Serverless Functions**: User login, registration, and subscription management are handled through AWS Lambda functions.

## Technologies Used
### Frontend:
- React
- Bootstrap
### Backend:
- AWS S3
- AWS API Gateway
- AWS Lambda
- AWS DynamoDB
- AWS Amplify

## Getting Started
### Prerequisites
- Node.js
- AWS Account with configured services (S3, API Gateway, Lambda, DynamoDB)
### Installation
- npm install
- npm i react-router-dom
- npm install bootstrap
- npm install axios
- npm install react-bootstrap bootstrap
### Running the Application
- npm start

## Usage
- **Login**: Navigate to the login page and enter your credentials to log in.
- **Register**: If you don't have an account, navigate to the registration page and create a new account.
- **Manage Subscriptions**: After logging in, use the homepage to query and manage your music subscriptions.


