function doPost(e) {
  try {
    const hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Hoja 1');
    if (!hoja) throw new Error("No se encontró la hoja 'Hoja 1'");

    // Convertir body a JSON
    const datos = JSON.parse(e.postData.contents);

    // Función de limpieza
    const limpiar = (val) => (typeof val === 'string' ? val.trim() : (val ?? ''));

    // --- Manejo de imágenes: ahora aceptamos objetos {name,type,base64} ---
    const imagenesRecibidas = Array.isArray(datos.imagenes) ? datos.imagenes : [];

    // Crear o usar carpeta en Drive (se puede cambiar el nombre)
    const FOLDER_NAME = 'Aventuras_Imagenes';
    let folderIter = DriveApp.getFoldersByName(FOLDER_NAME);
    let folder = folderIter.hasNext() ? folderIter.next() : DriveApp.createFolder(FOLDER_NAME);

    const urlsGuardadas = [];

    imagenesRecibidas.forEach((imgObj, idx) => {
      try {
        if (!imgObj || !imgObj.base64) return;

        const blob = Utilities.newBlob(Utilities.base64Decode(imgObj.base64), imgObj.type || 'image/jpeg', imgObj.name || ('imagen_' + (idx+1)));
        const file = folder.createFile(blob);

        // Hacer el archivo accesible via link (anyone with link)
        try {
          file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        } catch (shareErr) {
          // En algunos entornos esto puede fallar por permisos, lo ignoramos pero registramos
          Logger.log('No se pudo cambiar permiso de archivo: ' + shareErr);
        }

        const url = file.getUrl();
        urlsGuardadas.push(url);
      } catch (innerErr) {
        Logger.log('Error guardando imagen: ' + innerErr);
      }
    });

    // Orden de las columnas
    const fila = [
      limpiar(datos.ciudad),                   // A
      limpiar(datos.tipo),                     // B
      limpiar(datos.otroTipo),                 // C
      limpiar(datos.nombreAventura),           // D
      limpiar(datos.nombreAventuraIngles),     // E
      limpiar(datos.precioBase),               // F
      limpiar(datos.porcentaje),               // G
      limpiar(datos.precioVenta),              // H
      limpiar(datos.gananciaJexpedition),      // I
      limpiar(datos.descripcion),              // J
      limpiar(datos.incluye),                  // K
      limpiar(datos.destacados),               // L
      limpiar(datos.restringidos),             // M
      limpiar(datos.agencia),                  // N
      limpiar(datos.tipoIdentificacion),       // O
      limpiar(datos.numeroIdentificacion),     // P
      limpiar(datos.telefono),                 // Q
      urlsGuardadas.join(', ')                 // R ✅ guardamos URLs separadas por coma
    ];

    hoja.appendRow(fila);

    return ContentService.createTextOutput(JSON.stringify({status: "success", urls: urlsGuardadas}))
                         .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({status: "error", message: err.message}))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}
