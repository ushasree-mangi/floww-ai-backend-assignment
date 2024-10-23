# floww-ai-backend-assignment
# Expense Tracker Backend

This is a backend application for an expense tracker built using Node.js, Express.js, SQLite, and JWT for authentication. The application allows users to register, log in, and manage their financial transactions.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
- [API Endpoints](#api-endpoints)
  - [User Registration](#user-registration)
  - [User Login](#user-login)
  - [Transactions](#transactions)
    - [Add a New Transaction](#add-a-new-transaction)
    - [Get All Transactions](#get-all-transactions)
    - [Get a Transaction by ID](#get-a-transaction-by-id)
    - [Update a Transaction by ID](#update-a-transaction-by-id)
    - [Delete a Transaction by ID](#delete-a-transaction-by-id)
  - [Transaction Summary](#transaction-summary)
- [Authentication](#authentication)
- [Database Structure](#database-structure)
- [Deployment Link](#deployment-link)
- [License](#license)

## Features

- User registration and authentication
- Create, read, update, and delete (CRUD) transactions
- Summary of income and expenses

## Technologies Used

- Node.js
- Express.js
- SQLite


## Setup and Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ushasree-mangi/floww-ai-backend-assignment.git


2.  **Navigate to the Project Directory**:
    
    
    
    run the below command  :
    
    `cd floww-ai-backend-assignment` 
    
3.  **Install Required Packages**:
    
    run the below command:
    
    `npm install` 
    
 
    
5.  **Run the Application**:
    
    run the below command :
    
    `node server.js` 
    
    The server will start on `http://localhost:3000`.
    

## API Endpoints

### User Registration

-   **Endpoint**: `POST /register`
-   **Description**: Register a new user.
-   **Request Body**:
    
    
    
    `{
      "username": "your_username",
      "password": "your_password"
    }` 
    
-   **Responses**:
    -   `201`: User registered successfully.
    -   `400`: User already exists or missing required fields.

### User Login

-   **Endpoint**: `POST /login`
-   **Description**: Log in an existing user.
-   **Request Body**:
    
   
    
    `{
      "username": "your_username",
      "password": "your_password"
    }` 
    
-   **Responses**:
    -   `200`: JWT token returned upon successful login.
    -   `400`: Invalid user or password.

### Transactions

#### Add a New Transaction

-   **Endpoint**: `POST /transactions`
-   **Description**: Add a new transaction.
-   **Request Body**:
    
    
    `{
      "type": "income or expense",
      "category": "category_name",
      "amount": amount,
      "date": "YYYY-MM-DD",
      "description": "description of the transaction"
    }` 
    
-   **Responses**:
    -   `201`: Transaction added successfully.
    -   `400`: Missing required fields.

#### Get All Transactions

-   **Endpoint**: `GET /transactions`
-   **Description**: Retrieve all transactions.
-   **Responses**:
    -   `200`: List of transactions.

#### Get a Transaction by ID

-   **Endpoint**: `GET /transactions/:id`
-   **Description**: Retrieve a specific transaction by ID.
-   **Responses**:
    -   `200`: Transaction details.
    -   `404`: Transaction not found.

#### Update a Transaction by ID

-   **Endpoint**: `PUT /transactions/:id`
-   **Description**: Update a specific transaction by ID.
-   **Request Body**:
  
    
    `{
      "type": "income or expense",
      "category": "category_name",
      "amount": amount,
      "date": "YYYY-MM-DD",
      "description": "description of the transaction"
    }` 
    
-   **Responses**:
    -   `200`: Transaction updated successfully.
    -   `404`: Transaction not found.

#### Delete a Transaction by ID

-   **Endpoint**: `DELETE /transactions/:id`
-   **Description**: Delete a specific transaction by ID.
-   **Responses**:
    -   `200`: Transaction deleted successfully.
    -   `404`: Transaction not found.

### Transaction Summary

-   **Endpoint**: `GET /summary`
-   **Description**: Get the summary of transactions, including total income, total expenses, and balance.
-   **Responses**:
    -   `200`: Summary details.

## Authentication

The application uses JWT for user authentication. A token is generated upon successful login and must be included in the `Authorization` header for protected routes.

### Example Header for Requests:



`Authorization: Bearer your_jwt_token` 

## Database Structure

The application uses an SQLite database with the following tables:

-   **users**
    
    -   `id`: Unique identifier for the user.
    -   `username`: Username of the user.
    -   `password`: Hashed password.
-   **transactions**
    
    -   `id`: Unique identifier for the transaction.
    -   `type`: Type of transaction (income or expense).
    -   `category`: Category of the transaction.
    -   `amount`: Amount of the transaction.
    -   `date`: Date of the transaction.
    -   `description`: Description of the transaction.

## Deployment Link 
  https://floww-ai-backend-assignment.onrender.com

  -   Test the APIs by adding endpoint to the deployment link.
