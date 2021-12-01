var spreadSheet = SpreadsheetApp.openByUrl("");//spreadsheet url
var hojaDePedidos = spreadSheet.getSheetByName("pedidos");
var hojaDeSeguimiento = spreadSheet.getSheetByName("seguimiento");
var hojaDeCitas = spreadSheet.getSheetByName("citas");


var columnaIdCliente = 1;
var columnaEmailCliente = 2;
var columnaTienePruebaMolde = 3;
var columnaPruebaMoldeFecha = 4;
var columnaPruebaMoldeId = 5;
var columnaTienePrimerPrueba = 6;
var columnaPrimerPruebaFecha = 7;
var columnaPrimerPruebaId = 8;
var columnaTieneSegundaPrueba = 9;
var columnaSegundaPruebaFecha = 10;
var columnaSegundaPruebaId = 11;
var columnaEntregaFecha = 12;
var columnaEntregaId = 13;
var columnaFiestaFecha = 14;
var columnaPrecio = 15;
var columnaSenia = 16;
var columnaCostoRestante = 17;
var columnaEstado = 18;


var columnaNombreCita = 1;
var columnaFechaCita = 2;
var columnaIdCita = 3;
var columnaEmailCita = 4;

function doGet() {
  var output = HtmlService.createTemplateFromFile('inicio').evaluate();
  return output.addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function include(nombreArchivo){
  return HtmlService.createHtmlOutputFromFile(nombreArchivo).getContent();
}

// funciones de la pagina

function crearCita(datos){
  var filaCita = hojaDeCitas.getLastRow() + 1;
  var datosALlenar = {};

  var idEvento = _crearEvento(datos.email, datos.evento);
  datosALlenar[columnaFechaCita] = datos.evento.fechaEvento + " / " + datos.evento.horaEvento;
  datosALlenar[columnaIdCita] = idEvento;
  datosALlenar[columnaNombreCita] = datos.nombreCliente;
  datosALlenar[columnaEmailCita] = datos.email;
  llenarDato(filaCita, datosALlenar, hojaDeCitas);
  return;
}

function crearEventos(datos){
  var filaCliente = getFilaId(datos.idCliente);
  llenarPedido(filaCliente, datos.idCliente, datos.email, datos.precio, datos.senia);
  pruebaMolde(filaCliente, datos.email, datos.pruebaMolde);
  primerPrueba(filaCliente, datos.email, datos.primerPrueba);
  segundaPrueba(filaCliente, datos.email, datos.segundaPrueba);
  entrega(filaCliente, datos.email, datos.entrega);
  fiesta(filaCliente, datos.fiesta);
}

function enviarMail(mail){
  MailApp.sendEmail(mail, "Vestidos Belem General", "prueba de mensaje \nmail enviado desde web app \nsaludos " );
}

function pruebaMolde(filaCliente="15", mail="", evento={}){

  var datosALlenar = {};

  if (Object.keys(evento).length != 0){
    var idEvento = _crearEvento(mail, evento);
    datosALlenar[columnaTienePruebaMolde] = "SI";
    datosALlenar[columnaPruebaMoldeFecha] = evento.fechaEvento + " / " + evento.horaEvento;
    datosALlenar[columnaPruebaMoldeId] = idEvento;
  }
  else{
    datosALlenar[columnaTienePruebaMolde] = "NO";
    datosALlenar[columnaPruebaMoldeFecha] = " / ";
    datosALlenar[columnaPruebaMoldeId] = " / ";
  }

  llenarDato(filaCliente, datosALlenar);
}

function primerPrueba(filaCliente, mail, evento){

  var datosALlenar = {};

  if (Object.keys(evento).length != 0){
    var idEvento = _crearEvento(mail, evento);
    datosALlenar[columnaTienePrimerPrueba] = "SI";
    datosALlenar[columnaPrimerPruebaFecha] = evento.fechaEvento + " / " + evento.horaEvento;
    datosALlenar[columnaPrimerPruebaId] = idEvento;

  }
  else{
    datosALlenar[columnaTienePrimerPrueba] = "NO";
    datosALlenar[columnaPrimerPruebaFecha] = " / ";
    datosALlenar[columnaPrimerPruebaId] = " / ";
  }

  llenarDato(filaCliente, datosALlenar);
}

function segundaPrueba(filaCliente, mail, evento){

  var datosALlenar = {};

  if (Object.keys(evento).length != 0){
    var idEvento = _crearEvento(mail, evento);
    datosALlenar[columnaTieneSegundaPrueba] = "SI";
    datosALlenar[columnaSegundaPruebaFecha] = evento.fechaEvento + " / " + evento.horaEvento;
    datosALlenar[columnaSegundaPruebaId] = idEvento;
  }
  else{
     datosALlenar[columnaTieneSegundaPrueba] = "NO";
     datosALlenar[columnaSegundaPruebaFecha] = " / ";
    datosALlenar[columnaSegundaPruebaId] = " / ";
  }

  llenarDato(filaCliente, datosALlenar);
}

function entrega(filaCliente, mail, evento){

  var idEvento = _crearEvento(mail, evento);

  var datosALlenar = {};

  datosALlenar[columnaEntregaFecha] = evento.fechaEvento + " / " + evento.horaEvento;
  datosALlenar[columnaEntregaId] = idEvento;

  llenarDato(filaCliente, datosALlenar);
}

function fiesta(filaCliente, evento){

  var datosALlenar = {};
  
  datosALlenar[columnaFiestaFecha] = evento.fechaEvento + " / ";

  llenarDato(filaCliente, datosALlenar);
}

function _crearEvento(mail, evento){

  var condiciones = {};
  condiciones.guests = (mail);
  condiciones.sendInvites = true;

  var fechaInicio = new Date(evento.fechaEvento + " " + evento.horaEvento + " GMT-3");

  var fechaFin = new Date(fechaInicio.getTime() +(60 * 60 * 1000));

  var evento = CalendarApp.createEvent(evento.nombreEvento, fechaInicio, fechaFin, condiciones);
  return evento.getId();
}

function editarPruebaMolde(idCliente, fecha, hora){

  return editarEvento(idCliente, fecha, hora, columnaPruebaMoldeId, columnaPruebaMoldeFecha);
}

function editarPrimerPrueba(idCliente, fecha, hora){

  return editarEvento(idCliente, fecha, hora, columnaPrimerPruebaId, columnaPrimerPruebaFecha);
}

function editarSegundaPrueba(idCliente, fecha, hora){

  return editarEvento(idCliente, fecha, hora, columnaSegundaPruebaId, columnaSegundaPruebaFecha);
}

function editarEntrega(idCliente, fecha, hora){

  return editarEvento(idCliente, fecha, hora, columnaEntregaId, columnaEntregaFecha);
}

function editarEvento(idCliente, fecha, hora, columnaId, columnaFecha){
  var filaCliente = getFilaId(idCliente);
  var idEvento = hojaDePedidos.getRange(filaCliente, columnaId).getValue();
  _editarEvento(idEvento, fecha, hora);
  var datosALlenar = {};
  datosALlenar[columnaFecha] = fecha + " / " + hora;

  llenarDato(filaCliente, datosALlenar);

  return datosTicket(idCliente);
}

function _editarEvento(idEvento, fecha, hora){

  var fechaInicio = new Date(fecha + " " + hora + " GMT-3");

  var fechaFin = new Date(fechaInicio.getTime() +(60 * 60 * 1000));

  CalendarApp.getEventById(idEvento).setTime(fechaInicio, fechaFin);

}

function editarFiesta(idCliente, fecha,){
  var filaCliente = getFilaId(idCliente);
  var datosALlenar = {};
  datosALlenar[columnaFecha] = fecha + " / ";
  llenarDato(filaCliente, datosALlenar);

  return datosTicket(idCliente);
}

function llenarDato(filaCliente, datosALlenar, hoja=hojaDePedidos){
  var keys = Object.keys(datosALlenar);
  for(var i = 0; i < keys.length; i++){
    hoja.getRange(filaCliente, parseInt(keys[i])).setValue(datosALlenar[keys[i]]);
  }
}

function llenarPedido(fila, id, mail, precio, senia){
  var datosALlenar = {};

  datosALlenar[columnaIdCliente] = id;
  datosALlenar[columnaEmailCliente] = mail;
  datosALlenar[columnaPrecio] = parseInt(precio);
  datosALlenar[columnaSenia] = parseInt(senia);
  datosALlenar[columnaCostoRestante] = parseInt(precio) - parseInt(senia);
  datosALlenar[columnaEstado] = "En Proceso";
  
  llenarDato(fila, datosALlenar);

}

function getFilaId(idCliente){
  var ids = hojaDePedidos.getRange(1, 1, hojaDePedidos.getDataRange().getLastRow(), 1).getValues();
  var i = 0;
  while(i < ids.length){
    if(idCliente == ids[i][0]){
      return i+1;
    }
    i++;
  }
  return i+1;
}

function getAllTickets(){
  var pedidos = hojaDePedidos.getDataRange().getValues();
  pedidos = pedidos.slice(1, pedidos.length);

  var resultado = [];

  for(var i = 0; i < pedidos.length; i++){
    var fila = pedidos[i];
    
    var aux = [];

    aux.push(fila[columnaIdCliente-1]);
    aux.push(fila[columnaEmailCliente-1]);
    aux.push(fila[columnaEntregaFecha-1]);
    aux.push(fila[columnaEstado-1]);

    resultado.push(aux);

  }

  return resultado;
}

function getSeguimiento(idCliente="505"){
  var valoresSeguimiento = hojaDeSeguimiento.getDataRange().getValues();

  idCliente = parseInt(idCliente);

  var seguimientos = [];

  for(var i = 0; i < valoresSeguimiento.length; i++){
    if(valoresSeguimiento[i][0] == idCliente){
      var aux = [];

      var fecha = valoresSeguimiento[i][1].split(" / ")[0];
      var descripcion = valoresSeguimiento[i][2];

      aux.push(fecha);
      aux.push(descripcion);

      seguimientos.push(aux);
      
    }
  }

  return seguimientos;
}

function datosTicket(idCliente="505"){

  idCliente = parseInt(idCliente);

  var filaDatosCliente = hojaDePedidos.getRange(getFilaId(idCliente), 1, 1, 19).getValues()[0];

  var datos = {};

  datos.idCliente = filaDatosCliente[columnaIdCliente-1];
  datos.emailCliente = filaDatosCliente[columnaEmailCliente-1];

  datos.tienePruebaMolde = filaDatosCliente[columnaTienePruebaMolde-1];

  var moldeFechaHora = filaDatosCliente[columnaPruebaMoldeFecha-1].split(" / ");

  datos.pruebaMoldeFecha = moldeFechaHora[0];
  datos.pruebaMoldeHora = moldeFechaHora[1];

  datos.tienePrimerPrueba = filaDatosCliente[columnaTienePrimerPrueba-1];

  var primerFechaHora = filaDatosCliente[columnaPrimerPruebaFecha-1].split(" / ");

  datos.primerPruebaFecha = primerFechaHora[0];
  datos.primerPruebaHora = primerFechaHora[1];

  datos.tieneSegundaPrueba = filaDatosCliente[columnaTieneSegundaPrueba-1];

  var segundaFechaHora = filaDatosCliente[columnaSegundaPruebaFecha-1].split(" / ");

  datos.segundaPruebaFecha = segundaFechaHora[0];
  datos.segundaPruebaHora = segundaFechaHora[1];

  var entregaFechaHora = filaDatosCliente[columnaEntregaFecha-1].split(" / ");

  datos.entregaFecha = entregaFechaHora[0];
  datos.entregaHora = entregaFechaHora[1];

  datos.precio = filaDatosCliente[columnaPrecio-1];
  datos.senia = filaDatosCliente[columnaSenia-1];
  datos.costoRestante = filaDatosCliente[columnaCostoRestante-1];
  datos.estado = filaDatosCliente[columnaEstado-1];

  datos.fiestaFecha = filaDatosCliente[columnaFiestaFecha-1].split(" / ")[0];

  datos.seguimientos = getSeguimiento(idCliente);

  return datos;
}

function agregarPago(idCliente, pago){
  var filaCliente = getFilaId(idCliente);
  var nuevoRestante = hojaDePedidos.getRange(filaCliente, columnaCostoRestante).getValue() - pago;

  hojaDePedidos.getRange(filaCliente, columnaCostoRestante).setValue(nuevoRestante);


  return agregarSeguimiento(idCliente, "se hizo un pago de " + pago);
}

function agregarSeguimiento(idCliente, descripcion){
  var fechaActual = Utilities.formatDate(new Date(), "GMT-3", "dd-MM-yyyy") + " / ";

  hojaDeSeguimiento.appendRow([idCliente, fechaActual, descripcion]);

  return datosTicket(idCliente);
}

function cambiarDatosCliente(idCliente, datos){
  var filaCliente = getFilaId(idCliente);
  var pagado = hojaDePedidos.getRange(filaCliente, columnaPrecio).getValue()
               - hojaDePedidos.getRange(filaCliente, columnaCostoRestante).getValue();

  var nuevoRestante = datos.precio - pagado;

  hojaDePedidos.getRange(filaCliente, columnaEmailCliente).setValue(datos.email);
  hojaDePedidos.getRange(filaCliente, columnaPrecio).setValue(datos.precio);
  hojaDePedidos.getRange(filaCliente, columnaEstado).setValue(datos.estado);
  hojaDePedidos.getRange(filaCliente, columnaCostoRestante).setValue(nuevoRestante);

  return agregarSeguimiento(idCliente, datos.cambio);
}