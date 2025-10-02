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







// === TIPO DE AVENTURA cuando es "Otro" mostrar input ===
const tipoSelect = document.getElementById("tipo");
const otroTipoContainer = document.getElementById("otroTipoContainer");
const otroTipoInput = document.getElementById("otroTipo");

tipoSelect.addEventListener("change", () => {
  if (tipoSelect.value === "Otro") {
    otroTipoContainer.classList.remove("hidden");
    otroTipoInput.setAttribute("required", "true"); // hacerlo obligatorio si eligen "Otro"
  } else {
    otroTipoContainer.classList.add("hidden");
    otroTipoInput.removeAttribute("required");
    otroTipoInput.value = ""; // limpiar valor si cambian de opción
  }
});











// === CALCULADORA DE PRECIOS ===
const precioBaseInput = document.getElementById("precioBase");
const porcentajeInput = document.getElementById("porcentaje");
const precioVentaInput = document.getElementById("precioVenta");
const gananciaInput = document.getElementById("gananciaJexpedition");
const explicacion = document.getElementById("explicacion");

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

precioBaseInput.addEventListener("input", calcular);
porcentajeInput.addEventListener("change", calcular);





// Permitir solo dígitos en los inputs de teléfono
function soloNumeros(input) {
  input.addEventListener("input", () => {
    input.value = input.value.replace(/\D/g, ""); // quita todo lo que no sea número
  });
}

soloNumeros(document.getElementById("telefonoCompleto"));
soloNumeros(document.getElementById("numeroConfirmacion"));
////////////////////////////////////

// Permitir solo dígitos en el input de identificación
const numeroIdentificacion = document.getElementById("numeroIdentificacion");
numeroIdentificacion.addEventListener("input", () => {
  numeroIdentificacion.value = numeroIdentificacion.value.replace(/\D/g, "");
});



// === TELÉFONO ===
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

// Sincronizar país seleccionado
function sincronizarConfirmacion() {
  const countryData = itiPrincipal.getSelectedCountryData();
  itiConfirm.setCountry(countryData.iso2);
}
inputPrincipal.addEventListener("countrychange", sincronizarConfirmacion);
sincronizarConfirmacion();

// === SUBMIT ===
const botonEnviar = document.getElementById("botonEnviar");

document.getElementById("aventuraForm").addEventListener("submit", function (e) {
  e.preventDefault();

  let valido = true;
  let primerError = null;

  // Limpiar errores anteriores
  document.getElementById("errorTelefono").classList.add("hidden");
  document.getElementById("errorConfirmacion").classList.add("hidden");
  document.getElementById("errorTelefono").innerText = "";
  document.getElementById("errorConfirmacion").innerText = "";

  // Validar requeridos
  this.querySelectorAll("[required]").forEach(campo => {
    if (!campo.value.trim() || !campo.checkValidity()) {
      valido = false;
      if (!primerError) primerError = campo;

      campo.classList.add("error-flash");
      setTimeout(() => campo.classList.remove("error-flash"), 500);
    }
  });

  if (!valido && primerError) {
    primerError.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  // Loader en el botón
  botonEnviar.disabled = true;
  botonEnviar.innerHTML = `<span class="spinner"></span> Validando...`;

  // === Validaciones adicionales ===
  if (!itiPrincipal.isValidNumber()) {
    document.getElementById("errorTelefono").innerText = "❌ El número principal no es válido.";
    document.getElementById("errorTelefono").classList.remove("hidden");
    valido = false;
  }

  if (!itiConfirm.isValidNumber()) {
    document.getElementById("errorConfirmacion").innerText = "❌ El número de confirmación no es válido.";
    document.getElementById("errorConfirmacion").classList.remove("hidden");
    valido = false;
  }

  const numeroPrincipal = itiPrincipal.getNumber();
  const numeroConfirm = itiConfirm.getNumber();

  function normalizarNumero(num) {
    return num.replace(/[\s\-]/g, "");
  }

  if (normalizarNumero(numeroPrincipal) !== normalizarNumero(numeroConfirm)) {
    document.getElementById("errorConfirmacion").innerText = "❌ Los números no coinciden.";
    document.getElementById("errorConfirmacion").classList.remove("hidden");
    valido = false;
  }

  if (archivosSeleccionados.length === 0) {
    alert("❌ Debes subir al menos una imagen de la aventura.");
    valido = false;
  }

// ✅ Mostrar modal
if (valido) {
  setTimeout(() => {
    const modal = document.getElementById("modalExito");
    modal.classList.remove("hidden");
    modal.style.display = "flex";

    // Rellenar resumen...
    document.getElementById("resumenCiudad").innerText = document.getElementById("ciudad").value;

    // 👇 Aquí manejamos el caso "Otro"
    const tipoSeleccionado = document.getElementById("tipo").value;
    const otroTipo = document.getElementById("otroTipo") ? document.getElementById("otroTipo").value : "";

    if (tipoSeleccionado === "Otro" && otroTipo.trim() !== "") {
      document.getElementById("resumenTipo").innerText = `Otro (${otroTipo})`;
    } else {
      document.getElementById("resumenTipo").innerText = tipoSeleccionado;
    }

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

    // 🖼️ Rellenar imágenes seleccionadas
    const resumenImagenes = document.getElementById("resumenImagenes");
    resumenImagenes.innerHTML = ""; // limpiar
    archivosSeleccionados.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement("img");
        img.src = e.target.result;
        img.className = "w-full h-24 object-cover rounded-lg border shadow-sm";
        resumenImagenes.appendChild(img);
      };
      reader.readAsDataURL(file);
    });

    botonEnviar.disabled = false;
    botonEnviar.innerHTML = "Enviar Registro";
  }, 800);
} else {
  botonEnviar.disabled = false;
  botonEnviar.innerHTML = "Enviar Registro";
}

