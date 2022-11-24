const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./database/db");
const {Client,Passport, Sale, Item, SaleItem} = require("./models");
const {connectionString} = require("pg/lib/defaults");

const port = 3000;
const app = express();

async function aunthenticateDb(){
    return sequelize.authenticate();
}

async function seed_data(){
    let clients = [
        {id: 100, firstname: 'Abigail', lastname: 'Kylie'},
        {id: 110, firstname: 'Anna', lastname: 'Carolyn'}
    ]
    let passports = [
        {country: 'France', passportNumber: 111201, issueDate: '2014-12-07',expirationDate:'2024-12-07'},
        {country: 'USA', passportNumber: 901222, issueDate: '2019-11-07',expirationDate:'2027-11-07'}
    ]
    await Client.bulkCreate(clients);
    await Passport.bulkCreate(passports);

    for (let i = 0; i < passports.length; i++){
        passport = passports[i];
        cl = clients[i];
        pass = await Passport.findOne({where : { passportNumber: passport.passportNumber}});
        client = await Client.findOne({where : { id: cl.id}});
        await client.setPassport(pass);
    }

    // insert dummy sales
    let dummy_sales = [
        {saledate: '2020-01-15', saletext: 'sale 1', clientId: 100},
        {saledate: '2020-01-18', saletext: 'sale 2', clientId: 100},
        {saledate: '2020-01-21', saletext: 'sale 3', clientId: 110},
        {saledate: '2020-01-25', saletext: 'sale 4', clientId: 110},
        {saledate: '2020-02-25', saletext: 'sale 5', clientId: 110},
    ]
    await Sale.bulkCreate(dummy_sales);

    // insert dummy items
    let dummy_items = [
        {itemname: 'Pocket knife—Nile', itemtype: "E",itemcolor:"Brown"},
        {itemname: 'Pocket knife—Avon', itemtype: "E",itemcolor:"Brown"},
        {itemname: 'Compass', itemtype: "N",itemcolor:"_"},
        {itemname: 'Hammock', itemtype: "F",itemcolor:"Khaki"},
        {itemname: 'Safari cooking kit', itemtype: "E",itemcolor:"_"}
    ]
    await Item.bulkCreate(dummy_items);

    let dummy_sale_items = [
        {quantity: 2, price: 10, saleno: 1, itemno: 3},
        {quantity: 3, price: 24, saleno: 1, itemno: 1},
        {quantity: 1, price: 8, saleno: 2, itemno: 1},
        {quantity: 2, price: 10, saleno: 3, itemno: 3},
        {quantity: 3, price: 60, saleno: 3, itemno: 5},
        {quantity: 1, price: 20, saleno: 4, itemno: 4},
        {quantity: 1, price: 10, saleno: 4, itemno: 2},
        {quantity: 2, price: 10, saleno: 5, itemno: 3}
    ]

    await SaleItem.bulkCreate(dummy_sale_items);
}


app.use(bodyParser.json());

app.get("/clients/lazy/:id", async (req,res)=>{
    let id = req.params.id;
    // rechercher par clé primaire
    const client = await Client.findByPk(id);
    let response = {
        client_id: client.clientid,
        client_fullname: client.firstname  + " " + client.lastname
    };
    // obtenir toutes les ventes liées à ce client
    const sales = await client.getSales();
    response.sales = sales;
    return res.status(200).send({status: 1, data: response});
})

app.get("/clients/eager/:id", async (req,res)=>{
    let id = req.params.id;
    // rechercher par clé primaire
    const client = await Client.findByPk(id,{include: Sale});
    return res.status(200).send({status: 1, data: client});
})

app.get("/clients/spentmost", async (req,res)=>{
    // lazy loading approach
    try{
        let clients = await Client.findAll();
        for(let client of clients){
            let clientSales = await client.getSales();
            let totalspendings = 0;
            for (const sale of clientSales) {
                let items = await sale.getItems();
                for(let item of items){
                    item.saleItem.price;
                    totalspendings += item.saleItem.price;
                }
            }
            client.setDataValue('totalspendings', totalspendings);
        };
        // Trier l'objet sequelize clients par totalspendings decroissant.
        clients=clients.sort((a, b) =>
            parseFloat(b.getDataValue("totalspendings")) - parseFloat(a.getDataValue("totalspendings")));
        return res.status(200).send({status: 1, data: clients[0]});
    }catch (e){
        console.error(e);
        return res.status(500).send({status:0, data: "internal error"})
    }
});

