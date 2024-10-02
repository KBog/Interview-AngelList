import "../App.css";

const CustomInputFieldComponent = (props) => {
  const handleChange = (event) => {
    props.onInputChange(event.target.value)
  }

  return (
    <div className="App-input-field-container">
      <div class="App-input-field-icon">
        <img class="App-input-field-icon-image" src={props.logo} alt="input-icon" />
      </div>
      <input
        class="App-input-field"
        value={props.inputValue}
        placeholder={props.placeholder}
        onChange={handleChange}
      />
    </div>
  );
}

export default CustomInputFieldComponent;
