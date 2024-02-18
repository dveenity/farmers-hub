import { BsArrowBarLeft } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const GoBack = () => {
  const navigate = useNavigate();

  // This function will go back to the previous page
  const goBack = () => {
    navigate(-1);
  };
  return (
    <button>
      <BsArrowBarLeft onClick={goBack} />
    </button>
  );
};

export default GoBack;
