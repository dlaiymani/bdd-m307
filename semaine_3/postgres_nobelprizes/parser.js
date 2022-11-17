const pool = require("./database/db");
const fs = require('fs')

var laureates = [];
var categories = [];


const loadData = () => {
    try {
        const dataBuffer = fs.readFileSync('prize.json')
        const dataJSON = dataBuffer.toString()
        return JSON.parse(dataJSON)
    } catch (e) {
        return []
    }
}

// add category to database if not exists
async function insertCategory(category){
    // check if category already inserted
    const duplicateCategory = categories.find((cat) => cat.name === category)
    if (!duplicateCategory){
        let cols = [category];
        const client = await pool.connect();
        try {
            const res = await client.query('INSERT INTO category(category_name) VALUES($1) RETURNING id', cols)
            categories.push({
                id: res.rows[0].id,
                name: category
            });
            return res.rows[0].id;
        } catch (err) {
            console.log(err.stack)
        } finally {
            client.release()
        }
    }else{
        return duplicateCategory.id;
    }
}

// add laureate to database if not exists
async function insertLaureate(id,firstname,surname){
    // check if laureate already inserted
    const duplicateLaureate = laureates.find((laur) => laur.id === id)
    if (!duplicateLaureate){
        let cols = [id,firstname,surname];
        const client = await pool.connect();
        try {
            const res = await client.query('INSERT INTO laureate(id,firstname,surname) VALUES($1,$2,$3) RETURNING id', cols)
            laureates.push({
                id: id,
                firstname: firstname,
                surname: surname
            });
            return res.rows[0].id;
        } catch (err) {
            console.log(err.stack)
        } finally {
            client.release()
        }
    }else{
        return duplicateLaureate.id;
    }
}

async function insertPrize(year, category_id){
    const client = await pool.connect();
    try {
        const cols = [year, category_id];
        const res = await client.query('INSERT INTO prize(year, category_id) VALUES($1,$2) RETURNING id', cols)
        return res.rows[0].id;
    } catch (err) {
        console.log(err.stack)
        return -1;
    } finally {
        client.release()
    }
}

async function insertPrizeLaureate(prize_id, laureate_id,motivation){
    const client = await pool.connect();
    try {
        const cols = [prize_id, laureate_id,motivation];
        const res = await client.query('INSERT INTO prize_laureate(prize_id, laureate_id,motivation) VALUES($1,$2,$3) RETURNING id', cols)
        return res.rows[0].id;
    } catch (err) {
        console.log(err.stack)
        return -1;
    } finally {
        client.release()
    }
}

var data = loadData();
data = data.prizes;


(async () => {
    for (const prize of data){
        let year = prize.year;
        let category = prize.category;
        let catId = await insertCategory(category);
        let prize_id = await insertPrize(year,catId);
        if(prize.laureates){
            for (const laureate of prize.laureates){
                let motivation = laureate.motivation;
                let laureate_id = await insertLaureate(laureate.id,laureate.firstname,laureate.surname);
                await insertPrizeLaureate(prize_id,laureate_id,motivation.replace('"', ''));
            }
        }
    }
    console.log("Parsing done! SQL tables are filled!")
})();

