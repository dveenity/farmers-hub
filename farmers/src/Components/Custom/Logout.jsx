import { useQueryClient } from "react-query";
import { useLogout } from "../Hooks/useLogout";

const Logout = () => {
  const queryClient = useQueryClient(); // Access the queryClient instance
  const { logout } = useLogout();

  const logOut = async () => {
    queryClient.clear(); // Clear all cached data
    logout();
    window.location.reload(); // reload page
  };

  return (
    <button className="log-out" onClick={logOut}>
      Log Out
    </button>
  );
};

export default Logout;
