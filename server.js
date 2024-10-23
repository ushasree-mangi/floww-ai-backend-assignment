const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
require('dotenv').config();

const app = express(); 
app.use(express.json());

app.use(cors({
    origin: '*',  // Replace with actual front-end URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
   
}));

const PORT = process.env.PORT || 3000;
const dbPath = path.join(__dirname, "expenseTracker.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(PORT, () => {
      console.log(`Server Running at http://localhost:${PORT}/`);
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();



// Bonus endpoint - register API

app.post("/register/", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      const id = uuidv4();
      const hashedPassword = await bcrypt.hash(password, 10);
      const selectUserQuery = `SELECT * FROM users WHERE username = ?`;
      const dbUser = await db.get(selectUserQuery, [username]);
  
      if (dbUser === undefined) {
        const createUserQuery = `INSERT INTO users (id, username, password) VALUES (?, ?, ?)`;
        await db.run(createUserQuery, [id, username, hashedPassword]);
        res.status(201).json({ message: 'User registered successfully' });
      } else {
        res.status(400).json({ error_msg: "User already exists" });
      }
    } catch (error) {
      res.status(500).json({ error_msg: "An error occurred while registering." });
    }
  });

// Bonus Endpoint Login Api

app.post("/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      const selectUserQuery = `SELECT * FROM users WHERE username = ?`;
      const dbUser = await db.get(selectUserQuery, [username]);
  
      if (dbUser === undefined) {
        res.status(400).json({ error_msg: "Invalid user" });
      } else {
        const isPasswordMatched = await bcrypt.compare(password, dbUser.password);
        if (isPasswordMatched) {
          const payload = { username: username, userId: dbUser.id };
          const jwtToken = jwt.sign(payload, process.env.JWT_SECRET || "MY_SECRET_TOKEN");
          res.status(200).json({ jwt_token: jwtToken });
        } else {
          res.status(400).json({ error_msg: "Invalid Password" });
        }
      }
    } catch (err) {
      res.status(500).json({ error_msg: "An error occurred while login." });
    }
  });
    // Bonus functionality - authentication

    const authenticateToken = (request, response, next) => {
        let jwtToken;
        const authHeader = request.headers["authorization"];
        if (authHeader !== undefined) {
          jwtToken = authHeader.split(" ")[1];
        }
        if (jwtToken === undefined) {
          
          response.status(401).json({error_msg:"missing required token "});
        } else {
          jwt.verify(jwtToken, "MY_SECRET_TOKEN", async (error, payload) => {
            if (error) {
              response.status(400).json({error_msg:"Invalid JWT Token"});
            } else {
             
              request.payload=payload
              next();
      
            }
          });
        }
      };

// 1: Add a New Transaction (POST /transactions)

app.post('/transactions', (req, res) => {
    const { type, category, amount, date, description } = req.body;
  
    if (!type || !category || !amount || !date) {
      return res.status(400).send('Missing required fields');
    }

    const id=uuidv4()
  
    const query = `INSERT INTO transactions (id , type, category, amount, date, description) VALUES (? , ?, ?, ?, ?, ?)`;
    db.run(query, [id , type, category, amount, date, description], function(err) {
      if (err) {
        return res.status(500).send('Error adding transaction');
      }
      res.status(201).send({ id: this.lastID });
    });
  });
  

  // 2 : Get All Transactions (GET /transactions)
  app.get('/transactions', (req, res) => {
    db.all('SELECT * FROM transactions', [], (err, rows) => {
      if (err) {
        return res.status(500).send('Error retrieving transactions');
      }
      res.status(200).json(rows);
    });
  });
  
  // 3: Get a Transaction by ID (GET /transactions/:id )

  app.get('/transactions/:id', (req, res) => {
    const { id } = req.params;
  
    db.get('SELECT * FROM transactions WHERE id = ?', [id], (err, row) => {
      if (err) {
        return res.status(500).send('Error retrieving transaction');
      }
      if (!row) {
        return res.status(404).send('Transaction not found');
      }
      res.status(200).json(row);
    });
  });

  // 4: Update a Transaction by ID (PUT /transactions/:id )

  app.put('/transactions/:id', (req, res) => {
    const { id } = req.params;
    const { type, category, amount, date, description } = req.body;
  
    const query = `
      UPDATE transactions
      SET type = ?, category = ?, amount = ?, date = ?, description = ?
      WHERE id = ?
    `;
  
    db.run(query, [type, category, amount, date, description, id], function(err) {
      if (err) {
        return res.status(500).send('Error updating transaction');
      }
      if (this.changes === 0) {
        return res.status(404).send('Transaction not found');
      }
      res.status(200).send('Transaction updated');
    });
  });

  // 5: Delete a Transaction by ID (DELETE /transactions/:id )

  app.delete('/transactions/:id', (req, res) => {
    const { id } = req.params;
  
    db.run('DELETE FROM transactions WHERE id = ?', [id], function(err) {
      if (err) {
        return res.status(500).send('Error deleting transaction');
      }
      if (this.changes === 0) {
        return res.status(404).send('Transaction not found');
      }
      res.status(200).send('Transaction deleted');
    });
  });

  // 6: Get Summary of Transactions (GET /summary) 

app.get('/summary',  (req, res) => {
    const totalIncomeQuery = 'SELECT SUM(amount) as totalIncome FROM transactions WHERE type = ?';
    const totalExpenseQuery = 'SELECT SUM(amount) as totalExpense FROM transactions WHERE type = ?';
  
    let totalIncome = 0;
    let totalExpense = 0;
  
    // Get total income
    db.get(totalIncomeQuery, ['income'], (err, incomeResult) => {
      if (err) {
        return res.status(500).send('Error retrieving total income');
      }
      totalIncome = incomeResult.totalIncome || 0; // Default to 0 if no income records
  
      // Get total expense
      db.get(totalExpenseQuery, ['expense'], (err, expenseResult) => {
        if (err) {
          return res.status(500).send('Error retrieving total expenses');
        }
        totalExpense = expenseResult.totalExpense || 0; // Default to 0 if no expense records
  
        // Calculate balance
        const balance = totalIncome - totalExpense;
  
        // Respond with the summary
        res.status(200).json({
          totalIncome,
          totalExpense,
          balance
        });
      });
    });
  });
  


  