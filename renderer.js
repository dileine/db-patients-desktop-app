document.getElementById("searchBttn").addEventListener("click", () => {
  const name = document.getElementById("patientName").ariaValueMax;
  console.log(`Buscando paciente: ${name}`);
});
