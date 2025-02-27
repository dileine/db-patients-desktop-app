document.getElementById("searchBttn").addEventListener("click", async () => {
  const name = document.getElementById("patientName").value;
  const insurance = document.getElementById("insurance").value;
  console.log(`Buscando paciente: ${name}`);

  const response = await fetch("http://localhost:3000/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, insurance }),
  });

  const data = await response.json();
  console.log("Respuesta del servidor:", data);
  const result = document.getElementById("result");

  if (data.exist && data.patient.length > 0) {
    const patient = data.patient[0]; // Access the first patient in the array
    result.innerHTML = `
    <h3>Datos del paciente</h3>
    <p>Nombre: ${patient.name}</p>
    <p>Mutua: ${patient.insurance || "No especificado"}</p>
    <button onclick="editPatient(${patient.codigo})">Editar</button>
    <button onclick="deletePatient(${patient.codigo})">Eliminar</button>`;
  } else {
    alert("Paciente no encontrado");
    result.innerHTML = `
    <h3>Crear paciente</h3>
    <form id="createPatient">
    <input type="text" id="newName" placeholder="Nombre" required>
    <input type="text" id="newLastname" placeholder="Apellidos">
    <input type="text" id="newInsurance" placeholder="Mutua">
    <input type="text" id="newDoctor" placeholder="Doctor">
    <input type="text" id="newDNI" placeholder="DNI">
    <input type="text" id="newNumHistoria" placeholder="Número de historia">
    <input type="date" id="newBirthdate" placeholder="Fecha de nacimiento">
    <input type="text" id="newAddress" placeholder="Dirección">
    <input type="text" id="newCity" placeholder="Población">
    <input type="text" id="newCP" placeholder="Código postal">
    <input type="tel" id="newPhone" placeholder="Teléfono">
    <input type="tel" id="newPhone2" placeholder="Teléfono 2">
    <input type="tel" id="newMobile" placeholder="Móvil">
    <input type="tel" id="newMobile2" placeholder="Móvil 2">
    <input type="email" id="newEmail" placeholder="Correo electrónico">
    <button type="submit">Crear</button>
    </form>`;

    document
      .getElementById("createPatient")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        // Get form values
        const newName = document.getElementById("newName").value;
        const newLastname = document.getElementById("newLastname").value;
        const newInsurance = document.getElementById("newInsurance").value;
        const newDoctor = document.getElementById("newDoctor").value;
        const newDNI = document.getElementById("newDNI").value;
        const newNumHistoria = document.getElementById("newNumHistoria").value;
        const newBirthdate = document.getElementById("newBirthdate").value;
        const newAddress = document.getElementById("newAddress").value;
        const newCity = document.getElementById("newCity").value;
        const newCP = document.getElementById("newCP").value;
        const newPhone = document.getElementById("newPhone").value;
        const newPhone2 = document.getElementById("newPhone2").value;
        const newMobile = document.getElementById("newMobile").value;
        const newMobile2 = document.getElementById("newMobile2").value;
        const newEmail = document.getElementById("newEmail").value;

        if (!newName) {
          alert("Por favor, introduce un nombre");
          return;
        }

        console.log("Creando paciente:", {
          name: newName,
          lastname: newLastname,
          birthdate: newBirthdate,
        });

        const response = await fetch("http://localhost:3000/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre: newName,
            apellido: newLastname,
            codMutua: newInsurance,
            codDoctor: newDoctor,
            dni: newDNI,
            numHist: newNumHistoria,
            fechaNac: newBirthdate,
            direccion: newAddress,
            poblacion: newCity,
            cp: newCP,
            telefono: newPhone,
            telefono2: newPhone2,
            movil: newMobile,
            movil2: newMobile2,
            email: newEmail,
          }),
        });

        const data = await response.json();
        console.log("Respuesta del servidor:", data);
        alert(data.mensaje);

        document.getElementById("result").innerHTML = `
        <h3>Datos del paciente</h3>
        <p>Nombre: ${newName} ${newLastname}</p>
        <p>Fecha de nacimiento: ${newBirthdate || "No especificado"}</p>
        <p>Mutua: ${newInsurance || "No especificado"}</p>
        <p>Doctor: ${newDoctor || "No especificado"}</p>
        <p>DNI: ${newDNI || "No especificado"}</p>
        <p>Número de historia: ${newNumHistoria || "No especificado"}</p>
        <p>Dirección: ${newAddress || "No especificado"}</p>
        <p>Población: ${newCity || "No especificado"}</p>
        <p>Código postal: ${newCP || "No especificado"}</p>
        <p>Teléfono: ${newPhone || "No especificado"}</p>
        <p>Teléfono 2: ${newPhone2 || "No especificado"}</p>
        <p>Móvil: ${newMobile || "No especificado"}</p>
        <p>Móvil 2: ${newMobile2 || "No especificado"}</p>
        <p>Email: ${newEmail || "No especificado"}</p>

        <button onclick="editPatient(${data.codigo})">Editar</button>
        <button onclick="deletePatient(${data.codigo})">Eliminar</button>
        <button onclick="location.reload()">Volver a buscar</button>
        `;
      });
  }
});

