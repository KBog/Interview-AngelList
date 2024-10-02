import "./App.css";
import CustomInputFieldComponent from "./common/CustomInputFieldComponent";
import iconUsd from "./assets/icon-usd.png";
import iconInvestor from "./assets/icon-investor.png";
import iconTrash from "./assets/icons8-trash.svg";

const InvestorBreakdownComponent = (props) => {
  const { investor, onInputChange, onDelete } = props;

  return (
    <div className="App-investor-breakdown-container">
      <CustomInputFieldComponent
        placeholder="Name"
        logo={iconInvestor}
        inputValue={investor.name}
        onInputChange={(newValue) => onInputChange('name', newValue)} />
      <CustomInputFieldComponent
        placeholder="Requested Amount"
        logo={iconUsd}
        inputValue={investor.requestedAmount}
        onInputChange={(newValue) => onInputChange('requested_amount', newValue)} />
      <CustomInputFieldComponent
        placeholder="Average Amount"
        logo={iconUsd}
        inputValue={investor.averageAmount}
        onInputChange={(newValue) => onInputChange('average_amount', newValue)} />

      <button
        onClick={onDelete}
        className="App-inputs-investor-breakdown-delete-button"
      >
        <img class="App-inputs-investor-breakdown-delete-button-icon" src={iconTrash} alt="trash-icon" />
      </button>
    </div>
  );
}

export default InvestorBreakdownComponent;
