// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import AdminLayout             from './Layouts/AdminLayout/AdminLayout.jsx';
import CreateTrainerPage       from './Layouts/AdminLayout/CreateTrainerPage.jsx';
import TrainerListPage         from './Layouts/AdminLayout/TrainerListPage.jsx';
import CreateGymMemberPage     from './Layouts/AdminLayout/CreateGymMemberPage.jsx';
import GymMemberListPage       from './Layouts/AdminLayout/GymMemberListPage.jsx';

import TrainerLayout           from './Layouts/TrainerLayout/TrainerLayout.jsx';
import CreateClassPage         from './Layouts/TrainerLayout/CreateClassPage.jsx';
import ClassListPage           from './Layouts/TrainerLayout/ClassListPage.jsx';

import GymMemberLayout         from './Layouts/GymMemberLayout/GymMemberLayout.jsx';
import CreateBookingPage       from './Layouts/GymMemberLayout/CreateBookingPage.jsx';
import BookingListPage         from './Layouts/GymMemberLayout/BookingListPage.jsx';

import LoginPage               from './pages/LoginPage.jsx';
import RequireAuth             from './auth/RequireAuth.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ---------- Public Routes ---------- */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* ---------- Protected Routes ---------- */}
        <Route element={<RequireAuth />}>
          {/* Admin */}
          <Route path="/admin/*" element={<AdminLayout />}>
            <Route index element={<Navigate to="create-trainer" replace />} />
            <Route path="create-trainer" element={<CreateTrainerPage />} />
            <Route path="trainer-list"   element={<TrainerListPage />} />
            <Route path="create-member"  element={<CreateGymMemberPage />} />
            <Route path="member-list"    element={<GymMemberListPage />} />
          </Route>

          {/* Trainer (parametreli) */}
          <Route path="/trainer/:trainerId/*" element={<TrainerLayout />}>
            <Route index           element={<Navigate to="create-class" replace />} />
            <Route path="create-class" element={<CreateClassPage />} />
            <Route path="class-list"   element={<ClassListPage />} />
          </Route>

          {/* GymMember (parametreli) */}
          <Route path="/member/:memberId/*" element={<GymMemberLayout />}>
            <Route index               element={<Navigate to="create-booking" replace />} />
            <Route path="create-booking" element={<CreateBookingPage />} />
            <Route path="booking-list"   element={<BookingListPage />} />
          </Route>
        </Route>

        {/* fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
