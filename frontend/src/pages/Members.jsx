import { useEffect, useState } from 'react';
import { getMembers, addMember } from '../api';

export default function Members() {
  const [members,setMembers]=useState([]);
  const [form,setForm]=useState({ name:'',surname:'',account_id:0 });

  useEffect(()=>{ getMembers().then(setMembers); },[]);

  const submit=async e=>{
    e.preventDefault();
    await addMember({ ...form, membership_type:'Monthly' });
    setMembers(await getMembers());
    setForm({ name:'',surname:'',account_id:0 });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Gym Members</h1>

      <form onSubmit={submit} className="flex gap-2">
        <input className="border p-1" placeholder="Name"
          value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/>
        <input className="border p-1" placeholder="Surname"
          value={form.surname} onChange={e=>setForm({...form,surname:e.target.value})} required/>
        <input className="border p-1 w-16" type="number" placeholder="AccID"
          value={form.account_id} onChange={e=>setForm({...form,account_id:+e.target.value})} required/>
        <button className="bg-green-600 text-white px-3">Add</button>
      </form>

      <ul className="space-y-2">
        {members.map(m=>(
          <li key={m.gymMember_id} className="border p-3 rounded flex justify-between">
            <span>{m.name} {m.surname} (#{m.gymMember_id})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
