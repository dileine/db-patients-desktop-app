const express = require("express");
const sql = require("mssql");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const dbConfig = {
  user: "user_name",
  password: "password",
  server: "localhost",
  database: "db_name",
  options: {
    encrypt: false, // true for Windows Azure
    trustServerCertificate: true,
  },
};

// Connect to the database
async function getPool() {
  try {
    return await sql.connect(dbConfig);
  } catch (error) {
    console.error("Errorde conexión a la base de datos", error.message);
    throw new Error("Error al conectarse a la base de datos");
  }
}

// Search for a patient by name
app.post("/search", async (req, res) => {
  const { name } = req.body;
  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("name", sql.VarChar, name)
      .query("SELECT * FROM Patients WHERE name LIKE '%' + @name + '%' ");

    res.json({ exist: result.recordset.length > 0, patient: result.recordset });
  } catch (error) {
    console.error("Error al buscar paciente", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Search for a patient by ID
app.post("/searchById", async (req, res) => {
  const { id } = req.body;
  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM Patients WHERE id = @id");

    res.json({ exist: result.recordset.length > 0, patient: result.recordset });
  } catch (error) {
    console.error("Error al buscar paciente", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Create a new patient
app.post("/create", async (req, res) => {
  const { name, insurance } = req.body;
  try {
    const pool = await getPool();
    await pool
      .request()
      .input("name", sql.VarChar, name)
      .input("insurance", sql.VarChar, insurance || null)
      .query(
        "INSERT INTO Patients (name, insurance) VALUES (@name, @insurance)"
      );

    res.json({ mensaje: "Paciente creado correctamente" });
  } catch (error) {
    console.error("Error al crear paciente", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Update a patient
app.put("/update", async (req, res) => {
  const { id, name, insurance } = req.body;
  try {
    const pool = await getPool();
    await pool
      .request()
      .input("id", sql.Int, id)
      .input("name", sql.VarChar, name)
      .input("insurance", sql.VarChar, insurance || null)
      .query(
        "UPDATE Patients SET name = @name, insurance = @insurance WHERE id = @id"
      );

    if (result.rosAffected[0] > 0) {
      res.json({ mensaje: "Paciente actualizado correctamente" });
    } else {
      res.status(404).json({ error: "Paciente no encontrado" });
    }
  } catch (error) {
    console.error("Error al actualizar paciente", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Delete a patient
app.delete("/delete", async (req, res) => {
  const { id } = req.body;
  try {
    const pool = await getPool();
    await pool
      .request()
      .input("id", sql.Int, id)
      .query("DELETE FROM Patients WHERE id = @id");
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ mensaje: "Paciente no encontrado" });
    }
    res.json({ mensaje: "Paciente eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar paciente", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
