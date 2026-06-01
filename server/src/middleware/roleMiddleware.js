export const authorize = (...allowedRoles) => {
  return (req, res ,next) => {

    console.log("User:", req.user);
    console.log("Role:", req.user.roles?.name);
    console.log("Allowed Roles:", allowedRoles);
    
    const userRole = req.user.roles?.name;

    if(!allowedRoles.includes(userRole)){
      return res.status(403).json({
        message: "Access denied",
      });
    }

    next();
  }
};
