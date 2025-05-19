import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import AdminLayout from './Layouts/AdminLayout/AdminLayout.jsx';
import CreateTrainerPage from './Layouts/AdminLayout/CreateTrainerPage.jsx';
import TrainerListPage from './Layouts/AdminLayout/TrainerListPage.jsx';
import CreateGymMemberPage from './Layouts/AdminLayout/CreateGymMemberPage.jsx';
import GymMemberListPage from './Layouts/AdminLayout/GymMemberListPage.jsx';

import TrainerLayout from './Layouts/TrainerLayout/TrainerLayout.jsx';
import CreateClassPage from './Layouts/TrainerLayout/CreateClassPage.jsx';
import ClassListPage from './Layouts/TrainerLayout/ClassListPage.jsx';

import GymMemberLayout from './Layouts/GymMemberLayout/GymMemberLayout.jsx';
import CreateBookingPage from './Layouts/GymMemberLayout/CreateBookingPage.jsx';
import BookingListPage from './Layouts/GymMemberLayout/BookingListPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ---------- kök ---------- */}
        <Route path="/" element={<Navigate to="/member" replace />} />

        {/* ---------- Admin ---------- */}
        <Route path="/admin/*" element={<AdminLayout />}>
          <Route index element={<Navigate to="create-trainer" replace />} />
          <Route path="create-trainer" element={<CreateTrainerPage />} />
          <Route path="trainer-list" element={<TrainerListPage />} />
          <Route path="create-member" element={<CreateGymMemberPage />} />
          <Route path="member-list" element={<GymMemberListPage />} />
        </Route>

        {/* ---------- Trainer ---------- */}
        <Route path="/trainer/*" element={<TrainerLayout />}>
          <Route index element={<Navigate to="create-class" replace />} />
          <Route path="create-class" element={<CreateClassPage />} />
          <Route path="class-list" element={<ClassListPage />} />
        </Route>

        {/* ---------- Gym-Member ---------- */}
        <Route path="/member/*" element={<GymMemberLayout />}>
          <Route index element={<Navigate to="create-booking" replace />} />
          <Route path="create-booking" element={<CreateBookingPage />} />
          <Route path="booking-list" element={<BookingListPage />} />
        </Route>

        {/* ---------- fallback ---------- */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}
