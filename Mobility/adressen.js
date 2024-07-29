const mariadb = require("mariadb");
const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

const pool = mariadb.createPool({
  host: "localhost",
  user: "root",
  password: "Hevi2001!",
  database: "nodedb",
  connectionLimit: 5,
});

app.post("/addresses", async (req, res) => {
  console.log("hier");
  const addresses = req.body;
  let conn;
  try {
    conn = await pool.getConnection();
    for (const address of addresses) {
      await conn.query("INSERT INTO adressen (adr) VALUES (?)", [address]);
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: err.message });
  } finally {
    if (conn) conn.release(); //release to pool
  }
});

let conn;

app.listen(3000, () => {
  console.log("Server läuft auf Port 3000 123");
});
