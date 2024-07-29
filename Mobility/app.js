const mariadb = require("mariadb");
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

const pool = mariadb.createPool({
  host: "192.168.43.167",
  user: "root",
  password: "Hevi2001!",
  database: "nodedb",
  connectionLimit: 5,
});

let conn;

app.post("/register", (req, res) => {
  res.clearCookie("test");
  const { name, password } = req.body;
  pool
    .getConnection()
    .then((connection) => {
      conn = connection;
      return conn.query(
        `
              SELECT * FROM customers WHERE password = ?
            `,
        [password]
      );
    })
    .then((rows) => {
      if (rows.length > 0) {
        // Wenn das Passwort bereits existiert, senden Sie eine entsprechende Antwort
        res.json({ passwordExists: true });
      } else {
        res.cookie("token", process.env.TOKEN_SECRET);

        console.log("1", res.cookie);

        // Wenn das Passwort nicht existiert, fügen Sie den neuen Benutzer ein
        return conn
          .query(
            `
                INSERT INTO customers (name, password)
                VALUES (?, ?)
              `,
            [name, password]
          )
          .then(() => {
            res.send("Erfolgreich eingefügt!");
          });
      }
    })
    .then(() => {
      if (conn) conn.end();
    })
    .catch((err) => {
      console.log(err);
      if (conn) conn.end();
    });
});

function authenticateToken(req, res) {
  // res.status(403);
  // console.log("req.cookies", req.cookies);
  // console.log("2", process.env.TOKEN_SECRET);
  if (req.cookies["token"] == null) {
    res.status(403);
  }
  if (req.cookies["token"] != process.env.TOKEN_SECRET) res.status(403);
}

app.post("/login", (req, res) => {
  authenticateToken(req, res);
  const { name, password } = req.body;
  // Überprüfen Sie den Namen und das Passwort in der Datenbank
  pool
    .getConnection()
    .then((connection) => {
      return connection
        .query(
          `
              SELECT * FROM customers WHERE name = ? AND password = ?
            `,
          [name, password]
        )
        .then((rows) => {
          connection.release(); // Geben Sie die Verbindung zurück an den Pool
          if (rows.length > 0) {
            const user = rows[0];
            //console.log(user.id); // Geben Sie die ID des Benutzers aus
            res.json({ success: true, id: user.id });
          } else {
            // Wenn die Anmeldedaten nicht korrekt sind, senden Sie eine negative Antwort
            res.json({ success: false });
          }
        });
    })
    .catch((err) => {
      console.log(err);
      res.json({ success: false }); // Senden Sie eine negative Antwort, wenn ein Fehler auftritt
    });
});

app.get("/user/:id", (req, res) => {
  authenticateToken(req, res);

  const { id } = req.params;

  pool
    .getConnection()
    .then((connection) => {
      return connection
        .query(
          `
              SELECT * FROM customers WHERE id = ?
            `,
          [id]
        )
        .then((rows) => {
          connection.release();
          if (rows.length > 0) {
            const user = rows[0];
            res.json({ success: true, user });
          } else {
            res.json({ success: false });
          }
        });
    })
    .catch((err) => {
      console.log(err);
      res.json({ success: false });
    });
});

app.post("/updateSteps", (req, res) => {
  authenticateToken(req, res);
  const { steps, id } = req.body;
  let connection;

  pool
    .getConnection()
    .then((conn) => {
      connection = conn;
      return connection.query(
        `
        UPDATE customers SET steps = COALESCE(steps, 0) + ? WHERE id = ?
      `,
        [steps, id]
      ); // Setzen Sie steps auf 0, wenn es NULL ist, bevor Sie die neuen Schritte hinzufügen
    })
    .then((result) => {
      res.json({ success: true });
      if (connection) connection.release(); // Geben Sie die Verbindung zurück an den Pool
    })
    .catch((err) => {
      console.log(err);
      if (connection) connection.release();
    });
});

