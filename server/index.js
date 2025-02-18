const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const AppModel = require('./models/Application')
const FrequencyModel = require('./models/Frequency')
const EmployeeModel = require('./models/Employee')
const UserModel = require('./models/User')
const AuditModel = require('./models/Audit')

// require("dotenv").config();

const moment = require("moment");
const jwt = require('jsonwebtoken');
const secretKey = 'your-secret-key';
const checkAuth = require('./middleware/auth');


const app = express()
app.use(cors({ 
  origin: '*',  // Allows all origins

  credentials: true }));
app.use(express.json())


mongoose.connect("mongodb://127.0.0.1:27017/saas")


async function calculateNextAuditDate(frequency_id){

  const frequency = await FrequencyModel.findById(frequency_id);
  
  const today = new Date();
  const triggerDay = frequency.trigger_days;
  const intervalDays = frequency.interval_days || 30;

  const nextAuditBaseDate = new Date(today);
  let nextAuditDate;

  // 7  = week
  // 30 =  month
  // 90 =  3 months
  // 180 =  6 months

  //Month
  if(intervalDays == "30"){
    nextAuditDate = new Date(nextAuditBaseDate);
      nextAuditDate.setMonth(today.getMonth() + 1);    
      nextAuditDate.setDate(triggerDay);
  }
  else if(intervalDays == "90"){
    nextAuditDate = new Date(nextAuditBaseDate);
    nextAuditDate.setMonth(today.getMonth() + 3);    
      nextAuditDate.setDate(triggerDay);
  }
  else if(intervalDays == "180"){
      nextAuditDate = new Date(nextAuditBaseDate);
      nextAuditDate.setMonth(today.getMonth() + 6);    
      nextAuditDate.setDate(triggerDay);
  }
  else if (intervalDays == "7") { //Weeek

    nextAuditDate = new Date(nextAuditBaseDate);
    nextAuditDate.setDate(today.getDate() + (7 - today.getDay()));
    
    nextAuditDate.setDate(nextAuditDate.getDate() + (triggerDay));

  } else {
    nextAuditDate = new Date(today);
  }
  return nextAuditDate;
}

app.get("/getNextAuditDate", async (req, res) => {
  const { frequency_id } = req.query; 
  
  res.status(200).json({
    message: await calculateNextAuditDate(frequency_id)
  });
});

app.get("/getApplicationDataForReview", async (req, res) => {
  const { application_id } = req.query; 
  const application = await AppModel.findById(application_id);
  const freq = await calculateNextAuditDate(application.frequency_id);
  res.status(200).json({
    // message: await calculateNextAuditDate(frequency_id)
    message: (application),
    nextAuditDate: freq
  });
});


