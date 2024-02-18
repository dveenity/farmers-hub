import { Link } from "react-router-dom";

const Genesis = () => {
  return (
    <div>
      <h1>Welcome to farmers Hub</h1>
      <div>
        <h2>Click here to Signup</h2>
        <Link to="/Signup">Sign Up</Link>
      </div>
      <div>
        <h2>Click here to Login</h2>
        <Link to="/Login">Log In</Link>
      </div>
    </div>
  );
};

export default Genesis;
