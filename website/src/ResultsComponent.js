import "./App.css";

const ResultsComponent = ({ investorAmounts }) => {
  return (
    <div className="App-results-component">
      <h3>Results</h3>

      <div className="App-results-group">
        <div className="App-results-text-group">
          {Object.entries(investorAmounts).map(([name, proratedAmount]) => (
            <div key={name} className="App-results-text">
              <span>{name}</span>
              <span> - </span>
              <span>${proratedAmount}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default ResultsComponent;
