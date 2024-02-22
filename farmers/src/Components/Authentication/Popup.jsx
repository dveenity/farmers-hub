import PropTypes from "prop-types"; // Import PropTypes
import { useState } from "react";
import LoadingSpin from "../Custom/LoadingSpin";

const Popup = ({ onClose }) => {
  const [isAnimating, setIsAnimating] = useState("Agree");

  const handleAgree = () => {
    setIsAnimating(
      <div style={{ height: "3rem", display: "grid", placeItems: "center" }}>
        <LoadingSpin />
      </div>
    ); // Trigger animation
    setTimeout(() => {
      onClose(); // Call the onClose function after animation completes
    }, 2000);
  };

  return (
    <div className="modal-overlay">
      <dialog open className="modal">
        <div className="agreementPopup">
          <h1>Welcome to Agro Farmers Hub</h1>
          <div>
            <p>
              Thank you for your interest in Agro Farmers Hub. Our mission is to
              promote digital inclusion within the agro-processing sector, with
              a specific focus on empowering small and medium-sized fish farming
              enterprises. Before you proceed, we want to provide you with
              important information about our application and the policies
              governing its use.
            </p>
          </div>
          <div>
            <h2>Application Overview:</h2>
            <p>
              Agro Farmers Hub is designed to enhance the digital capabilities
              of small and medium-sized fish farming enterprises, fostering
              efficiency, sustainability, and growth within the agro-processing
              industry. By leveraging technology, our platform aims to provide
              valuable tools and resources to streamline processes, improve
              decision-making, and contribute to the overall success of fish
              farming businesses.
            </p>
          </div>
          <div>
            <h2>Key Features:</h2>
            <ul>
              <li>
                <h3>Data Management</h3>
                <p>
                  Efficiently organize and manage essential data related to fish
                  farming operations.
                </p>
              </li>
              <li>
                <h3>Market Insights</h3>
                <p>
                  Access market trends and insights to make informed business
                  decisions.
                </p>
              </li>
              <li>
                <h3>Resource Optimization</h3>
                <p>
                  Utilize tools to optimize resource allocation and enhance
                  productivity.
                </p>
              </li>
              <li>
                <h3>Community Collaboration</h3>
                <p>
                  Connect with other fish farming enterprises, share
                  experiences, and foster collaboration within the community.
                </p>
              </li>
            </ul>
          </div>
          <div>
            <h2>Privacy and Security</h2>
            <p>
              Your privacy and the security of your data are of utmost
              importance to us. Agro Farmers Hub employs robust security
              measures to protect your information and ensure a safe digital
              environment. Our Privacy Policy outlines how your data is
              collected, used, and safeguarded. By proceeding, you agree to our
              Privacy Policy.
            </p>
          </div>
          <div>
            <h2>Terms of Use</h2>
            <p>
              It is essential to familiarize yourself with our Terms of Use,
              which govern your interactions with Agro Farmers Hub. These terms
              detail the rules and guidelines for using our application. By
              clicking <span>Agree</span> you acknowledge that you have read,
              understood, and agree to abide by our Terms of Use.
            </p>
          </div>
          <div>
            <h2>How to Proceed</h2>
            <p>
              To start your journey with Agro Farmers Hub, please click the
              <span>Agree</span> button below.
            </p>
          </div>
          <button onClick={handleAgree}>{isAnimating}</button>
        </div>
      </dialog>
    </div>
  );
};

// Define propTypes for the Popup component
Popup.propTypes = {
  onClose: PropTypes.func.isRequired, // onClose should be a function and is required
};

export default Popup;
