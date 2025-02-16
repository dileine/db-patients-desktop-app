document.getElementById("searchBttn").addEventListener("click", async () => {
  const name = document.getElementById("patientName").value;
  console.log(`Buscando paciente: ${name}`);

  const response = await fetch("http://localhost:3000/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  const data = await response.json();
  const result = document.getElementById("result");

  if (data.exist) {
    const patient = data.patient[0]; // Access the first patient in the array
    result.innerHTML = `
    <h3>Datos del paciente</h3>
    <p>Nombre: ${patient.name}</p>
    <p>Mutua: ${patient.insurance || "No especificado"}</p>
    <button onclick="editPatient(${patient.id})">Editar</button>
    <button onclick="deletePatient(${patient.id})">Eliminar</button>`;
  } else {
    result.innerHTML = `
    <h3>Paciente no encontrado</h3>
    <form id="createPatient">
    <input type="text" id="newName" placeholder=${name} required>
    <input type="text" id="newInsurance" placeholder="Mutua">
    <button type="submit">Crear</button>
    </form>`;

    document
      .getElementById("createPatient")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const newName = document.getElementById("newName").value;
        const newInsurance = document.getElementById("newInsurance").value;

        await fetch("http://localhost:3000/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newName, insurance: newInsurance }),
        });

        alert("Paciente creado correctamente");
      });
  }
});

async function editPatient(id) {
  const response = await fetch("http://localhost:3000/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });

  const data = await response.json();
  if (data.exist) {
    const patient = data.patient[0];
    result.innerHTML = `
    <h3>Editar paciente</h3>
    <input type="text" id="editName" value="${patient.name}" required>
    <input type="text" id="editInsurance" value="${patient.insurance || ""}">
    <button onclick="updatePatient(${patient.id})">Actualizar</button>`;
  }
}

async function updatePatient(id) {
  const name = document.getElementById("editName").value;
  const insurance = document.getElementById("editInsurance").value;

  await fetch("http://localhost:3000/update", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, name, insurance }),
  });

  alert("Paciente actualizado correctamente");
}

async function deletePatient(id) {
  const confirmDelete = confirm(
    "¿Estás seguro de que quieres eliminar este paciente?"
  );
  if (!confirmDelete) return;

  const response = await fetch("http://localhost:3000/delete", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });

  const data = await response.json();
  alert(data.mensaje);
  result.innerHTML = ""; // Clear the result div
}