app.put("/clients/:id", async (req,res)=>{
   let id = req.params.id;
   let data = {
     firstname: req.body.firstname,
     lastname: req.body.lastname
   };
   /*
   try{
       await Client.update(data, {where: {id:id}});
       return res.status(200).json("Client updated successfully!!");
   }catch (error){
       return res.status(500).json("Error in update");
   }
   */
    // another approach:
    const client = await Client.findOne({where: {id:id}});
    if (!client) {
        throw Error(`Client not updated. id: ${id}`);
        res.status(500).send({success:0, data: "Error 500"});
    }
    client.firstname = data.firstname;
    client.lastname = data.lastname;
    await client.save();
    return res.status(200).json("Client updated successfully!!");
});

app.post("/clients",async (req,res)=>{
   let data = {
       id: req.body.id,
       firstname: req.body.firstname,
       lastname: req.body.lastname,
       passport_country: req.body.passport_country,
       passportNumber: req.body.passportNumber,
       passport_issue_date: req.body.passport_issue_date,
       passport_expirey_date: req.body.passport_expirey_date
   }
   let newClient = await Client.create({id:data.id,firstname:data.firstname,lastname:data.lastname});
   await newClient.createPassport({
       country: data.passport_country, passportNumber: data.passportNumber,
       issueDate: data.passport_issue_date, expirationDate: data.passport_expirey_date,
   });
   return res.status(200).send({status: 1, data: "Data inserted successfully!!!"});
});


app.post("/sales", async (req,res)=>{
    let data = {
        saledate: req.body.saledate,
        saletext: req.body.saletext,
        clientid: req.body.clientid,
    }
    await Sale.create({saledate:data.saledate, saletext: data.saletext, clientId: data.clientid});
    return res.status(200).send({status: 1, data: "Data inserted successfully!!!"});
});

app.delete("/sales/:id", async(req,res)=>{
    let id = req.params.id;
    await Sale.destroy({
        where: {
            saleno: id
        }
    });
    return res.status(200).send({status: 1, data: "Sale deleted successfully!!!"});
})

app.get("/sales/topclient", async (req,res)=>{
    try{
        const client = await Client.findAll({
            attributes: ['id',[sequelize.literal('concat_ws(\' \', "firstName", "lastName")'), 'fullName'],
                [sequelize.fn('COUNT', 'clientid'), 'numsales']],
            include: [{model: Sale,attributes: []}],
            group: ['id',sequelize.literal('concat_ws(\' \', "firstName", "lastName")')],
            having: sequelize.where(sequelize.fn('COUNT', sequelize.col('"clientid"')), '>=', 2),
            order: [[sequelize.fn('COUNT', sequelize.col('"clientid"')),'DESC']]
        });
        return res.status(200).send({status: 1, data: client[0]});
    }catch (e){
        console.error(e);
    }
});

app.get("/items/lowestup", async(req,res)=>{
    try{
        let saleItems = await SaleItem.findAll({
                attributes: ["itemno","price","quantity", "unitprice"]
            });
        // Trier l'objet sequelize renvoyé par prix unitaire croissant.
        saleItems = saleItems.sort(function (a, b) {
            if (a.unitprice < b.unitprice) {
                return -1;
            }
        });
        // Le premier élément est celui qui a le prix unitaire le plus bas,
        // on peut enregistrer la valeur du prix unitaire dans une variable
        let unitprice = saleItems[0].unitprice;
        // en utilisant la méthode findByPk, nous obtenons l'article avec le
        // itemno du premier élément de l'objet renvoyé
        let item = await Item.findByPk(saleItems[0].itemno);
        // nous ajoutons la propriété unitprice à l'instance sequelize avant de
        // l'envoyer à l'utilisateur
        item.setDataValue('unitprice', unitprice);
        return res.status(200).send({status: 1, data: item});
    }catch (e){
        console.error(e);
        return res.status(500).send({status:0, data: "internal error"})
    }
})

//One-to-One
Client.hasOne(Passport);
Passport.belongsTo(Client);

//One-to-Many
Sale.belongsTo(Client, {constraints:true, onDelete: 'CASCADE'});
Client.hasMany(Sale);

//Many-to-Many
Sale.belongsToMany(Item, {through: SaleItem, foreignKey: 'saleno'});
Item.belongsToMany(Sale, {through: SaleItem, foreignKey: 'itemno'});


aunthenticateDb()
    .then(async ()=>{
        console.log("Connection successful!")
        await sequelize.sync({ force: true }); // N'utilisez pas "force: true" en production
        console.log("All models were synchronized successfully.");
        seed_data();
    })
    .catch(()=>{
        console.log("Connection failed!")
    });

app.listen(port,()=>{
    console.log(`Le serveur ecoute sur le port ${port}`);
})