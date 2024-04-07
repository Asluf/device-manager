const mongoose = require("mongoose");
// Atlas

const DbConnection = async () => {
  await mongoose
    .connect(process.env.DATABASE)
    .then((con) =>
      console.log(
        `MongoDB is connected to the database :${con.connection.name}`
      )
    )
    .catch((err) => {
      console.log(err);
    });
};

module.exports = DbConnection;
