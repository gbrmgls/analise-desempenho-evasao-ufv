const express = require("express");
const db = require("../database.js")
const router = express.Router();

router.get("/", (req, res, next) => {
    res.status(200).send("Hello!");
});

router.get("/bd_ufv", (req, res, next) => {
    db.raw(`SELECT Campus.SiglaCamp, Campus.nome, Campus.Foto, SUM(Turma.NumEstudantes) , SUM(Turma.Aprovados) 
            FROM Campus 
            LEFT JOIN Curso 
            ON Campus.SiglaCamp = Curso.SiglaCamp
            LEFT JOIN Turma
            ON Turma.CodCurso = Curso.CodCurso
            GROUP BY Campus.SiglaCamp`)
        .then((data) => {
            res.send(data[0]);
        }).catch(err => {
            console.log(err)
            res.send(err);
        })
});

router.get("/bd_ufv/:campus", (req, res, next) => {
    db.raw(`SELECT Curso.CodCurso, Curso.nome, SUM(Turma.NumEstudantes) , SUM(Turma.Aprovados) 
            FROM Campus 
            LEFT JOIN Curso 
            ON Campus.SiglaCamp = Curso.SiglaCamp
            LEFT JOIN Turma
            ON Turma.CodCurso = Curso.CodCurso
            WHERE Campus.SiglaCamp = "${req.params.campus}"
            GROUP BY Curso.CodCurso`)
        .then((data) => {
            res.send(data[0]);
        }).catch(err => {
            console.log(err)
            res.send(err);
        })
});

router.get("/bd_ufv/:campus/:curso", (req, res, next) => {
    db.raw(`SELECT Disciplina.nome, SUM(Turma.NumEstudantes), SUM(Turma.Aprovados) 
            FROM Campus 
            LEFT JOIN Curso 
            ON Campus.SiglaCamp = Curso.SiglaCamp
            LEFT JOIN Turma
            ON Turma.CodCurso = Curso.CodCurso
            LEFT JOIN Disciplina
            ON Turma.CodDisc = Disciplina.CodDisc
            WHERE Campus.SiglaCamp = "${req.params.campus}" 
            AND Curso.CodCurso = "${req.params.curso}"
            GROUP BY Turma.CodDisc, Disciplina.nome`)
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
