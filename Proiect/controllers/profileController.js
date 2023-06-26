const Utils = require("../utils");

let profileController = {};

profileController.profileGet = async (req, res) => {
    Utils.sendResources(req, res, "views/profile.html");
};


function parseDbData(dbData) {
  let data = "";
  const dbFields = dbData.split("+");

  for (let i = 0; i < dbFields.length; i++) {
    data = data + dbFields[i] + " ";
  }

  return data;
} 

module.exports = profileController;
