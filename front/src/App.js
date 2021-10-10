import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
        const [campi, setCampi] = useState([]);
        const [foto, setFoto] = useState('');

        const getCampi = async() => {
            const res = await axios.get(`/route_example/bd_ufv`);
            const campi = res.data.map(campus => (
                {
                    ...campus,
                    Foto: btoa(String.fromCharCode(...new Uint8Array(campus.Foto.data)))
                }
            )).sort((a,b) => a.Nome.localeCompare(b.Nome));
            setCampi(campi);
            setFoto(`data:image/png;base64,${campi[0].Foto}`);
        };

        const handleChangeCampiSelect = (e) => {
            const campusSelecionado = campi.find(campus => campus.SiglaCamp === e.target.value);
            setFoto(`data:image/png;base64,${campusSelecionado.Foto}`);
        }

        useEffect(() => {
            getCampi();
        }, []);

        return (
            <div className="App">
                <div className="selects">
                    <select className="campi" onChange={handleChangeCampiSelect}>
                        {campi.length > 0 ? 
                            campi.map(campus => 
                                <option key={campus.SiglaCamp} value={campus.SiglaCamp}>{campus.Nome}</option>
                            ) : 
                            <option value="">Carregando...</option>
                        }
                    </select>

                    <select className="cursos">
                        <option value="curso1">curso1</option>
                        <option value="curso2">curso2</option>
                        <option value="curso3">curso3</option>
                    </select>

                    <select className="disciplinas">
                        <option value="disciplina1">disciplina1</option>
                        <option value="disciplina2">disciplina2</option>
                        <option value="disciplina3">disciplina3</option>
                    </select>

                </div>

                <div className="grafico">
                    GRAFICO
                    {foto !== '' && <img src={foto} alt=""/>}
                </div>
            </div>
        );
}

export default App;
