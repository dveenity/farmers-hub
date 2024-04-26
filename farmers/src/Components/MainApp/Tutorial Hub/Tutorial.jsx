import GoBack from "../../Custom/GoBack";
import YouTube from "react-youtube";

const Tutorial = () => {
  // YouTube video options (you can customize these as needed)
  const opts = {
    width: "100%",
    height: "200",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
    },
  };

  // YouTube video URLs
  const video1 = "L0GXXTZe-jg";
  const video2 = "Q2nZcPxleuo";

  return (
    <div className="tutorial">
      <div>
        <GoBack />
        <h1>Tutorial</h1>
      </div>
      <div className="video-container">
        <div>
          <h2>
            HOW TO HATCH/BREED 80,000 FISH USING JUST ONE MALE AND FEMALE FISH;
            HOW TO HATCH FISH
          </h2>
          <YouTube videoId={video1} opts={opts} />
        </div>
        <div>
          <h2>From Eggs To Fish; FISH BREEDING AND MANAGEMENT Part 2</h2>
          <YouTube videoId={video2} opts={opts} />
        </div>
      </div>
    </div>
  );
};

export default Tutorial;
