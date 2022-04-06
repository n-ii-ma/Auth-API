// Check if user is authenticated
const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.status(200).json({ message: "Already Logged In" });
  } else {
    next();
  }
};

// Check if user is not authenticated
const checkNotAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res
      .status(401)
      .json({ message: "Not Authorized to View or Edit the Content" });
  }
};

module.exports = { checkAuthenticated, checkNotAuthenticated };
