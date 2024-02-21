import { useLogout } from "../Hooks/useLogout";

const Logout = () => {
  const { logout } = useLogout();

  const logOut = () => {
    logout();
  };

  return (
    <button className="log-out" onClick={logOut}>
      Log Out
    </button>
  );
};

export default Logout;
