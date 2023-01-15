import { useState } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import AppRouteTree from "./router";
import { BrowserRouter } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0);

  return (
    <ChakraProvider>
      <BrowserRouter>
        {" "}
        <AppRouteTree />
      </BrowserRouter>{" "}
    </ChakraProvider>
  );
}

export default App;