app.post("/createApplication", async (req, res) => {
    // Ensure required fields are in the request body
    const { appName, app_rights, frequency_id } = req.body;
  
    // Check if all required fields are provided
    if (!appName  || !app_rights) {
      return res.status(400).json({
        message: 'Missing required fields: appName, roles, status ,app_rights, or last_audit_date. ',
      });
    }

    let nextAuditDate = await calculateNextAuditDate(frequency_id);

    const newApplication = {
      ...req.body,
      status: true,  // Set status to active
      next_audit_date: nextAuditDate,
      last_audit_date: null,
    };

    // Create a new App using the request body
    AppModel.create(newApplication)
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
      const apps = await AppModel.find().sort({ created_at: -1 }).populate("frequency_id");
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
  

  // HOD
  app.get("/hods", async (req, res) => {
    try {
      const hodsWithEmployees = await UserModel.aggregate([
        // 1. Match only users with role "hod"
        { $match: { role: "hod" } },
  
        // 2. Lookup audits where hod_id matches this HOD and status is true
        {
          $lookup: {
            from: "audits",
            localField: "_id",
            foreignField: "user_id",
            as: "auditData"
          }
        },
  
        // 3. Filter only audits where status = true
        {
          $addFields: {
            auditData: {
              $filter: {
                input: "$auditData",
                as: "audit",
                cond: { $eq: ["$$audit.status", true] }
              }
            }
          }
        },
  
        // 4. Lookup employees using emp_id from filtered audits
        {
          $lookup: {
            from: "employees",
            localField: "auditData.emp_id",
            foreignField: "_id",
            as: "employees"
          }
        },
  
        // 5. Project the final structure
        {
          $project: {
            _id: 1,
            name: 1,
            role: 1,
            email: 1,
            employees: 1 // Only return relevant employees

          }
        }
      ]);
      // console.log(users);
      // return "";
      res.json(hodsWithEmployees);
    } catch (error) {
      res.status(500).json({ message: "Error fetching usessrs" });
    }
  });
  
  app.post('/submitReview', async (req, res) => {

    const { auditID, remark, rights, reviewer, emp, app } = req.body;

    const previousAudit = await AuditModel.findOne({
      emp_id: emp,
      application_id: app,
      user_id: reviewer
    });

    if (previousAudit) {
        previousAudit.status = false;
    }
    
    const audit = await AuditModel.findById(auditID);
    if (!audit) {
      return res.status(404).json({ message: "Audit not found" });
    }

    audit.reviewer_rightsGiven = rights;
    audit.reviewer_reviewAt = new Date();
    audit.reviewer_actionTaken = "Grant All Access";
    audit.reviewer_remarks = remark;


    await audit.save();

    res.json({ message: "Audit updated successfully", audit });


  // UserModel.create(newUser)
  // .then(register => res.json(register))
  // .catch(err => res.status(500).json({ error: err.message }));

    });



    app.post('/register', (req, res) => {
      const newUser = {
        ...req.body,
        status: true,  // Set status to active
        role: "hod"        // Set role to hod
    };

    UserModel.create(newUser)
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

    const token = jwt.sign({ userId: user._id, email: user.email }, secretKey, {
      expiresIn: '1h',
    });

    return res.json({ success: true, message: "Login successful", token: token, user: user});
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



app.post('/audit', async (req, res) => {
  
  const {application_id} = req.body;
  const frequency = await AppModel.findById(application_id).select('frequency_id'); // Populate the user_id field

  const newReview = {
    ...req.body,
    status: true,        // Set role to hod
    audit_date: await calculateNextAuditDate(frequency.frequency_id),
    frequency_id:frequency.frequency_id
  };

  AuditModel.create(newReview)
  .then(audit => res.json(audit)) 
  .catch(err => res.status(500).json({ error: err.message })); 
});

app.get("/pendingAudits", async (req, res) => {
  try {
    const todayStart = moment().startOf("day").toDate(); // Get today's start time (00:00:00)
    const todayEnd = moment().endOf("day").toDate(); // Get today's end time (23:59:59)

    // Fetch audits and use .lean() to get plain JavaScript objects
    const audits = await AuditModel.find({
      status: true,         // Ensure status is true
      reviewer_rightsGiven: null, // Ensure reviewer_rightsGiven is null
      audit_date: { $gte: todayStart, $lt: todayEnd }
    })  
    .populate("frequency_id", "name") 
    .populate("application_id", "appName app_rights") 
    .populate("emp_id", "name") 
 
    res.json(audits);
    return;
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
    res.status(500).json({ message: "Error fetching audits" + error });
  }
});

app.get("/pastAudits", async (req, res) => {
  try {
    // Fetch audits and use .lean() to get plain JavaScript objects
    const audits = await AuditModel.find({
      reviewer_reviewAt: { $ne: null } 
    })  
    .populate("application_id", "appName app_rights") 
    .populate("emp_id", "name") 
 
    res.json(audits);
    return;
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
    res.status(500).json({ message: "Error fetching audits" + error });
  }
});




app.post('/excelUpload', async (req, res) => {
  const data = req.body; // This will be the JSON data from the frontend
    var errorArr = [];
    var index = 0;

    // Iterate over each item in the data array
    for (const item of data) {
        index++;

        // Check if the required keys exist
        if (
            !item.hasOwnProperty('Application') || 
            !item.hasOwnProperty('Employee') || 
            !item.hasOwnProperty('HOD') || 
            !item.hasOwnProperty('Rights')
        ) {
            continue; // Skip this item if keys are missing
        }

        //#region  Keys Checker
        // Convert values to lowercase for case-insensitive search
        const applicationName = item.Application.toLowerCase();
        const employeeName = item.Employee.toLowerCase();
        const hodName = item.HOD.toLowerCase();

        // Check if the 'Application' value exists in the AppModel schema (case-insensitive)
        const appExists = await AppModel.findOne({ appName: new RegExp(`^${applicationName}$`, 'i') });
        if (!appExists) {
            errorArr.push({
                Error: `Application "${item.Application}" not found in AppModel`,
                row: index
            });
            continue; // Skip to next item if 'Application' is invalid
        }

        // Check if the 'Employee' value exists in the EmployeeModel schema (case-insensitive)
        const employeeExists = await EmployeeModel.findOne({ name: new RegExp(`^${employeeName}$`, 'i') });
        if (!employeeExists) {
            errorArr.push({
                Error: `Employee "${item.Employee}" not found in EmployeeModel`,
                row: index
            });
            continue; // Skip to next item if 'Employee' is invalid
        }

        // Check if the 'HOD' value exists in the UserModel schema (case-insensitive)
        const hodExists = await UserModel.findOne({ name: new RegExp(`^${hodName}$`, 'i') });
        if (!hodExists) {
            errorArr.push({
                Error: `HOD "${item.HOD}" not found in UserModel`,
                row: index
            });
            continue; // Skip to next item if 'HOD' is invalid
        }
        //#endregion
      //   return res.status(400).json({
      //     message: appExists,
      //     errors: hodExists,
      //     sad: employeeExists
      // });
    
      const newReview = {
        emp_id: employeeExists._id,
        frequency_id: appExists.frequency_id,
        user_id: hodExists._id,
        application_id: appExists._id,
        initialRights: item.Rights.toLowerCase(),
        audit_date: await calculateNextAuditDate(appExists.frequency_id),
      };
    
      AuditModel.create(newReview)
      .then(audit => res.json(audit)) 
      .catch(err => res.status(500).json({ error: err.message })); 


    }

    // If errors are found, return them in the response
    if (errorArr.length > 0) {
        return res.status(400).json({
            message: "There were errors with the data.",
            errors: errorArr
        });
    }

    // If no errors, send a success response
    res.json({
        message: "All items contain valid values in the schemas."
    });
});

app.post('/change-password', async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;

  // Fetch user from database
  const user = await UserModel.findById(userId);
  if (!user) {
      return res.status(404).json({ message: "User not found" });
  }

  // Check old password

  if(user.password != oldPassword){
    return res.status(400).json({ message: "Incorrect old password" });
  }

  // Hash new passwor
  user.password = newPassword;
  // Save new password
  await user.save();
  
  res.json({ message: "Password updated successfully!" });
});


app.listen(3000, () =>{
    console.log("I slove ");
})