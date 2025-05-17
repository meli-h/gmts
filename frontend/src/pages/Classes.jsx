import { useEffect, useState } from 'react';
import { getClasses, addClass, deleteClass } from '../api';

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState({ title:'', start_time:'', duration:60, capacity:10, trainer_id:1 });

  useEffect(()=>{ getClasses().then(setClasses); }, []);

  const onSubmit = async e => {
    e.preventDefault();
    await addClass(form);
    setClasses(await getClasses());
    setForm({ ...form, title:'' });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Classes</h1>

      <form onSubmit={onSubmit} className="flex gap-2">
        <input  className="border p-1" placeholder="Title"
          value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required/>
        <input  className="border p-1" type="datetime-local"
          value={form.start_time} onChange={e=>setForm({...form,start_time:e.target.value})} required/>
        <button className="bg-green-600 text-white px-3">Add</button>
      </form>

      <ul className="space-y-2">
        {classes.map(c=>(
          <li key={c.class_id} className="border p-3 flex justify-between rounded">
            <span>{c.title} — {new Date(c.start_time).toLocaleString()}</span>
            <button className="bg-red-500 px-2 text-white rounded"
              onClick={()=>{ deleteClass(c.class_id); setClasses(classes.filter(x=>x.class_id!==c.class_id)); }}>
              Del
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
