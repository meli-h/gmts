import { useEffect, useState } from 'react';
import { getClasses, getBookings, addBooking, deleteBooking } from '../api';

export default function Bookings() {
  const [classes,setClasses]=useState([]);
  const [bookings,setBookings]=useState([]);
  const [select,setSelect]=useState('');

  useEffect(()=>{
    getClasses().then(setClasses);
    getBookings().then(setBookings);
  },[]);

  const reserve=async e=>{
    e.preventDefault();
    await addBooking({ class_id:+select, gymMember_id:1 });
    setBookings(await getBookings());
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Bookings</h1>

      <form onSubmit={reserve} className="flex gap-2">
        <select className="border p-1" value={select} onChange={e=>setSelect(e.target.value)} required>
          <option value="">Select class</option>
          {classes.map(c=>(
            <option key={c.class_id} value={c.class_id}>
              {c.title} — {new Date(c.start_time).toLocaleString()}
            </option>
          ))}
        </select>
        <button className="bg-green-600 text-white px-3">Reserve</button>
      </form>

      <ul className="space-y-2">
        {bookings.map(b=>(
          <li key={b.booking_id} className="border p-3 rounded flex justify-between">
            <span>Booking #{b.booking_id} → class #{b.class_id}</span>
            <button className="bg-red-500 text-white px-2"
              onClick={()=>{ deleteBooking(b.booking_id); setBookings(bookings.filter(x=>x.booking_id!==b.booking_id)); }}>
              Cancel
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
