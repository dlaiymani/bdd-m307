--Professeur responsable du stage de l’étudiant ‘toto’
SELECT p.nomProfesseur 
FROM professeur p INNER JOIN etudiant e ON e.noProfesseur=p.noProfesseur
WHERE e.nomEtudiant='toto';



-- Nombre de professeur ayant participé à au moins un jury.
SELECT COUNT(DISTINCT noProfesseur) FROM SECOMPOSE ;


-- Jury de l’étudiant ‘toto’ (affichage : nomProfesseur)
SELECT p.nomProfesseur 
FROM etudiant e INNER JOIN soutient s ON e.noEtudiant=s.noEtudiant
INNER JOIN secompose se ON s.idJury = se.idJury
INNER JOIN professeur p ON se.noProfesseur = p.noProfesseur
WHERE e.nomEtudiant=’toto’;

-- Liste des étudiant(s) ayant eu la même note  que l’étudiant ‘toto
SELECT e.nomEtudiant FROM etudiant e INNER JOIN soutient s 
ON s.noEtudiant = e.noEtudiant
WHERE s.note = (SELECT s.note FROM etudiant e inner join soutient s
	ON s.noEtudiant = e.noEtudiant
WHERE e.nomEtudiant=’toto’) ;


-- Professeur(s) devant asssiter à  plus de 5 soutenances
SELECT p.noProfesseur, p.nomProfesseur, COUNT(*)
FROM soutient s INNER JOIN secompose se ON s.idJury=se.idJury
INNER JOIN professeur p ON se.noProfesseur=p.noProfesseur
GROUP BY p.noProfesseur, p.nomProfesseur 
HAVING COUNT(*) > 5 ;


--Planning des soutenances (affichage : nomEtudiant + nomSalle + nom du professeur responsable + date de soutenance + nomEntreprise)
SELECT e.nomEtudiant, sa.nomSalle, p.nomProfesseur, s.dateSout, ent.nomEntreprise
FROM professeur p INNER JOIN etudiant e ON e.noProfesseur=p.noProfesseur
INNER JOIN entreprise ent ON e.idEntreprise=ent.idEntrepise
INNER JOIN soutient s ON e.noEtudiant=s.noEtudiant
INNER JOIN jury j ON s.idJury=j.idJury
INNER JOIN salle sa ON  j.idSalle=sa.idSalle;


--Nombre de soutenances avec tuteur entreprise présent par salle

SELECT sa.idSalle, sa.nomSalle, COUNT(*)
FROM soutient s INNER JOIN jury j ON s.idJury=j.idJury
INNER JOIN salle sa ON j.idSalle=sa.idSalle
INNER JOIN etudiant e ON e.noEtudiant=s.noEtudiant
WHERE e.tuteurPresent=1
GROUP BY sa.idSalle, sa.nomSalle;