async function editPatient(codigo) {
  const response = await fetch("http://localhost:3000/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ codigo }),
  });

  const data = await response.json();
  if (data.exist) {
    const patient = data.patient[0];
    result.innerHTML = `
       <h3>Editar paciente</h3>
      <input type="text" id="editNombre" value="${patient.nombre}" required>
      <input type="text" id="editApellido" value="${patient.apellido}" required>
      <input type="text" id="editCodMutua" value="${patient.codMutua || ""}">
      <input type="text" id="editCodDoctor" value="${patient.codDoctor || ""}">
      <input type="text" id="editDNI" value="${patient.dni || ""}">
      <input type="text" id="editNumHistoria" value="${patient.numHist || ""}">
      <input type="date" id="editFechaNacimiento" value="${
        patient.fechaNac || ""
      }">
      <input type="text" id="editDireccion" value="${patient.direccion || ""}">
      <input type="text" id="editPoblacion" value="${patient.poblacion || ""}">
      <input type="text" id="editCP" value="${patient.cp || ""}">
      <input type="text" id="editTelefono" value="${patient.telefono || ""}">
      <input type="text" id="editTelefono2" value="${patient.telefono2 || ""}">
      <input type="text" id="editMovil" value="${patient.movil || ""}">
      <input type="text" id="editMovil2" value="${patient.movil2 || ""}">
      <input type="email" id="editEmail" value="${patient.email || ""}">
      <button onclick="updatePatient(${patient.codigo})">Actualizar</button>`;
  }
}

async function updatePatient(codigo) {
  const editNombre = document.getElementById("editNombre").value;
  const editApellido = document.getElementById("editApellido").value;
  const editCodMutua = document.getElementById("editCodMutua").value;
  const editCodDoctor = document.getElementById("editCodDoctor").value;
  const editDni = document.getElementById("editDNI").value;
  const editNumHist = document.getElementById("editNumHistoria").value;
  const editFechaNac = document.getElementById("editFechaNacimiento").value;
  const editDireccion = document.getElementById("editDireccion").value;
  const editPoblacion = document.getElementById("editPoblacion").value;
  const editCp = document.getElementById("editCP").value;
  const editTelefono = document.getElementById("editTelefono").value;
  const editTelefono2 = document.getElementById("editTelefono2").value;
  const editMovil = document.getElementById("editMovil").value;
  const editMovil2 = document.getElementById("editMovil2").value;
  const editEmail = document.getElementById("editEmail").value;

  await fetch("http://localhost:3000/update", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      codigo: codigo,
      nombre: editNombre,
      apellido: editApellido,
      codMutua: editCodMutua,
      codDoctor: editCodDoctor,
      dni: editDni,
      numHist: editNumHist,
      fechaNac: editFechaNac,
      direccion: editDireccion,
      poblacion: editPoblacion,
      cp: editCp,
      telefono: editTelefono,
      telefono2: editTelefono2,
      movil: editMovil,
      movil2: editMovil2,
      email: editEmail,
    }),
  });

  alert("Paciente actualizado correctamente");
  location.reload();
}

async function deletePatient(codigo) {
  const confirmDelete = confirm(
    "¿Estás seguro de que quieres eliminar este paciente?"
  );
  if (!confirmDelete) return;

  const response = await fetch("http://localhost:3000/delete", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ codigo }),
  });

  const data = await response.json();
  alert(response.ok ? data.mensaje : data.error);
  location.reload();
}
