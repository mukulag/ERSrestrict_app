const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const AppModel = require('./models/Application')
const FrequencyModel = require('./models/Frequency')
const EmployeeModel = require('./models/Employee')
const UserModel = require('./models/User')
const AuditModel = require('./models/Audit')

// require("dotenv").config();


const roleMiddleware = require('./middleware/roleMiddleware'); // Import roleMiddleware

const moment = require("moment");



const app = express()
app.use(cors({ 
  origin: '*',  // Allows all origins

  credentials: true }));
app.use(express.json())


mongoose.connect("mongodb://127.0.0.1:27017/")



app.post("/creating",  (req, res) => {
    // Ensure required fields are in the request body
    const { appName, roles, last_audit_date ,app_rights } = req.body;
  
    // Check if all required fields are provided
    if (!appName || !roles || !last_audit_date ||!app_rights) {
      return res.status(400).json({
        message: 'Missing required fields: appName, roles, status ,app_rights, or last_audit_date. ',
      });
    }
    
    app.post('/logout', (req, res) => {
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).send('Failed to log out');
        }
        res.send('Logged out successfully');
      });
    });
    
    // Create a new App using the request body
    AppModel.create(req.body)
      .then((app) => {
        res.status(201).json({
          message: 'App created successfully!',
          app: app,
        });
      })
      .catch((err) => {
        // Handle validation or other errors
        console.error(err);
        res.status(500).json({
          message: 'Error creating the app.',
          error: err.message,
        });
      });
  });


  app.get("/creating", async (req, res) => {
    try {
      const apps = await AppModel.find().populate("frequency_id");
      // console.log(users);
      // return "";
      res.json(apps);
    } catch (error) {
      res.status(500).json({ message: "Error fetching apps" });
    }
  });

  app.get("/register", async (req, res) => {
    try {
      const users = await UserModel.find();
      // console.log(users);
      // return "";
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Error fetching usessrs" });
    }
  });


    app.post('/register', (req, res) => {
    UserModel.create(req.body)
    .then(register => res.json(register)) 
    .catch(err => res.status(500).json({ error: err.message })); 
      });


    app.post("/login", async (req, res) => {
      const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.password !== password) {
      return res.json({ success: false, message: "Incorrect password" });
    }

    return res.json({ success: true, message: "Login successful" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});



app.post('/frequency', (req, res) => {
  FrequencyModel.create(req.body)
  .then(frequency => res.json(frequency)) 
  .catch(err => res.status(500).json({ error: err.message })); 
});

app.get("/frequency", async (req, res) => {
  try {
    const frequencies = await FrequencyModel.find(); // Fetch data from the database
    res.json(frequencies); // Return the frequency data as a JSON array
  } catch (error) {
    res.status(500).json({ message: "Error fetching frequency" });
  }
});



app.post('/employee', (req, res) => {
  EmployeeModel.create(req.body)
  .then(employee => res.json(employee)) 
  .catch(err => res.status(500).json({ error: err.message })); 
});


app.get("/employee", async (req, res) => {
  try {
    const employee = await EmployeeModel.find().populate('user_id'); // Populate the user_id field
    res.json(employee);
  } catch (error) {
    console.error('Error fetching employee:', error); // Log the actual error
    res.status(500).json({ message: 'Error fetching employee data', error: error.message });
  }
});


app.post('/audit', (req, res) => {
  AuditModel.create(req.body)
  .then(audit => res.json(audit)) 
  .catch(err => res.status(500).json({ error: err.message })); 
});

app.get("/audit", async (req, res) => {
  try {
    const todayStart = moment().startOf("day").toDate(); // Get today's start time (00:00:00)
    const todayEnd = moment().endOf("day").toDate(); // Get today's end time (23:59:59)

    // Fetch audits and use .lean() to get plain JavaScript objects
    const audits = await AuditModel.find({
      audit_date: { $gte: todayStart, $lt: todayEnd }
    })
      .populate("user_id", "name email") // Populate only name and email from the user model
      .populate("frequency_id", "name") // Populate only name from the frequency model
      .populate("application_id", "appName app_rights") // Populate appName and app_rights from the application model
      .populate("emp_id", "id") // Populate only id from the emp model
      .lean(); // Convert Mongoose documents to plain JavaScript objects

    // Transform the app_rights array into an object with each right set to false
    const transformedAudits = audits.map(audit => {
      if (audit.application_id && audit.application_id.app_rights) {
        // Convert the app_rights array into an object with all rights set to false
        const appRights = audit.application_id.app_rights.reduce((acc, right) => {
          acc[right] = false;
          return acc;
        }, {});
        audit.application_id.app_rights = appRights; // Replace the array with the transformed object
      }
      return audit;
    });

    res.json(transformedAudits); // Send the transformed audits as a JSON response
    
  } catch (error) {
    console.error("Error fetching audits:", error);
    res.status(500).json({ message: "Error fetching audits" });
  }
});

app.listen(3000, () =>{
    console.log("I slove ");
})