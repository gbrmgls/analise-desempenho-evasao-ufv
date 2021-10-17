import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

function App() {
        const [campi, setCampi] = useState([]);
        const [displayCampusOptions, setDisplayCampusOptions] = useState(false);
        const [selectedCampus, setSelectedCampus] = useState('');

        const [departamentos, setDepartamentos] = useState([]);
        const [foto, setFoto] = useState('');
        const [grafico, setGrafico] = useState({
            label: '',
            labels: [],
            data: [{
                value: 0,
                color: ''
            }],
            isLoaded: false
        });

        const getCampi = async() => {
            try {
                const res = await axios.get(`/route_example/bd_ufv`);
                const campi = res.data.map(campus => (
                    {
                        ...campus,
                        Foto: btoa(String.fromCharCode(...new Uint8Array(campus.Foto.data))),
                        dados: Array.from({length: 6}, () => Math.floor(Math.random() * 10))
                    }
                )).sort((a,b) => a.nome.localeCompare(b.nome));

                setCampi(campi);

                setGrafico({
                    labels: campi.map(campus => campus.nome),
                    label: 'Porcentagem de aprovação por Campus',
                    data: campi.map(campus => {
                        const aprovados = campus['SUM(Turma.Aprovados)'];
                        const numEstudantes = campus['SUM(Turma.NumEstudantes)'];
                        return {
                            value: !aprovados || !numEstudantes ? 0 : aprovados / numEstudantes * 100,
                            color: 'rgba(75, 192, 192, 1)'
                        };
                    }),
                    isLoaded: true
                });

                setFoto(`data:image/png;base64,${campi[0].Foto}`);
            } catch {
                return;
            }
        };

        // const getDepartamentos = async() => {
        //     const res = await axios.get(`/route_example/departamentos`);
        //     const departamentos = res.data;
        //     setDepartamentos(departamentos);
        // };

        const handleChangeCampiSelect = (e) => {
            const campusSelecionado = campi.find(campus => campus.SiglaCamp === e.target.value);
            setFoto(`data:image/png;base64,${campusSelecionado.Foto}`);
            setGrafico(campusSelecionado.dados);
        }

        useEffect(() => {
            getCampi();
        }, []);

        return (
            <div className="App">
                <div className="selects">
                    {/* <select className="campi" onChange={handleChangeCampiSelect}>
                        {campi.length > 0 ? 
                            campi.map(campus => 
                                <option key={campus.SiglaCamp} value={campus.SiglaCamp}>{campus.nome}</option>
                            ) : 
                            <option value="">Carregando...</option>
                        }
                    </select> */}
                    
                    <div className="selectCampus">
                        <div className="toggleOptions" onClick={() => setDisplayCampusOptions(!displayCampusOptions)}>
                                <div className="foto">
                                    {
                                        selectedCampus !== ''?
                                            <img src={foto} alt="" />
                                        : <></>
                                    }
                                </div>
                                <div className="nome">
                                    {selectedCampus}
                                </div>
                        </div>  
                        <div className="options" style={{'display' : displayCampusOptions? 'flex' : 'none'}}>
                            <div className="campus" onClick={() => (setSelectedCampus(''), setDisplayCampusOptions(!displayCampusOptions))}>
                                <div className="foto">
                                </div>
                                <div className="nome">
                                    Limpar
                                </div>
                            </div>
                            <div className="campus" onClick={() => (setSelectedCampus('CAF'), setDisplayCampusOptions(!displayCampusOptions))}>
                                <div className="foto">
                                    <img src={foto} alt="" />
                                </div>
                                <div className="nome">
                                    CAF
                                </div>
                            </div>
                            <div className="campus" onClick={() => (setSelectedCampus('CAV'), setDisplayCampusOptions(!displayCampusOptions))}>
                                <div className="foto">
                                    <img src={foto} alt="" />
                                </div>
                                <div className="nome">
                                    CAV
                                </div>
                            </div>
                            <div className="campus" onClick={() => (setSelectedCampus('CRP'), setDisplayCampusOptions(!displayCampusOptions))}>
                                <div className="foto">
                                    <img src={foto} alt="" />
                                </div>
                                <div className="nome">
                                    CRP
                                </div>
                            </div>
                        </div>
                    </div>

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

                {/* <div className="grafico">
                    GRAFICO
                    {foto !== '' && <img src={foto} alt=""/>}
                </div> */}
                <div className="grafico1">
                    <Bar
                        data={{
                            labels: grafico.isLoaded ? grafico.labels : [],
                            datasets: grafico.isLoaded ? [{
                                label: grafico.label,
                                categoryPercentage: .5,
                                barPercentage: 1,
                                // barThickness: 20,
                                // maxBarThickness: 20,s
                                // minBarLength: 2,
                                data: grafico.data.map(e => e.value),
                                backgroundColor: grafico.data.map(e => e.color),
                                // borderColor: [
                                //     'rgba(255, 99, 132, 1)',
                                //     'rgba(54, 162, 235, 1)',
                                //     'rgba(255, 206, 86, 1)',
                                //     'rgba(75, 192, 192, 1)',
                                //     'rgba(153, 102, 255, 1)',
                                //     'rgba(255, 159, 64, 1)'
                                // ],
                                // borderWidth: 1
                            }] : []
                        }}
                        height={100}
                        // width={100}
                        options= {{
                            responsive: true,
                            maintainAspectRatio: true,
                            scales: {
                                y: {
                                    beginAtZero: true
                                },
                            },
                        }}
                    />
                </div>
            </div>
        );
}

export default App;
