const express = require("express");
const db = require("../database.js")
const router = express.Router();

router.get("/", (req, res, next) => {
    res.status(200).send("Hello!");
});

// Consulta envolvendo a junção de três ou mais relações
router.get("/bd_ufv", (req, res, next) => {
    db.raw(`SELECT Campus.SiglaCamp, Campus.nome, Campus.Endereço AS End, Campus.Foto, SUM(Turma.NumEstudantes) , SUM(Turma.Aprovados) 
            FROM Campus 
            LEFT JOIN Curso 
            ON Campus.SiglaCamp = Curso.SiglaCamp
            LEFT JOIN Turma
            ON Turma.CodCurso = Curso.CodCurso
            GROUP BY Campus.SiglaCamp
            ORDER BY sum(Turma.Aprovados)/sum(Turma.NumEstudantes)`)
        .then((data) => {
            res.send(data[0]);
        }).catch(err => {
            console.log(err)
            res.send(err);
        })
});

// Consulta envolvendo a junção de apenas duas relações
router.get("/bd_ufv/curso/:curso", (req, res, next) => {
    db.raw(`SELECT Disciplina.CodDisc, Disciplina.nome, sum(Turma.NumEstudantes), sum(Turma.Aprovados) 
            FROM Turma
            JOIN Disciplina
            ON Turma.CodDisc = Disciplina.CodDisc
            WHERE Turma.CodCurso = '${req.params.curso}'
            GROUP BY Disciplina.CodDisc, Disciplina.Nome
            ORDER BY sum(Turma.Aprovados)/sum(Turma.NumEstudantes)`)
        .then((data) => {
            res.send(data[0]);
        }).catch(err => {
            console.log(err)
            res.send(err);
        })
});

// Consulta envolvendo apenas as operações de seleção e projeção
router.get("/bd_ufv/departamento/", (req, res, next) => {
    db.raw(`SELECT Departamento.SiglaDepto, Departamento.nome 
            FROM Departamento`)
        .then((data) => {
            res.send(data[0]);
        }).catch(err => {
            console.log(err)
            res.send(err);
        })
});

// Consulta envolvendo a junção de apenas duas relações (Junção externa)
router.get("/bd_ufv/departamento/contatos", (req, res, next) => {
    db.raw(`SELECT *
            FROM Departamento
            NATURAL LEFT JOIN Contatos`)
        .then((data) => {
            res.send(data[0]);
        }).catch(err => {
            console.log(err)
            res.send(err);
        })
});

// Consulta envolvendo a junção de três ou mais relações
router.get("/bd_ufv/departamento/aprovacao", (req, res, next) => {
    db.raw(`SELECT Departamento.nome, sum(Turma.NumEstudantes), sum(Turma.Aprovados) 
            FROM Departamento
            JOIN Disciplina
            ON Departamento.SiglaDepto = Disciplina.SiglaDepto
            JOIN Turma
            ON Turma.CodDisc = Disciplina.CodDisc
            GROUP BY Departamento.SiglaDepto
            ORDER BY sum(Turma.Aprovados)/sum(Turma.NumEstudantes)`)
        .then((data) => {
            res.send(data[0]);
        }).catch(err => {
            console.log(err)
            res.send(err);
        })
});

// Consulta envolvendo funções de agregação
router.get("/bd_ufv/departamento/:depto", (req, res, next) => {
    db.raw(`SELECT Disciplina.CodDisc, Disciplina.nome, sum(Turma.NumEstudantes), sum(Turma.Aprovados) 
            FROM Disciplina
            JOIN Turma
            ON Turma.CodDisc = Disciplina.CodDisc
            WHERE Disciplina.SiglaDepto = '${req.params.depto}'
            GROUP BY Disciplina.CodDisc, Disciplina.Nome
            ORDER BY sum(Turma.Aprovados)/sum(Turma.NumEstudantes)`)
        .then((data) => {
            res.send(data[0]);
        }).catch(err => {
            console.log(err)
            res.send(err);
        })
});

