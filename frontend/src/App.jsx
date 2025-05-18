// import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
// import Classes  from "./pages/Classes";
// import Trainers from "./pages/Trainers";
// import Members  from "./pages/Members";
// import Bookings from "./pages/Bookings";

// export default function App() {
//   return (
//     <BrowserRouter>
//       <nav className="p-4 bg-gray-100 flex gap-4">
//         <Link to="/classes">Classes</Link>
//         <Link to="/trainers">Trainers</Link>
//         <Link to="/members">Members</Link>
//         <Link to="/bookings">Bookings</Link>
//       </nav>

//       <Routes>
//         <Route path="/classes"  element={<Classes />}  />
//         <Route path="/trainers" element={<Trainers />} />
//         <Route path="/members"  element={<Members />}  />
//         <Route path="/bookings" element={<Bookings />} />
//         <Route path="*"         element={<p className="p-4">Select a page</p>} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './Layouts/AdminLayout/AdminLayout.jsx';
import CreateTrainerPage from './Layouts/AdminLayout/CreateTrainerPage.jsx';
import TrainerListPage from './Layouts/AdminLayout/TrainerListPage.jsx';
import CreateGymMemberPage from './Layouts/AdminLayout/CreateGymMemberPage.jsx';
import GymMemberListPage from './Layouts/AdminLayout/GymMemberListPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ADMIN Kökü */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="create-trainer" replace />} />

          <Route path="create-trainer" element={<CreateTrainerPage />} />
          <Route path="trainer-list" element={<TrainerListPage />} />

          <Route path="create-member" element={<CreateGymMemberPage />} />
          <Route path="member-list" element={<GymMemberListPage />} />
        </Route>

        {/* Kök URL’yi /admin’e yönlendir */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

