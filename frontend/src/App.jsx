
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './Layouts/AdminLayout/AdminLayout.jsx';
import CreateTrainerPage from './Layouts/AdminLayout/CreateTrainerPage.jsx';
import TrainerListPage from './Layouts/AdminLayout/TrainerListPage.jsx';
import CreateGymMemberPage from './Layouts/AdminLayout/CreateGymMemberPage.jsx';
import GymMemberListPage from './Layouts/AdminLayout/GymMemberListPage.jsx';

import TrainerLayout from './Layouts/TrainerLayout/TrainerLayout.jsx';
import ClassListPage from './Layouts/TrainerLayout/ClassListPage.jsx';
import CreateClassPage from './Layouts/TrainerLayout/CreateClassPage.jsx';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/trainer" element={<TrainerLayout />}>
          <Route index element={<Navigate to="create-class" replace />} />

          <Route path="create-class" element={<CreateClassPage />} />
          <Route path="class-list" element={<ClassListPage />} />

        </Route>

        <Route path="*" element={<Navigate to="/trainer" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

{/* <Routes>
  <Route path="/admin" element={<AdminLayout />}>
    <Route index element={<Navigate to="create-trainer" replace />} />

    <Route path="create-trainer" element={<CreateTrainerPage />} />
    <Route path="trainer-list" element={<TrainerListPage />} />

    <Route path="create-member" element={<CreateGymMemberPage />} />
    <Route path="member-list" element={<GymMemberListPage />} />
  </Route>

  <Route path="*" element={<Navigate to="/admin" replace />} />
</Routes> */}