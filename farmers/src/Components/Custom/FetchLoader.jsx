import HashLoader from "react-spinners/HashLoader";

const HashLoaderSpin = () => {
  return (
    <div className="sweet-loading">
      <HashLoader
        color="green"
        size={70}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default HashLoaderSpin;
