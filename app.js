

// === MANEJO DE IMÁGENES ===
const inputImagenes = document.getElementById("imageInput");
const preview = document.getElementById("imagePreview");
const uploadArea = document.querySelector(".file-upload-area");

// Array para almacenar los archivos seleccionados
let archivosSeleccionados = [];

// Click en el área -> abrir input
uploadArea.addEventListener("click", () => inputImagenes.click());

// Input change
inputImagenes.addEventListener("change", (e) => {
  agregarArchivos(e.target.files);
});

// Drag & Drop
uploadArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  uploadArea.classList.add("border-orange-500", "bg-orange-50");
});
uploadArea.addEventListener("dragleave", () => {
  uploadArea.classList.remove("border-orange-500", "bg-orange-50");
});
uploadArea.addEventListener("drop", (e) => {
  e.preventDefault();
  uploadArea.classList.remove("border-orange-500", "bg-orange-50");

  if (e.dataTransfer.files.length > 0) {
    agregarArchivos(e.dataTransfer.files);
  }
});

// Agregar archivos al array
function agregarArchivos(files) {
  [...files].forEach(file => {
    if (!file.type.startsWith("image/")) return;
    archivosSeleccionados.push(file);
  });
  mostrarPreview();
  actualizarInput();
}

// Mostrar imágenes en preview
function mostrarPreview() {
  preview.innerHTML = "";

  if (archivosSeleccionados.length > 0) {
    preview.classList.remove("hidden");
  } else {
    preview.classList.add("hidden");
  }

  archivosSeleccionados.forEach((file, index) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const div = document.createElement("div");
      div.className = "relative group";

      const img = document.createElement("img");
      img.src = e.target.result;
      img.className = "w-full h-32 object-cover rounded-lg shadow-md border";

      // Botón eliminar
      const btn = document.createElement("button");
      btn.innerHTML = "✖";
      btn.className = "absolute top-1 right-1 bg-red-500 text-white rounded-full px-2 py-1 text-xs opacity-80 hover:opacity-100";
      btn.addEventListener("click", () => {
        archivosSeleccionados.splice(index, 1); // quitar del array
        mostrarPreview();
        actualizarInput();
      });

      div.appendChild(img);
      div.appendChild(btn);
      preview.appendChild(div);
    };
    reader.readAsDataURL(file);
  });
}

// Actualizar el input con los archivos del array
function actualizarInput() {
  const dataTransfer = new DataTransfer();
  archivosSeleccionados.forEach(file => dataTransfer.items.add(file));
  inputImagenes.files = dataTransfer.files;
}


















// Seleccionar inputs
const precioBaseInput = document.getElementById("precioBase");
const porcentajeInput = document.getElementById("porcentaje");
const precioVentaInput = document.getElementById("precioVenta");
const gananciaInput = document.getElementById("gananciaJexpedition");
const explicacion = document.getElementById("explicacion");

// Función de cálculo
function calcular() {
  const precioBase = parseFloat(precioBaseInput.value);
  const porcentaje = parseFloat(porcentajeInput.value);

  if (!isNaN(precioBase) && !isNaN(porcentaje)) {
    const precioVenta = precioBase / (1 - porcentaje / 100);
    const ganancia = precioVenta - precioBase;

    const formatCOP = (val) => "$" + val.toLocaleString("es-CO");

    precioVentaInput.value = "COP " + formatCOP(Math.round(precioVenta));
    gananciaInput.value = "COP " + formatCOP(Math.round(ganancia));

    explicacion.innerHTML = `
      <div class="notificacion-info">
        <p><strong>💡 ¿Cómo se calcula el precio de venta?</strong></p>
        <p>El precio de venta se calcula para que después de dar el porcentaje, te quede exactamente el precio base que ingresaste.</p>
        <p><strong>Ejemplo:</strong> Si tu precio base es <b>${formatCOP(precioBase)}</b> y das <b>${porcentaje}%</b>:</p>
        <ul>
          <li><b>Precio de venta:</b> ${formatCOP(Math.round(precioVenta))}</li>
          <li><b>El ${porcentaje}% de ${formatCOP(Math.round(precioVenta))} =</b> ${formatCOP(Math.round(ganancia))} (lo que das)</li>
          <li><b>Te quedas con:</b> ${formatCOP(precioBase)} (tu precio base)</li>
        </ul>
      </div>
    `;
  } else {
    precioVentaInput.value = "";
    gananciaInput.value = "";
    explicacion.innerHTML = "";
  }
}

// Aquí agregamos los listeners para que se ejecute al cambiar los valores
precioBaseInput.addEventListener("input", calcular);
porcentajeInput.addEventListener("change", calcular);

























// Inicializa intl-tel-input para ambos inputs
const inputPrincipal = document.querySelector("#telefonoCompleto");
const inputConfirmacion = document.querySelector("#numeroConfirmacion");

