import "./App.css";
import Box from "./components/Box";
import SideBar from "./components/SideBar";
import { useImage } from "./store";

function App() {
  const image = useImage()
  return (
    <div className="container">
      <Box />
      {image.src && <SideBar />}
    </div>
  );
}

export default App;
