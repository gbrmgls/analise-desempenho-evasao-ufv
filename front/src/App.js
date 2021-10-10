import React from 'react';
import './App.css';

function App() {
        return (
            <div className="App">
                <div className="selects">
                    <select className="campi">
                        <option value="vicosa">Vicosa</option>
                        <option value="florestal">Florestal</option>
                        <option value="rio_paranaiba">Rio Paranaiba</option>
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
                </div>
            </div>
        );
}

export default App;
