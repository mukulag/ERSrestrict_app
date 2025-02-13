const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
      const userRole = req.session.role; // Assuming the role is stored in the session
  
      // Check if the user's role is allowed
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).send('Forbidden: You do not have access to this resource');
      }
  
      next(); // Allow the request to proceed
    };
  };
  