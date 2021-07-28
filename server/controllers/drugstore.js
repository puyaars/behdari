const { InventoryDrug, Drug } = require("../db");

module.exports.get = async (req, res) => {
  var range = JSON.parse(req.query.range)
  var query = {
    where: {
      inventory: "drugstore",
    },
    include: Drug,
    offset: range[0],
    limit: range[1] - range[0]
  };
  var data = await InventoryDrug.findAll(query);
  var total = await InventoryDrug.count({where: {
    inventory: "drugstore",
  }});
  res.setHeader('Content-Range', `drugstore ${range[0]}-${range[0] + data.length}/${total}`);
  res.json(data);
};
module.exports.getItem = async (req, res) => {
  var data = await InventoryDrug.findByPk(req.params.id, { include: Drug });
  res.json(data);
};
module.exports.post = async (req, res) => {
  var data = InventoryDrug.build();
  data.amount = req.body.amount || 0;
  data.inventory = req.body.inventory || "drugstore";

  var drug = await Drug.findOrCreate({ where: req.params.drug });
  data.DrugId = drug.id;
  await data.save();
  res.json(data);
};
module.exports.put = async (req, res) => {
  var data = await InventoryDrug.findByPk(req.params.id, { include: Drug });
  data.amount = req.body.amount || data.amount;

  var drug = await Drug.findOrCreate({ where: req.params.drug });
  data.DrugId = drug.id;

  await data.save();
  res.json(data);
};
module.exports.delete = async (req, res) => {
  var data = await InventoryDrug.findByPk(req.params.id);
  await data.destroy();
  res.json(data);
};