app.post("/updateStepsAfterMaps", (req, res) => {
  authenticateToken(req, res);
  const { steps, id } = req.body;
  let connection;
  console.log("steps", steps);

  pool
    .getConnection()
    .then((conn) => {
      connection = conn;
      return connection.query(
        `
        UPDATE customers SET steps = ? WHERE id = ?
      `,
        [steps, id]
      ); // Setzen Sie steps auf den neuen Wert
    })
    .then((result) => {
      res.json({ success: true });
      if (connection) connection.release(); // Geben Sie die Verbindung zurück an den Pool
    })
    .catch((err) => {
      console.log(err);
      if (connection) connection.release();
    });
});

app.post("/updateDmgPoints", (req, res) => {
  authenticateToken(req, res);
  const { dmgPoints, id } = req.body;
  let connection;
  console.log("Backend dmgPoints", dmgPoints);

  pool
    .getConnection()
    .then((conn) => {
      connection = conn;
      return connection.query(
        `
        UPDATE customers SET dmgPoints = ? WHERE id = ?
      `,
        [dmgPoints, id]
      );
    })
    .then((result) => {
      res.json({
        success: true,
        message: "Successfully updated damage points",
      });
      if (connection) connection.release();
    })
    .catch((err) => {
      console.log(err);
      res.json({ success: false, message: "Failed to update damage points" });
      if (connection) connection.release();
    });
});

app.post("/updateStepsLastDay", (req, res) => {
  authenticateToken(req, res);
  const { steps, id } = req.body;
  let connection;

  pool
    .getConnection()
    .then((conn) => {
      connection = conn;
      return connection.query(
        `
        UPDATE customers SET stepsLastDay = COALESCE(stepsLastDay, 0) + ? WHERE id = ?
      `,
        [steps, id]
      ); // Setzen Sie stepsLastDay auf 0, wenn es NULL ist, bevor Sie die neuen Schritte hinzufügen
    })
    .then((result) => {
      res.json({ success: true });
      if (connection) connection.release(); // Geben Sie die Verbindung zurück an den Pool
    })
    .catch((err) => {
      console.log(err);
      if (connection) connection.release();
    });
});

app.get("/getUserLevel", (req, res) => {
  authenticateToken(req, res);
  const { id } = req.query;
  let connection;

  pool
    .getConnection()
    .then((conn) => {
      connection = conn;
      return connection.query(
        `
        SELECT COALESCE(level, 1) as level FROM customers WHERE id = ?
      `,
        [id]
      ); // Setzen Sie level auf 1, wenn es NULL ist
    })
    .then((result) => {
      if (result.length > 0) {
        res.json({ success: true, level: result[0].level });
      } else {
        res.json({ success: false, message: "User not found" });
      }
      if (connection) connection.release(); // Geben Sie die Verbindung zurück an den Pool
    })
    .catch((err) => {
      console.log(err);
      if (connection) connection.release();
    });
});

app.get("/getUserSteps", (req, res) => {
  authenticateToken(req, res);
  console.log(1, "Endpunkt getUserSteps");
  const { id } = req.query;
  let connection;

  pool
    .getConnection()
    .then((conn) => {
      connection = conn;
      return connection.query(
        `
        SELECT COALESCE(steps, 0) as steps FROM customers WHERE id = ?
      `,
        [id]
      ); // Setzen Sie steps auf 0, wenn es NULL ist
    })
    .then((result) => {
      if (result.length > 0) {
        res.json({ success: true, steps: result[0].steps });
      } else {
        res.json({ success: false, message: "User not found" });
      }
      if (connection) connection.release(); // Geben Sie die Verbindung zurück an den Pool
    })
    .catch((err) => {
      console.log(err);
      if (connection) connection.release();
    });
});