// Consulta envolvendo subconsultas aninhadas
router.get("/bd_ufv/disciplina/:curso/:disciplina/min", (req, res, next) => {
    db.raw(`SELECT Turma.Ano, Turma.Semestre, Turma.Aprovados/Turma.NumEstudantes AS TaxAprov
            FROM Turma
            WHERE Turma.CodDisc = '${req.params.disciplina}'
            AND Turma.CodCurso = ${req.params.curso}
            AND Turma.NumEstudantes <> 0
            AND Turma.Aprovados/Turma.NumEstudantes = (
                SELECT min(Turma.Aprovados/Turma.NumEstudantes)
                FROM Turma
                WHERE Turma.CodDisc = '${req.params.disciplina}'
                AND Turma.CodCurso = ${req.params.curso}
                AND Turma.NumEstudantes <> 0
            )`)
        .then((data) => {
            res.send(data[0]);
        }).catch(err => {
            console.log(err)
            res.send(err);
        })
});

// Consulta envolvendo apenas seleção
router.get("/bd_ufv/disciplina/turmas/:curso/:disciplina/", (req, res, next) => {
    db.raw(`SELECT *
            FROM Turma
            WHERE Turma.CodDisc = '${req.params.disciplina}' AND
            Turma.Codcurso = ${req.params.curso}`)
        .then((data) => {
            res.send(data[0]);
        }).catch(err => {
            console.log(err)
            res.send(err);
        })
});
// Consulta envolvendo funções de agregação
router.get("/bd_ufv/disciplina/:disciplina/", (req, res, next) => {
    db.raw(`SELECT Turma.CodDisc, sum(Turma.Notas0a10), sum(Turma.Notas10a20), sum(Turma.Notas20a30), sum(Turma.Notas30a40), sum(Turma.Notas40a50), sum(Turma.Notas50a60), sum(Turma.Notas60a70), sum(Turma.Notas70a80), sum(Turma.Notas80a90), sum(Turma.Notas90a100)
            FROM Turma
            WHERE Turma.CodDisc = '${req.params.disciplina}'
            GROUP BY Turma.CodDisc`)
        .then((data) => {
            res.send(data[0]);
        }).catch(err => {
            console.log(err)
            res.send(err);
        })
});

// Consulta envolvendo funções de agregação
router.get("/bd_ufv/disciplina/:curso/:disciplina/", (req, res, next) => {
    db.raw(`SELECT Turma.CodDisc, Turma.CodCurso, sum(Turma.Notas0a10), sum(Turma.Notas10a20), sum(Turma.Notas20a30), sum(Turma.Notas30a40), sum(Turma.Notas40a50), sum(Turma.Notas50a60), sum(Turma.Notas60a70), sum(Turma.Notas70a80), sum(Turma.Notas80a90), sum(Turma.Notas90a100)
            FROM Turma
            WHERE Turma.CodDisc = '${req.params.disciplina}' AND
            Turma.CodCurso = ${req.params.curso}
            GROUP BY Turma.CodDisc, Turma.CodCurso`)
        .then((data) => {
            res.send(data[0]);
        }).catch(err => {
            console.log(err)
            res.send(err);
        })
});

// Consulta envolvendo uma das operações sobre conjuntos (Diferença / NOT IN)
router.get("/bd_ufv/sem_turma", (req, res, next) => {
    db.raw(`SELECT CodDisc, Ano, nome 
            FROM Disciplina 
            WHERE (CodDisc, Ano) NOT IN (
                SELECT CodDisc, Ano
                FROM Turma
            )`)
        .then((data) => {
            res.send(data[0]);
        }).catch(err => {
            console.log(err)
            res.send(err);
        })
});
// Consulta envolvendo funções de agregação
router.get("/bd_ufv/:campus", (req, res, next) => {
    db.raw(`SELECT Curso.CodCurso, Curso.nome, SUM(Turma.NumEstudantes) , SUM(Turma.Aprovados) 
            FROM Campus 
            JOIN Curso 
            ON Campus.SiglaCamp = Curso.SiglaCamp
            JOIN Turma
            ON Turma.CodCurso = Curso.CodCurso
            WHERE Campus.SiglaCamp = "${req.params.campus}"
            GROUP BY Curso.CodCurso
            ORDER BY sum(Turma.Aprovados)/sum(Turma.NumEstudantes)`)
        .then((data) => {
            res.send(data[0]);
        }).catch(err => {
            console.log(err)
            res.send(err);
        })
});

// router.get("/:id", (req, res, next) => {
//     res.status(200).send(`Hello! Parameter: ${req.params.id}`);
// });


module.exports = router;
