import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

const initialGraph = {
    label: '',
    labels: [],
    data: [{
        value: 0,
        color: ''
    }],
    isLoaded: false
};

const campiToGraph = (campi) => {
    return {
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
    }
};

const cursosCampusToGraph = (cursos, nomeCampus) => {
    return {
        labels: cursos.map(curso => curso.nome),
        label: 'Porcentagem de aprovação por Cursos do ' + nomeCampus,
        data: cursos.map(curso => {
            const aprovados = curso['SUM(Turma.Aprovados)'];
            const numEstudantes = curso['SUM(Turma.NumEstudantes)'];
            return {
                value: !aprovados || !numEstudantes ? 0 : aprovados / numEstudantes * 100,
                color: 'rgba(75, 192, 192, 1)'
            };
        }),
        isLoaded: true
    }
};

const disciplinasCursoToGraph = (disciplinas, nomeCampus, nomeCurso) => {
    return {
        labels: disciplinas.map(disciplina => disciplina.nome),
        label: 'Porcentagem de aprovação por Disciplina do Curso de ' + nomeCurso + ' do ' + nomeCampus,
        data: disciplinas.map(disciplina => {
            const aprovados = disciplina['SUM(Turma.Aprovados)'];
            const numEstudantes = disciplina['SUM(Turma.NumEstudantes)'];
            return {
                value: !aprovados || !numEstudantes ? 0 : aprovados / numEstudantes * 100,
                color: 'rgba(75, 192, 192, 1)'
            };
        }),
        isLoaded: true
    }
};

function App() {
        const [campi, setCampi] = useState([]);
        const [displayCampusOptions, setDisplayCampusOptions] = useState(false);
        const [selectedCampusOption, setSelectedCampusOption] = useState('');

        const [cursos, setCursos] = useState([]);
        const [disciplinas, setDisciplinas] = useState([]);
        const [departamentos, setDepartamentos] = useState([]);
        const [foto, setFoto] = useState('');
        const [selectedCampus, setSelectedCampus] = useState(undefined);
        const [selectedCurso, setSelectedCurso] = useState(undefined);
        const [selectedDisciplina, setSelectedDisciplina] = useState(undefined);

        const [grafico, setGrafico] = useState(initialGraph);

        const getCampi = async() => {
            try {
                const res = await axios.get(`/route_example/bd_ufv`);
                const campi = res.data.map(campus => (
                    {
                        ...campus,
                        Foto: btoa(String.fromCharCode(...new Uint8Array(campus.Foto.data)))
                    }
                )).sort((a,b) => a.nome.localeCompare(b.nome));
                console.log(campi)
                setCampi(campi);

                setGrafico(campiToGraph(campi));
            } catch {
                return;
            }
        };

        const getCursosCampus = async(campusNome) => {
            try {
                const res = await axios.get(`/route_example/bd_ufv/${campusNome}`);
                const cursos = res.data.sort((a,b) => a.nome.localeCompare(b.nome));
                setCursos(cursos);

                return cursos;
            } catch {
                return;
            }
        };

        const getDisciplinasCurso = async(campusNome, cursoNome) => {
            try {
                const res = await axios.get(`/route_example/bd_ufv/${campusNome}/${cursoNome}`);
                const disciplinas = res.data.sort((a,b) => a.nome.localeCompare(b.nome));
                setDisciplinas(disciplinas);

                return disciplinas;
            } catch {
                return;
            }
        };

        const handleChangeCampiSelect = async (e) => {
            if(e.target.value === "") {
                setSelectedCampus(undefined);
                setGrafico(campiToGraph(campi));
                return;
            }

            const campusSelecionado = campi.find(campus => campus.SiglaCamp === e.target.value);
            setSelectedCampus(campusSelecionado);
            setFoto(`data:image/png;base64,${campusSelecionado.Foto}`);

            const cursosCampus = await getCursosCampus(campusSelecionado.SiglaCamp);
            setGrafico(cursosCampusToGraph(cursosCampus, campusSelecionado.nome));
        };

        const handleChangeCursosSelect = async (e) => {
            if(e.target.value === "") {
                setSelectedCurso(undefined);
                setGrafico(cursosCampusToGraph(cursos, selectedCampus.nome));
                return;
            }

            const cursoSelecionado = cursos.find(curso => curso.CodCurso === Number(e.target.value));
            setSelectedCurso(cursoSelecionado);
            
            const disciplinasCurso = await getDisciplinasCurso(selectedCampus.SiglaCamp, cursoSelecionado.CodCurso);
            console.log(disciplinasCurso);
            setGrafico(disciplinasCursoToGraph(disciplinasCurso, selectedCampus.nome, cursoSelecionado.nome));
        };

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
                                        selectedCampusOption !== ''?
                                            <img src={foto} alt="" />
                                        : <></>
                                    }
                                </div>
                                <div className="nome">
                                    {selectedCampusOption}
                                </div>
                        </div>  
                        <div className="options" style={{'display' : displayCampusOptions? 'flex' : 'none'}}>
                            <div className="campus" onClick={() => (setSelectedCampusOption(''), setDisplayCampusOptions(!displayCampusOptions))}>
                                <div className="foto">
                                </div>
                                <div className="nome">
                                    Limpar
                                </div>
                            </div>
                            <div className="campus" onClick={() => (setSelectedCampusOption('CAF'), setDisplayCampusOptions(!displayCampusOptions))}>
                                <div className="foto">
                                    <img src={foto} alt="" />
                                </div>
                                <div className="nome">
                                    CAF
                                </div>
                            </div>
                            <div className="campus" onClick={() => (setSelectedCampusOption('CAV'), setDisplayCampusOptions(!displayCampusOptions))}>
                                <div className="foto">
                                    <img src={foto} alt="" />
                                </div>
                                <div className="nome">
                                    CAV
                                </div>
                            </div>
                            <div className="campus" onClick={() => (setSelectedCampusOption('CRP'), setDisplayCampusOptions(!displayCampusOptions))}>
                                <div className="foto">
                                    <img src={foto} alt="" />
                                </div>
                                <div className="nome">
                                    CRP
                                </div>
                            </div>
                        </div>
                    </div>

                    <select className="cursos" onChange={handleChangeCursosSelect}>
                        <option value="">Selecione um Curso</option>
                        {cursos.length > 0 ? 
                            cursos.map(curso => 
                                <option key={curso.CodCurso} value={curso.CodCurso}>{curso.nome}</option>
                            ) : 
                            <option value="">Carregando...</option>
                        }
                    </select>

                    <select className="disciplinas">
                        <option value="disciplina1">disciplina1</option>
                        <option value="disciplina2">disciplina2</option>
                        <option value="disciplina3">disciplina3</option>
                    </select>

                </div>

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
