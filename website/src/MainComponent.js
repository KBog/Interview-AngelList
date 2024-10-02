import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import iconUsd from "./assets/icon-usd.png";
import CustomInputFieldComponent from "./common/CustomInputFieldComponent";
import InvestorBreakdownComponent from "./InvestorBreakdownComponent";
import ResultsComponent from "./ResultsComponent";

const server = axios.create({
  baseURL: "http://localhost:8080/v1",
  timeout: 45000,
});

function MainComponent() {
  let [allocationAmount, setAllocationAmount] = useState("");
  let [investorAmounts, setInvestorAmounts] = useState([{
    name: undefined,
    requested_amount: undefined,
    average_amount: undefined
  }]);
  let [proratedAmounts, setProratedAmounts] = useState([]);
  let [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {

  }, []);

  const handleAllocationAmountChange = (value) => {
    setAllocationAmount(value)
  }

  const handleAddInvestor = () => {
    const updatedInvestorAmounts = [...investorAmounts]
    updatedInvestorAmounts.push({
      name: undefined,
      requested_amount: undefined,
      average_amount: undefined
    })
    setInvestorAmounts(updatedInvestorAmounts)
  };

  const handleInvestorChange = (index, field, newValue) => {
    const updatedInvestorAmounts = [...investorAmounts];
    updatedInvestorAmounts[index][field] = newValue;
    setInvestorAmounts(updatedInvestorAmounts);
  };

  const handleInvestorDeletion = (index) => {
    const updatedInvestorAmounts = [...investorAmounts];
    updatedInvestorAmounts.splice(index, 1)
    setInvestorAmounts(updatedInvestorAmounts);
  };

  let handleProrate = () => {
    let error = ""

    // Perform some quick validations (this list is not extensive)
    if (!allocationAmount || isNaN(allocationAmount)) {
      error = "Allocation amount is invalid!"
    }

    // Validate the investor amounts, then filter out any invalid investor
    const filteredInvestorAmounts = investorAmounts.map(investor => {
      // convert the strings to numbers
      return {
        name: investor.name,
        requested_amount: Number(investor.requested_amount),
        average_amount: Number(investor.average_amount)
      }
    }).filter(investor => { return investor.name !== '' && investor.requested_amount > 0 })

    if (error) {
      // Show error message
      setErrorMessage(error)
    } else {
      setErrorMessage("")
      server
        .post("/proration/prorate", {
          allocation: allocationAmount,
          investorAmounts: filteredInvestorAmounts
        })
        .then((response) => {
          setProratedAmounts(response.data.proratedAmounts)
        });
    }
  };

  return (
    <div className="App-split-containers">
      <div className="App-inputs-component">
        <h3>Inputs</h3>

        <div className="App-inputs-group">
          <p className="App-inputs-available-allocation">
            Total Available Allocation
          </p>

          <CustomInputFieldComponent
            placeholder="Allocation"
            logo={iconUsd}
            inputValue={allocationAmount}
            onInputChange={handleAllocationAmountChange} />

          <div className="App-inputs-investor-breakdown-container">
            <p className="App-inputs-investor-breakdown">
              Investor Breakdown
            </p>
            <button
              onClick={handleAddInvestor}
              className="App-inputs-investor-breakdown-add-button"
            >
              {"Add Investor"}
            </button>
          </div>

          <div className="App-investor-breakdown-parent-container">
            {investorAmounts.map((investor, index) => (
              <InvestorBreakdownComponent
                key={index}
                investor={investor}
                onInputChange={(field, newValue) => handleInvestorChange(index, field, newValue)}
                onDelete={() => handleInvestorDeletion(index)}
              />
            ))}
          </div>

          <div className="App-prorate-container">
            <button
              onClick={handleProrate}
              className="App-button-prorate"
            >
              {"Prorate"}
            </button>

            { errorMessage ?
              <p className="App-error-message">{errorMessage}</p>
              : null }
          </div>
        </div>
      </div>
      <ResultsComponent
        investorAmounts={proratedAmounts}
      />
    </div>
  );
}

export default MainComponent;
