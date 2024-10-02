import "./App.css";
import { useEffect } from "react";
import MainComponent from "./MainComponent";

// Could not use it for now in the useState<Location[], null>() below
// export type Location = {
//   id: number,
//   name: string,
//   address: string,
//   city: string,
//   state: string,
//   notes: string,
// };

// hit our backend
// const apiCall = () => {
//   axios
//     .get("http://localhost:8080/v1/globalentry/Location/getAll")
//     .then((data) => {
//       console.log(data);
//     });
// };

function App() {
  useEffect(() => {}, []);

  return (
    <div className="App">
      <MainComponent />
    </div>
  );
}

export default App;
