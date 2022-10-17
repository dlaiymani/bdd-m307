

DROP TABLE IF EXISTS SOUTIENT;
DROP TABLE IF EXISTS SECOMPOSE;
DROP TABLE IF EXISTS ETUDIANT;
DROP TABLE IF EXISTS JURY;
DROP TABLE IF EXISTS SALLE;
DROP TABLE IF EXISTS PROFESSEUR;
DROP TABLE IF EXISTS ENTREPRISE;


CREATE TABLE ENTREPRISE (
	idEntreprise serial,
	nomEntreprise varchar(25),
	primary key(idEntreprise));

CREATE TABLE PROFESSEUR (
	noProfesseur serial,
	nomProfesseur varchar(25),
	primary key(noProfesseur)
);

CREATE TABLE SALLE (
	idSalle serial,
	nomSalle varchar(25),
	primary key(idSalle)
);

CREATE TABLE JURY (
	idJury serial,
	nomJury varchar(25),
	idSalle int,
	primary key(idJury),
	foreign key (idSalle) REFERENCES SALLE(idSalle)
	);

CREATE TABLE ETUDIANT (
	noEtudiant serial,
	nomEtudiant varchar(25),
	tuteurPresent int,
	idEntreprise int,
	noProfesseur int,
	primary key(noEtudiant),
	foreign key (idEntreprise) REFERENCES ENTREPRISE(idEntreprise),
	foreign key (noProfesseur) REFERENCES PROFESSEUR(noProfesseur)
);


CREATE TABLE SECOMPOSE (
	idJury int,
	noProfesseur int,
	primary key(idJury, noProfesseur),
	foreign key (idJury) REFERENCES JURY(idJury),
	foreign key (noProfesseur) REFERENCES PROFESSEUR(noProfesseur)
);

CREATE TABLE SOUTIENT (
	noEtudiant int,
	idJury int,
	dateSout date,
	note float,
	primary key(noEtudiant, idJury),
	foreign key (idJury) REFERENCES JURY(idJury),
	foreign key (noEtudiant) REFERENCES ETUDIANT(noEtudiant)
);