app.get("/getUserDmgPoints", (req, res) => {
  authenticateToken(req, res);
  const { id } = req.query;
  let connection;

  pool
    .getConnection()
    .then((conn) => {
      connection = conn;
      return connection.query(
        `
        SELECT COALESCE(dmgPoints, 0) as dmgPoints FROM customers WHERE id = ?
      `,
        [id]
      ); // Setzen Sie dmgPoints auf 0, wenn es NULL ist
    })
    .then((result) => {
      if (result.length > 0) {
        res.json({ success: true, dmgPoints: result[0].dmgPoints });
      } else {
        res.json({ success: false, message: "User not found" });
      }
      if (connection) connection.release(); // Geben Sie die Verbindung zurück an den Pool
    })
    .catch((err) => {
      console.log(err);
      if (connection) connection.release();
    });
});

app.get("/everynameandstepsandlevel", async (req, res) => {
  authenticateToken(req, res);
  try {
    const result = await pool.query(
      "SELECT name, COALESCE(steps, 0) as steps, COALESCE(level, 1) as level FROM customers"
    );
    //console.log(result.rows); // Log only the data
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message }); // Send the error message in the response
  }
});

app.get("/everynameandstepsandlevelandidandpoisened", async (req, res) => {
  authenticateToken(req, res);
  try {
    const result = await pool.query(
      "SELECT id, name, COALESCE(steps, 0) as steps, COALESCE(level, 1) as level, poisened FROM customers"
    );
    //console.log(result.rows); // Log only the data
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message }); // Send the error message in the response
  }
});

app.post("/updateLevel", (req, res) => {
  authenticateToken(req, res);
  const { level, id } = req.body;
  let connection;

  pool
    .getConnection()
    .then((conn) => {
      connection = conn;
      return connection.query(
        `
        UPDATE customers SET level = ? WHERE id = ?
      `,
        [level, id]
      );
    })
    .then(() => {
      res.json({ success: true, message: "Level updated successfully" });
      if (connection) connection.release(); // Geben Sie die Verbindung zurück an den Pool
    })
    .catch((err) => {
      console.log(err);
      res.json({ success: false, message: "An error occurred", error: err });
      if (connection) connection.release();
    });
});

const isMidnight = () => {
  const now = new Date();
  //console.log(now.getHours(), now.getMinutes());
  return now.getHours() === 0 && now.getMinutes() === 0;
};

setInterval(() => {
  if (isMidnight()) {
    pool.getConnection().then((connection) => {
      return connection
        .query(
          `
        UPDATE customers 
        SET dmgPoints = CEIL(stepsLastDay * 0.25) + level * 100, 
            stepsLastDay = 0, 
            lastClick = 0, 
            singed = 1000, 
            steps = CASE 
                      WHEN poisened = 1 THEN GREATEST(steps - 3000, 0) 
                      ELSE steps 
                    END, 
            poisened = 0, 
            potionClick = 0
        `
        )
        .then(() => {
          console.log("Die Spalten wurden erfolgreich aktualisiert");
          if (connection) connection.release();
        })
        .catch((err) => {
          console.log(err);
          if (connection) connection.release();
        });
    });
  }
}, 60000); // Überprüfen Sie jede Minute

app.get("/getDmgPoints", (req, res) => {
  authenticateToken(req, res);
  const { id } = req.query;
  let connection;

  pool
    .getConnection()
    .then((conn) => {
      connection = conn;
      return connection.query(
        `
        SELECT dmgPoints FROM customers WHERE id = ?
      `,
        [id]
      );
    })
    .then((result) => {
      res.json({ success: true, dmgPoints: result[0].dmgPoints });
      if (connection) connection.release();
    })
    .catch((err) => {
      console.log(err);
      if (connection) connection.release();
    });
});

