import { useState } from 'react';
import { addTrainer } from '../../api';   // api.js yoluna göre güncelle

const ENDPOINT = {
    trainers: '/api/trainers',
    members: '/api/gym-members',   // <-- /api/gym-members DEĞİL!
};



export default function CreateTrainerPage() {
    const [trainer, setTrainer] = useState({ name: '', surname: '', account_id: '' });

    const submit = async e => {
        e.preventDefault();
        await addTrainer({ ...trainer, account_id: +trainer.account_id });
        alert('Trainer created!');
        setTrainer({ name: '', surname: '', account_id: '' });
    };

    return (
        <div className="container">
            <h2 className="mb-4">Create Trainer</h2>
            <form onSubmit={submit} className="row g-3">
                <div className="col-md-4">
                    <input className="form-control" placeholder="Name"
                        value={trainer.name}
                        onChange={e => setTrainer({ ...trainer, name: e.target.value })} required />
                </div>
                <div className="col-md-4">
                    <input className="form-control" placeholder="Surname"
                        value={trainer.surname}
                        onChange={e => setTrainer({ ...trainer, surname: e.target.value })} required />
                </div>
                <div className="col-md-4">
                    <input className="form-control" type="number" placeholder="Account ID"
                        value={trainer.account_id}
                        onChange={e => setTrainer({ ...trainer, account_id: e.target.value })} required />
                </div>
                <div className="col-12">
                    <button className="btn btn-primary">Create</button>
                </div>
            </form>
        </div>
    );
}
