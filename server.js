require("dotenv").config();
const PORT = process.env.PORT;
const app = require("./app");
const bcrypt = require("bcrypt");

app.listen(PORT, async (err) => {
  if (err) {
    console.error(`Error: ${err.message}`);
  } else {
    console.log(`Server is running on port: ${PORT}`);
  }
});
