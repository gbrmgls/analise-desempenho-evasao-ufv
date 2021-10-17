import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import Modal from 'react-modal';

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

const turmasDisciplinaToGraph = (disciplina, nomeDisciplina, nomeCampus, nomeCurso) => {
    const keysToRemove = [
        'Abandonos',
        'Ano',
        'Aprovados',
        'CodCurso',
        'CodDisc',
        'MaiorNota',
        'MenorNota',
        'MédiaNota',
        'NumEstudantes',
        'Reprovados',
        'Semestre'];

    return {
        labels: ['Notas0a10', 'Notas10a20', 'Notas20a30', 'Notas30a40', 'Notas40a50', 'Notas50a60', 'Notas60a70', 'Notas70a80', 'Notas80a90', 'Notas90a100'],
        label: 'Notas de ' + nomeDisciplina + ' do Curso de ' + nomeCurso + ' do ' + nomeCampus,
        data: Object.keys(disciplina).filter(key => !keysToRemove.includes(key))
            .map(key => {
                return {
                    value: disciplina[key],
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
        const [turmas, setTurmas] = useState([]);
        const [notas, setNotas] = useState([]);
        const [departamentos, setDepartamentos] = useState([]);
        const [contatos, setContatos] = useState([]);
        const [foto, setFoto] = useState('');

        const [selectedCampus, setSelectedCampus] = useState(undefined);
        const [selectedDepto, setSelectedDepto] = useState(undefined);
        const [selectedCurso, setSelectedCurso] = useState(undefined);
        const [selectedDisciplina, setSelectedDisciplina] = useState(undefined);
        const [selectedTurma, setSelectedTurma] = useState(undefined);

        const [grafico, setGrafico] = useState(initialGraph);

        const [modalCampusOpen, setModalCampusOpen] = useState(false);
        const [modalDeptoOpen, setModalDeptoOpen] = useState(false);

        const getCampi = async() => {
            try {
                const res = await axios.get(`/route_example/bd_ufv`);
                const campi = res.data.map(campus => (
                    {
                        ...campus,
                        Foto: `data:image/png;base64,${btoa(String.fromCharCode(...new Uint8Array(campus.Foto.data)))}`
                    }
                )).sort((a,b) => a.nome.localeCompare(b.nome));

                setCampi(campi);

                setGrafico(campiToGraph(campi));
            } catch {
                return;
            }
        };

        const getDepartamentos = async() => {
            try {
                const res = await axios.get(`/route_example/bd_ufv/departamento`);
                const deptos = res.data
                console.log(deptos)
                setDepartamentos(deptos)
            } catch {
                return;
            }
        };

        const getContatos = async() => {
            try {
                const res = await axios.get(`/route_example/bd_ufv/departamento/contatos`);
                const conts = res.data
                console.log(conts)
                setContatos(conts)
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

        const getNotasDisciplina = async(curso, disciplina) => {
            try {
                const resNotas = await axios.get(`/route_example/bd_ufv/disciplina/${curso}/${disciplina}/`);
                const notas = resNotas.data.sort((a,b) => a.nome.localeCompare(b.nome))[0];

                const resTurmas = await axios.get(`/route_example/bd_ufv/disciplina/turmas/${curso}/${disciplina}/`);
                const turmas = resTurmas.data;
                return {notas, turmas};
            } catch {
                return;
            }
        };

        const handleChangeCampiSelect = async (e) => {
            setSelectedCurso(undefined);
            setSelectedDisciplina(undefined);
            setCursos([]);
            setDisciplinas([]);
            setTurmas([]);
            setNotas([]);

            if(e === "") {
                setSelectedCampus(undefined);

                setGrafico(campiToGraph(campi));
                return;
            }

            const campusSelecionado = campi.find(campus => campus.SiglaCamp === e);
            setSelectedCampus(campusSelecionado);
            setFoto(campusSelecionado.Foto);

            const cursosCampus = await getCursosCampus(campusSelecionado.SiglaCamp);
            setGrafico(cursosCampusToGraph(cursosCampus, campusSelecionado.nome));
        };

        const handleChangeCursosSelect = async (e) => {
            setDisciplinas([]);
            setTurmas([]);
            setNotas([]);
            setSelectedDisciplina(undefined);
            if(e.target.value === "") {
                setSelectedCurso(undefined);

                setGrafico(cursosCampusToGraph(cursos, selectedCampus.nome));
                return;
            }

            const cursoSelecionado = cursos.find(curso => curso.CodCurso === Number(e.target.value));
            setSelectedCurso(cursoSelecionado);
            
            const disciplinasCurso = await getDisciplinasCurso(selectedCampus.SiglaCamp, cursoSelecionado.CodCurso);

            setGrafico(disciplinasCursoToGraph(disciplinasCurso, selectedCampus.nome, cursoSelecionado.nome));
        };

        const handleChangeDisciplinasSelect = async (e) => {
            setTurmas([]);
            setNotas([]);
            if(e.target.value === "") {
                setSelectedDisciplina(undefined);

                setGrafico(disciplinasCursoToGraph(disciplinas, selectedCampus.nome, selectedCurso.nome));
                return;
            }

            const disciplinaSelecionada = disciplinas.find(disciplina => disciplina.CodDisc === e.target.value);
            setSelectedDisciplina(disciplinaSelecionada);
            
            const disciplinaNotas = await getNotasDisciplina(selectedCurso.CodCurso, disciplinaSelecionada.CodDisc);

            setGrafico(turmasDisciplinaToGraph(disciplinaNotas.notas, disciplinaSelecionada.nome, selectedCampus.nome + ' (Todos semestres)', selectedCurso.nome));
            setTurmas(disciplinaNotas.turmas);
            setNotas(disciplinaNotas.notas);
        };

        const handleChangeTurmasSelect = async (e) => {
            if(e.target.value === "") {
                setSelectedTurma(undefined);

                setGrafico(turmasDisciplinaToGraph(notas, selectedDisciplina.nome, selectedCampus.nome + ' (Todos semestres)', selectedCurso.nome));
                return;
            }
            const semestre = e.target.value.split('+');
            const turmaSelecionada = turmas.find(turma => turma.Ano === Number(semestre[0]) && turma.Semestre === Number(semestre[1]));

            setGrafico(turmasDisciplinaToGraph(turmaSelecionada, selectedDisciplina.nome, selectedCampus.nome, selectedCurso.nome));
        };

        const handleChangeDeptosSelect = async (e) => {
            if(e.target.value === "") {
                setSelectedDepto(undefined);
                return;
            }

            
            console.log(e.target.value);
            const deptoSelecionado = departamentos.find(depto => depto.SiglaDepto == e.target.value);
            console.log(deptoSelecionado);
            setSelectedDepto(deptoSelecionado);

            console.log(selectedDepto);
        }

        const openCampusModal = () => setModalCampusOpen(true);
        const closeCampusModal = () => setModalCampusOpen(false);

        const openDeptoModal = () => setModalDeptoOpen(true);
        const closeDeptoModal = () => setModalDeptoOpen(false);

        useEffect(() => {
            getCampi();
            getDepartamentos();
            getContatos();
        }, []);

        return (
            <div className="App">
                <Modal
                    isOpen={modalCampusOpen}
                    contentLabel={selectedCampus == undefined ? "Selecione um campus" : selectedCampus.SiglaCamp + " - " + selectedCampus.nome}
                >
                    <h1>{selectedCampus == undefined ? "Selecione um campus" : selectedCampus.SiglaCamp + " - " + selectedCampus.nome}</h1>
                    <button onClick={closeCampusModal}>Fechar</button>
                    <div className="modalContent">
                        <div className="modalFoto">
                                    {
                                        selectedCampus !== undefined ?
                                            <img src={selectedCampus.Foto} alt="" />
                                        : <></>
                                    }
                                </div>
                        <h2>Endereço: {selectedCampus == undefined ? "" : selectedCampus.End}</h2>
                    </div>
                </Modal>

                <Modal
                    isOpen={modalDeptoOpen}
                    contentLabel={selectedDepto == undefined ? "Selecione um departamento" : selectedDepto.SiglaDepto + " - " + selectedDepto.Nome}
                >
                    <h1>{selectedDepto == undefined ? "Selecione um departamento" : selectedDepto.SiglaDepto + " - " + selectedDepto.Nome}</h1>
                    <button onClick={closeDeptoModal}>Fechar</button>
                    <div className="modalContent">
                        <h2>Contatos: </h2>
                        <ul>
                            {contatos.length > 0 && selectedDepto !== undefined ?
                                contatos.filter(cont => cont.SiglaDepto == selectedDepto.SiglaDepto).map(cont => {
                                    if(cont.tel == null) return "Esse departamento não possui contatos."
                                    var strtel = cont.tel.toString()
                                    return <li>{"(51) " + strtel.substring(0,4) + "-" + strtel.substring(4)}</li>
                                }) : "Esse departamento não possui contatos."
                            }
                        </ul>
                    </div>
                </Modal>
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
                                        selectedCampus !== undefined ?
                                            <img src={selectedCampus.Foto} alt="" />
                                        : <></>
                                    }
                                </div>
                                <div className="nome">
                                    {selectedCampus !== undefined ? selectedCampus.SiglaCamp : ''}
                                </div>
                        </div>  
                        <div className="options" style={{'display' : displayCampusOptions? 'flex' : 'none'}}>
                            <div className="campus" onClick={() => (handleChangeCampiSelect(''), setDisplayCampusOptions(!displayCampusOptions))}>
                                <div className="foto">
                                </div>
                                <div className="nome">
                                    Limpar
                                </div>
                            </div>
                            {campi.length > 0 ? 
                                campi.map(campus => 
                                    <div className="campus" onClick={() => (handleChangeCampiSelect(campus.SiglaCamp), setDisplayCampusOptions(!displayCampusOptions))}>
                                        <div className="foto">
                                            <img src={campus.Foto} alt="" />
                                        </div>
                                        <div className="nome">
                                            {campus.SiglaCamp}
                                        </div>
                                    </div>
                                ) : 
                                <option value="">Carregando...</option>
                            }
                        </div>
                    </div>
                    
                    <select className="departamentos" onChange={handleChangeDeptosSelect}>
                        <option value="">Selecione um Departamento</option>
                        {departamentos.length > 0 ? 
                            departamentos.map(depto => 
                                <option key={depto.SiglaDepto} value={depto.SiglaDepto}>{depto.Nome}</option>
                            ) : 
                            <option value="">Carregando...</option>
                        }
                    </select>

                    <select className="cursos" onChange={handleChangeCursosSelect}>
                        <option value="">Selecione um Curso</option>
                        {cursos.length > 0 ? 
                            cursos.map(curso => 
                                <option key={curso.CodCurso} value={curso.CodCurso}>{curso.nome}</option>
                            ) : 
                            <option value="">Carregando...</option>
                        }
                    </select>

                    <select className="disciplinas" onChange={handleChangeDisciplinasSelect}>
                        <option value="">Selecione uma Disciplina</option>
                        {disciplinas.length > 0 ? 
                            disciplinas.map((disciplina, index) => 
                                <option key={disciplina.CodDisc + `${index}`} value={disciplina.CodDisc}>{disciplina.nome}</option>
                            ) : 
                            <option value="">Carregando...</option>
                        }
                    </select>

                    {turmas.length > 0 && 
                        <select className="turmas" onChange={handleChangeTurmasSelect}>
                            <option value="">Selecione um semestre</option>
                            {turmas.map((turma, index) => 
                                <option key={index} value={turma.Ano+'+'+turma.Semestre}>{`${turma.Ano}/${turma.Semestre}`}</option>
                            )}

                        </select>
                    }

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

                <div className="info">
                    Info:

                    <div className="infoCampus">
                    { selectedCampus != undefined ?
                            <a style={{cursor: 'pointer'}} onClick={openCampusModal}>Informações do Campus</a> : ''
                    }
                    </div> 
                    <div className="infoDepto">
                    { selectedDepto != undefined ?
                            <a style={{cursor: 'pointer'}} onClick={openDeptoModal}>Informações do Departamento</a> : ''
                    }
                    </div> 
                </div>
            </div>
        );
}

export default App;
