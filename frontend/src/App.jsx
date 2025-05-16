import{
  createBrowserRouter,
  RouterProvider,
  Route, 
  Outlet 

} from "react-router-dom"; 

import Login from "./pages/Login"
import Admin from "./pages/Admin";
import GymMember from "./pages/GymMember";
import Trainers from "./pages/Trainers";
import Home from "./pages/Home";
import Class from "./pages/Class";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./style.scss";
import Booking from "./pages/Booking";

const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};


const router = createBrowserRouter([
  {
    path : "/",
    element : <Layout/>,
    children : [
      {
        index : true,
        element : <Home/>
      },
      {
        path : "/admin",
        element : <Admin/>
      },
      {
        path : "/gym-member",
        element : <GymMember/>
      },
      {
        path : "/trainers",
        element : <Trainers/>
      },
      {
        path : "/booking",
        element : <Booking/>
      },
      {
        path: "/class",
        element: <Class/>
      }
    ]
  },
  {
    path : "/login",
    element : <Login/>
  }
]);


function App() {
  return (
  <div className="app">
    <div className="container">
      <RouterProvider router={router} />
    </div>
  </div>
  );
}

export default App;
