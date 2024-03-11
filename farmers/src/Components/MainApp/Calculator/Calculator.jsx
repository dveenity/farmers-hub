import { useState } from "react";
import GoBack from "../../Custom/GoBack";
import Scale from "../../../assets/images/scale.jpg";

const Calculator = () => {
  const [numberOfFishPerPond, setNumberOfFishPerPond] = useState("");
  const [numberOfPond, setNumberOfPond] = useState("");
  const [numberOfDays, setNumberOfDays] = useState("");
  const [estimationResult, setEstimationResult] = useState(null);

  const handleCalculateEstimation = (e) => {
    e.preventDefault();
    // Assuming feeding frequency per day is 2 times
    const feedingFrequencyPerDay = 2;

    // Assuming feed ratio per fish is 4.5 grams (adjust as needed)
    const feedRatioPerFish = 4.5 * feedingFrequencyPerDay;

    // calculate total fishes
    const totalFishes = numberOfFishPerPond * numberOfPond;

    // Calculate total feed needed
    const totalFeedNeeded = totalFishes * feedRatioPerFish * numberOfDays;

    // Set the estimation result in state
    setEstimationResult({
      totalFeedNeeded: totalFeedNeeded.toFixed(2),
      daysFeedLasts: numberOfDays,
    });
  };

  return (
    <div className="calculator">
      <GoBack />
      <img src={Scale} loading="lazy" alt="scale" />
      <div>
        <div>
          <h2>Feed calculator</h2>
          <p>
            Easily get the right amount of feed you need to purchase for your
            poultry and fishes
          </p>
        </div>
        <div>
          <form noValidate>
            <div>
              <label>Number of Fish per Pond:</label>
              <input
                type="number"
                value={numberOfFishPerPond}
                onChange={(e) => setNumberOfFishPerPond(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Number of Ponds:</label>
              <input
                type="number"
                value={numberOfPond}
                onChange={(e) => setNumberOfPond(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Number of days:</label>
              <input
                type="number"
                value={numberOfDays}
                onChange={(e) => setNumberOfDays(e.target.value)}
                required
              />
            </div>
            <button onClick={handleCalculateEstimation}>Calculate</button>
          </form>
          {estimationResult && (
            <div className="the-results">
              <p>
                Total Feed Needed for{" "}
                <span>{estimationResult.daysFeedLasts} days</span> is{" "}
                <span>{estimationResult.totalFeedNeeded} grams</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calculator;