const itiPrincipal = window.intlTelInput(inputPrincipal, {
  initialCountry: "co",
  separateDialCode: true,
  preferredCountries: ["co", "mx", "ar", "cl", "es"],
  utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@17/build/js/utils.js",
});

const itiConfirm = window.intlTelInput(inputConfirmacion, {
  initialCountry: "co",
  separateDialCode: true,
  preferredCountries: ["co", "mx", "ar", "cl", "es"],
  utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@17/build/js/utils.js",
});

// Sincronizar país seleccionado del confirmación con el principal
function sincronizarConfirmacion() {
  const countryData = itiPrincipal.getSelectedCountryData();
  itiConfirm.setCountry(countryData.iso2);
}

inputPrincipal.addEventListener("countrychange", sincronizarConfirmacion);

// Sincronizar al cargar para que estén iguales al inicio
sincronizarConfirmacion();

// Manejar el submit del formulario
const botonEnviar = document.getElementById("botonEnviar");

document.getElementById("aventuraForm").addEventListener("submit", function (e) {
  e.preventDefault();

// Buscar campos requeridos que estén vacíos o inválidos
  this.querySelectorAll("[required]").forEach(campo => {
    if (!campo.value.trim() || !campo.checkValidity()) {
      valido = false;

      // Guardar el primer campo con error
      if (!primerError) primerError = campo;

      // Animación de error
      campo.classList.add("error-flash");
      setTimeout(() => campo.classList.remove("error-flash"), 500);
    }
  });

  // Si hay error → scrollear hacia él
  if (!valido && primerError) {
    primerError.scrollIntoView({ behavior: "smooth", block: "center" });
    return; // detener el envío
  }

  // 🔄 Mostrar loader en el botón
  botonEnviar.disabled = true;
  botonEnviar.innerHTML = `<span class="spinner"></span> Validando...`;

  let valido = true;

  // === Validaciones ===
  if (!this.checkValidity()) {
    alert("❌ Por favor completa todos los campos obligatorios.");
    valido = false;
  }

  if (!itiPrincipal.isValidNumber()) {
    alert("❌ El número principal no es válido.");
    valido = false;
  }

  if (!itiConfirm.isValidNumber()) {
    alert("❌ El número de confirmación no es válido.");
    valido = false;
  }

  const numeroPrincipal = itiPrincipal.getNumber();
  const numeroConfirm = itiConfirm.getNumber();

  function normalizarNumero(num) {
    return num.replace(/[\s\-]/g, "");
  }

  if (normalizarNumero(numeroPrincipal) !== normalizarNumero(numeroConfirm)) {
    alert("❌ Los números no coinciden.");
    valido = false;
  }

  if (archivosSeleccionados.length === 0) {
    alert("❌ Debes subir al menos una imagen de la aventura.");
    valido = false;
  }

  // ✅ Mostrar modal solo si todo está bien
if (valido) {
  setTimeout(() => {
    const modal = document.getElementById("modalExito");
    modal.classList.remove("hidden");
    modal.style.display = "flex";

    // Rellenar resumen con datos del formulario
    document.getElementById("resumenCiudad").innerText = document.getElementById("ciudad").value;
    document.getElementById("resumenTipo").innerText = document.getElementById("tipo").value;
    document.getElementById("resumenNombre").innerText = document.getElementById("nombreAventura").value;
    document.getElementById("resumenNombreIngles").innerText = document.getElementById("nombreAventuraIngles").value;
    document.getElementById("resumenPrecio").innerText = "COP " + document.getElementById("precioBase").value;
    document.getElementById("resumenComision").innerText = document.getElementById("porcentaje").value + "%";
    document.getElementById("resumenPrecioVenta").innerText = document.getElementById("precioVenta").value;
    document.getElementById("resumenGanancia").innerText = document.getElementById("gananciaJexpedition").value;
    document.getElementById("resumenDescripcion").innerText = document.getElementById("descripcion").value;
    document.getElementById("resumenIncluye").innerText = document.getElementById("incluye").value;
    document.getElementById("resumenDestacados").innerText = document.getElementById("destacados").value;
    document.getElementById("resumenRestricciones").innerText = document.getElementById("restringidos").value || "Ninguna";
    document.getElementById("resumenAgencia").innerText = document.getElementById("agencia").value;
    document.getElementById("resumenTelefono").innerText = document.getElementById("telefonoCompleto").value;

    // Restaurar botón
    botonEnviar.disabled = false;
    botonEnviar.innerHTML = "Enviar Registro";
  }, 800);
}

});



// === Cerrar modal de exito ===
document.getElementById("cerrarModalBtn").addEventListener("click", () => {
  const modal = document.getElementById("modalExito");
  modal.classList.add("hidden");
  modal.style.display = "none";
});

// Opcional: cerrar modal al hacer clic fuera del contenido
document.getElementById("modalExito").addEventListener("click", (e) => {
  if (e.target.id === "modalExito") {
    e.currentTarget.classList.add("hidden");
    e.currentTarget.style.display = "none";
  }
});