app.get("/getNumberOfDebuff", (req, res) => {
  authenticateToken(req, res);
  const { id } = req.query;
  let connection;

  pool
    .getConnection()
    .then((conn) => {
      connection = conn;
      return connection.query(
        `
        SELECT COALESCE(numberOfDebuff, 0) as numberOfDebuff FROM customers WHERE id = ?
      `,
        [id]
      );
    })
    .then((result) => {
      res.json({ success: true, numberOfDebuff: result[0].numberOfDebuff });
      if (connection) connection.release();
    })
    .catch((err) => {
      console.log(err);
      if (connection) connection.release();
    });
});

app.post("/attackUser", (req, res) => {
  authenticateToken(req, res);
  const { user2, dmgPoints, userId } = req.body;
  let connection;

  pool
    .getConnection()
    .then((conn) => {
      connection = conn;
      return connection.query(
        `
        UPDATE customers SET steps = CASE WHEN steps - ? < 0 THEN 0 ELSE steps - ? END WHERE id = ?
      `,
        [dmgPoints, dmgPoints, user2]
      );
    })
    .then((result) => {
      return connection.query(
        `
        UPDATE customers SET dmgPoints = 0 WHERE id = ?
      `,
        [userId]
      );
    })
    .then((result) => {
      res.json({ success: true });
      if (connection) connection.release();
    })
    .catch((err) => {
      console.log(err);
      if (connection) connection.release();
    });
});

app.get("/getLastClick", (req, res) => {
  authenticateToken(req, res);
  const { id } = req.query;
  let connection;
  pool
    .getConnection()
    .then((conn) => {
      connection = conn;
      return connection.query(
        `
        SELECT lastClick FROM customers WHERE id = ?
      `,
        [id]
      );
    })
    .then((result) => {
      if (result.length > 0) {
        let lastClick = result[0].lastClick;
        if (lastClick === null) {
          lastClick = 0;
        }
        res.json({ success: true, lastClick: lastClick });
      } else {
        res.json({ success: false, message: "User not found" });
      }
      if (connection) connection.release(); // Release the connection back to the pool
    })
    .catch((err) => {
      console.log(err);
      if (connection) connection.release();
    });
});

app.post("/updateLastClick", (req, res) => {
  authenticateToken(req, res);
  const { lastClick, id } = req.body;
  let connection;

  pool
    .getConnection()
    .then((conn) => {
      connection = conn;
      return connection.query(
        `
        UPDATE customers SET lastClick = ? WHERE id = ?
      `,
        [lastClick, id]
      );
    })
    .then((result) => {
      res.json({ success: true });
      if (connection) connection.release(); // Release the connection back to the pool
    })
    .catch((err) => {
      console.log(err);
      if (connection) connection.release();
    });
});

app.get("/getLastPotionClick", (req, res) => {
  authenticateToken(req, res);
  const { id } = req.query;
  let connection;
  pool
    .getConnection()
    .then((conn) => {
      connection = conn;
      return connection.query(
        `
        SELECT potionClick FROM customers WHERE id = ?
      `,
        [id]
      );
    })
    .then((result) => {
      if (result.length > 0) {
        let lastPotionClick = result[0].potionClick;
        if (lastPotionClick === null) {
          lastPotionClick = 0;
        }
        res.json({ success: true, potionClick: lastPotionClick });
      } else {
        res.json({ success: false, message: "User not found" });
      }
      if (connection) connection.release(); // Release the connection back to the pool
    })
    .catch((err) => {
      console.log(err);
      if (connection) connection.release();
    });
});

app.post("/updateLastPotionClick", (req, res) => {
  authenticateToken(req, res);
  const { id, potionClick } = req.body;
  let connection;

  pool
    .getConnection()
    .then((conn) => {
      connection = conn;
      return connection.query(
        `
        UPDATE customers SET potionClick = ? WHERE id = ?
      `,
        [potionClick, id]
      );
    })
    .then((result) => {
      res.json({ success: true });
      if (connection) connection.release(); // Release the connection back to the pool
    })
    .catch((err) => {
      console.log(err);
      if (connection) connection.release();
    });
});

