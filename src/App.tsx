import Index from "./pages/Index";
import { NextUIProvider } from "@nextui-org/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Studio from "./pages/Studio";
import Alert from "./components/Alert";
import Video from "./pages/Video";
import PlaylistDisplay from "./pages/PlaylistDisplay";
import PlaylistVideo from "./pages/PlaylistVideo";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/studio",
    element: <Studio />,
  },
  {
    path: "/v/:id",
    element: <Video />,
  },
  {
    path: "/p/:id",
    element: <PlaylistDisplay />,
  },
  {
    path: "/p/:id/v/:v_id",
    element: <PlaylistVideo />,
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