enviarDatos(); // 👈 Aquí mandamos los datos a Sheets/Drive

});




// === CERRAR MODAL ===
document.getElementById("cerrarModalBtn").addEventListener("click", () => {
  const modal = document.getElementById("modalExito");
  modal.classList.add("hidden");
  modal.style.display = "none";

  // 🔄 Restaurar botón aquí también
  botonEnviar.disabled = false;
  botonEnviar.innerHTML = "Enviar Registro";
});

// Opcional: cerrar modal al hacer clic fuera del contenido
document.getElementById("modalExito").addEventListener("click", (e) => {
  if (e.target.id === "modalExito") {
    e.currentTarget.classList.add("hidden");
    e.currentTarget.style.display = "none";

    // 🔄 Restaurar botón aquí también
    botonEnviar.disabled = false;
    botonEnviar.innerHTML = "Enviar Registro";
  }
});











// === ENVIAR DATOS A GOOGLE SHEETS CON IMÁGENES ===
async function enviarDatos() {
  const url = "https://script.google.com/macros/s/AKfycbwvpQLFfCzYYrUUTJQdZhxUHHDjt0HF4mNCHnT1k6ig_FSze71egP2BEWFRkhxJapJB/exec"; // tu Web App

  const formData = {
    ciudad: document.getElementById("ciudad").value,
    tipo: (document.getElementById("tipo").value === "Otro" 
       ? "Otro (" + document.getElementById("otroTipo").value + ")" 
       : document.getElementById("tipo").value),
    nombreAventura: document.getElementById("nombreAventura").value,
    nombreAventuraIngles: document.getElementById("nombreAventuraIngles").value,
    precioBase: document.getElementById("precioBase").value,
    porcentaje: document.getElementById("porcentaje").value,
    precioVenta: document.getElementById("precioVenta").value,
    ganancia: document.getElementById("gananciaJexpedition").value,
    descripcion: document.getElementById("descripcion").value,
    incluye: document.getElementById("incluye").value,
    destacados: document.getElementById("destacados").value,
    restringidos: document.getElementById("restringidos").value,
    agencia: document.getElementById("agencia").value,
    telefono: document.getElementById("telefonoCompleto").value,
    imagenes: []
  };

  // Convertir imágenes a base64
  for (let file of archivosSeleccionados) {
    try {
      const base64 = await toBase64(file);
      formData.imagenes.push({
        name: file.name,
        type: file.type,
        data: base64
      });
    } catch (err) {
      console.error("Error convirtiendo imagen a base64:", file.name, err);
    }
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" }
    });

    const result = await res.json();
    if (result.success) {
      alert("✅ Registrado correctamente. Carpeta: " + result.link);
    } else {
      alert("❌ Error: " + result.error);
    }

  } catch (err) {
    console.error("Error enviando los datos:", err);
    alert("❌ No se pudo enviar. ¿Estás en localhost? Recuerda abrir el HTML desde file:// o Chrome sin seguridad temporal.");
  }
}

// Convierte File a base64
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = error => reject(error);
  });
}
