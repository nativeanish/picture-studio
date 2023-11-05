import Index from "./pages/Index";
import { NextUIProvider } from "@nextui-org/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Studio from "./pages/Studio";
import Alert from "./components/Alert";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/studio",
    element: <Studio />,
  },
]);
function App() {
  return (
    <NextUIProvider>
      <RouterProvider router={router} />
      <Alert />
    </NextUIProvider>
  );
}

export default App;