app.post("/updateStepAfterBuff", (req, res) => {
  authenticateToken(req, res);
  const { id } = req.body;
  let connection;

  pool
    .getConnection()
    .then((conn) => {
      connection = conn;
      return connection.query(
        `
        UPDATE customers SET steps = steps + 3000 WHERE id = ?
      `,
        [id]
      ); // Setzen Sie steps auf 0, wenn es NULL ist, bevor Sie die neuen Schritte hinzufügen
    })
    .then((result) => {
      res.json({ success: true });
      if (connection) connection.release(); // Geben Sie die Verbindung zurück an den Pool
    })
    .catch((err) => {
      console.log(err);
      if (connection) connection.release();
    });
});

app.post("/updatePoisendAfterHeal", (req, res) => {
  authenticateToken(req, res);
  const { id } = req.body;
  let connection;
  pool
    .getConnection()
    .then((conn) => {
      connection = conn;
      return connection.query(
        `
      UPDATE customers SET poisened = 0, singed = 1000 WHERE id = ?
    `,
        [id]
      );
    })
    .then((result) => {
      res.json({ success: true });
      if (connection) connection.release(); // Geben Sie die Verbindung zurück an den Pool
    })
    .catch((err) => {
      console.log(err);
      if (connection) connection.release();
    });
});

app.post("/updateNumberOfDebuff", (req, res) => {
  authenticateToken(req, res);
  const { id } = req.body;
  let connection;

  pool
    .getConnection()
    .then((conn) => {
      connection = conn;
      return connection.query(
        `
        UPDATE customers SET numberOfDebuff = COALESCE(numberOfDebuff, 0) + 1 WHERE id = ?
      `,
        [id]
      ); // Setzen Sie numberOfDebuff auf 0, wenn es NULL ist, bevor Sie 1 hinzufügen
    })
    .then((result) => {
      res.json({ success: true });
      if (connection) connection.release(); // Geben Sie die Verbindung zurück an den Pool
    })
    .catch((err) => {
      console.log(err);
      if (connection) connection.release();
    });
});

app.get("/addresses", (req, res) => {
  authenticateToken(req, res);
  pool
    .getConnection()
    .then((connection) => {
      return connection
        .query("SELECT id, adr, place FROM adressen")
        .then((rows) => {
          connection.release();
          if (rows.length > 0) {
            res.json({ success: true, addresses: rows }); // send all rows
          } else {
            res.json({ success: false });
          }
        });
    })
    .catch((err) => {
      console.log(err);
      res.json({ success: false });
    });
});

app.post("/updateAddress", (req, res) => {
  authenticateToken(req, res);
  const { adr, id } = req.body;
  let connection;
  // console.log("adr", adr);
  // console.log("id", id);

  pool
    .getConnection()
    .then((conn) => {
      connection = conn;
      return connection.query(
        `
        UPDATE adressen SET adr = ? WHERE id = ?
      `,
        [adr, id]
      );
    })
    .then((result) => {
      res.json({ success: true });
      if (connection) connection.release(); // Release the connection back to the pool
    })
    .catch((err) => {
      console.log(err);
      if (connection) connection.release(); // Release the connection back to the pool
    });
});

app.post("/reduceNumberOfDebuff", (req, res) => {
  authenticateToken(req, res);
  const { userId } = req.body;
  let connection;
  // console.log("userId", userId);

  pool
    .getConnection()
    .then((conn) => {
      connection = conn;
      return connection.query(
        `
        UPDATE customers SET numberOfDebuff = numberOfDebuff - 1 WHERE id = ?
      `,
        [userId]
      );
    })
    .then(() => {
      res.json({
        success: true,
        message: "numberOfDebuff updated successfully",
      });
      if (connection) connection.release(); // Release the connection back to the pool
    })
    .catch((err) => {
      console.log(err);
      res.json({ success: false, message: "An error occurred", error: err });
      if (connection) connection.release();
    });
});

