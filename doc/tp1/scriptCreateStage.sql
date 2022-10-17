DROP TABLE IF EXISTS SOUTIENT;
DROP TABLE IF EXISTS SECOMPOSE;
DROP TABLE IF EXISTS ETUDIANT;
DROP TABLE IF EXISTS JURY;
DROP TABLE IF EXISTS SALLE;
DROP TABLE IF EXISTS PROFESSEUR;
DROP TABLE IF EXISTS ENTREPRISE;


CREATE TABLE ENTREPRISE (
	idEntreprise INT GENERATED ALWAYS AS IDENTITY,
	nomEntreprise varchar(25),
	constraint pkEntreprise primary key(idEntreprise));

CREATE TABLE PROFESSEUR (
	noProfesseur INT GENERATED ALWAYS AS IDENTITY,
	nomProfesseur varchar(25),
	constraint pkProfesseur primary key(noProfesseur)
);

CREATE TABLE SALLE (
	idSalle INT GENERATED ALWAYS AS IDENTITY,
	nomSalle varchar(25),
	constraint pkSalle primary key(idSalle)
);

CREATE TABLE JURY (
	idJury INT GENERATED ALWAYS AS IDENTITY,
	nomJury varchar(25),
	idSalle int,
	constraint pkJury primary key(idJury),
	constraint fkJurySalle foreign key (idSalle) REFERENCES SALLE(idSalle)
	);

CREATE TABLE ETUDIANT (
	noEtudiant INT GENERATED ALWAYS AS IDENTITY,
	nomEtudiant varchar(25),
	tuteurPresent int,
	idEntreprise int,
	noProfesseur int,
	constraint pkEtudiant primary key(noEtudiant),
	constraint fkEtudiantEntreprise foreign key (idEntreprise) REFERENCES ENTREPRISE(idEntreprise),
	constraint fkEtudiantProfesseur foreign key (noProfesseur) REFERENCES PROFESSEUR(noProfesseur)
);


CREATE TABLE SECOMPOSE (
	idJury int,
	noProfesseur int,
	constraint pkSeCompose primary key(idJury, noProfesseur),
	constraint fkSeComposeJury foreign key (idJury) REFERENCES JURY(idJury),
	constraint fkSeComposeProfesseur foreign key (noProfesseur) REFERENCES PROFESSEUR(noProfesseur)
);

CREATE TABLE SOUTIENT (
	noEtudiant int,
	idJury int,
	dateSout date,
	note float,
	constraint pkSoutient primary key(noEtudiant, idJury),
	constraint fkSoutientJury foreign key (idJury) REFERENCES JURY(idJury),
	constraint fkSoutientEtudiant foreign key (noEtudiant) REFERENCES ETUDIANT(noEtudiant)
);




