//  models/index.js
const Client = require("./client");
const Passport = require("./passport");
const Sale = require("./sale");
const Item = require("./item");
const SaleItem = require("./saleitem");
const ItemType = require("./itemType")


module.exports = {
    Client : Client,
    Passport : Passport,
    Sale: Sale,
    Item: Item,
    SaleItem: SaleItem,
    ItemType: ItemType
}