app.post("/raisePoisened", (req, res) => {
  authenticateToken(req, res);
  const { userId } = req.body;
  let connection;

  pool
    .getConnection()
    .then((conn) => {
      connection = conn;
      return connection.query(
        `
        UPDATE customers SET poisened = 1 WHERE id = ?
      `,
        [userId]
      );
    })
    .then(() => {
      res.json({
        success: true,
        message: "Poisened user updated successfully",
      });
      if (connection) connection.release(); // Release the connection back to the pool
    })
    .catch((err) => {
      console.log(err);
      res.json({ success: false, message: "An error occurred", error: err });
      if (connection) connection.release();
    });
});

app.get("/getPoisened", (req, res) => {
  authenticateToken(req, res);
  const { userId } = req.query;
  // console.log(userId);
  let connection;
  pool
    .getConnection()
    .then((conn) => {
      connection = conn;
      return connection.query(
        `
        SELECT poisened FROM customers WHERE id = ?
      `,
        [userId]
      );
    })
    .then((result) => {
      if (result.length > 0) {
        let user = result[0];
        // console.log(user.poisened);
        res.json({ success: true, user: user });
      } else {
        res.json({ success: false, message: "User not found or not poisened" });
      }
      if (connection) connection.release(); // Release the connection back to the pool
    })
    .catch((err) => {
      console.log(err);
      if (connection) connection.release();
    });
});

app.post("/setSinged", (req, res) => {
  authenticateToken(req, res);
  const { user2, userId } = req.body;
  // console.log("user2", user2);
  // console.log("userId", userId);
  let connection;

  pool
    .getConnection()
    .then((conn) => {
      connection = conn;
      return connection.query(
        `
        UPDATE customers SET singed = ? WHERE id = ?
      `,
        [userId, user2]
      );
    })
    .then(() => {
      res.json({
        success: true,
        message: "Singed user updated successfully",
      });
      if (connection) connection.release(); // Release the connection back to the pool
    })
    .catch((err) => {
      console.log(err);
      res.json({ success: false, message: "An error occurred", error: err });
      if (connection) connection.release();
    });
});

app.get("/getSinged", (req, res) => {
  authenticateToken(req, res);
  const { id } = req.query;

  let connection;
  pool
    .getConnection()
    .then((conn) => {
      connection = conn;
      return connection.query(
        `
        SELECT singed FROM customers WHERE id = ?
      `,
        [id]
      );
    })
    .then((result) => {
      if (result.length > 0) {
        let singedId = result[0].singed;
        if (singedId === null || singedId === 1000) {
          res.json({ success: true, singedName: "" });
        } else {
          return connection.query(
            `
            SELECT name FROM customers WHERE id = ?
          `,
            [singedId]
          );
        }
      } else {
        res.json({ success: false, message: "User not found" });
      }
    })
    .then((result) => {
      if (result && result.length > 0) {
        let singedName = result[0].name;
        res.json({ success: true, singedName: singedName });
      }
      if (connection) connection.release(); // Release the connection back to the pool
    })
    .catch((err) => {
      console.log(err);
      if (connection) connection.release();
    });
});

app.post("/updateStepAfterPotion", (req, res) => {
  authenticateToken(req, res);
  const { id } = req.body;
  let connection;

  pool
    .getConnection()
    .then((conn) => {
      connection = conn;
      return connection.query(
        `
        UPDATE customers SET steps = COALESCE(steps, 0) + 750 WHERE id = ?
      `,
        [id]
      ); // Setzen Sie steps auf 0, wenn es NULL ist, bevor Sie die neuen Schritte hinzufügen
    })
    .then((result) => {
      res.json({ success: true });
      if (connection) connection.release(); // Geben Sie die Verbindung zurück an den Pool
    })
    .catch((err) => {
      console.log(err);
      if (connection) connection.release();
    });
});

app.listen(3000, () => {
  console.log("Server läuft auf Port 3000");
});
