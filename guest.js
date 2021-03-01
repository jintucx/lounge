var phoneguest;
var boolfirstname = false;
var boollastname = false;
var boolpnr = false;
var scanned=false;
var guestList=[];

$(function () {

  var myInput = document.getElementById('myFileInput');

  function sendPic() {

  
      // var file = myInput.files[0];
  // alert("sf");
  var formData = new FormData();
  debugger
  formData.append("file", myInput.files[0]);
    
		$.ajax({
			url: 'https://theloungeapp.azurewebsites.net/accessdata/barcode',
			data: formData,
			processData: false,
			contentType: false,
			mimeType: "multipart/form-data",
			type: 'POST',
		
			success: function (data) {
			alert("hi")
			},
			error: function (xhr, textStatus, error) {}
		});


  }
  
  myInput.addEventListener('change', sendPic, false);


  var input = document.querySelector("#phone");

  phoneguest = intlTelInput(input, {
    initialCountry: "ae",
    utilsScript: "util.js",
    separateDialCode: true,
  });


  let currentdate = moment();
  $('#calenderguest span').html(currentdate.format('DD/MM/YYYY'));
  let currentdate1 = currentdate.format('MM-DD-YYYY');
  let currentdate2 = new Date(currentdate1);
  let startcurrentdate = currentdate2.toISOString();
  document.querySelector('#dateiso').value = startcurrentdate;

let todayDateguest = new Date();
let maxDateguest = new Date();
let minDateguest = new Date();
  maxDateguest.setDate(todayDateguest.getDate() + 1);
  minDateguest.setDate(todayDateguest.getDate() - 1);

  $('#calenderguest').daterangepicker({
    singleDatePicker: true,
    showDropdowns: true,
    startDate: currentdate,
    minDate: minDateguest,
    maxDate: maxDateguest,
  }, function (currentdate) {
    $('#calenderguest span').html(currentdate.format('DD/MM/YYYY'));
    var currentdate1 = currentdate.format('MM-DD-YYYY');
    var currentdate2 = new Date(currentdate1);
    var startcurrentdate = currentdate2.toISOString();
    document.querySelector('#dateiso').value = startcurrentdate;


  });





});

function contactChangeguest(input) {
var numguest = phoneguest.getNumber();
var  validguest = phoneguest.isValidNumber();
  if (validguest) {
    document.getElementById("phoneerrmsgguest").innerText = "";
    $("#phone").val(numguest)
  } else {
    document.getElementById("phoneerrmsgguest").innerText = "Invalid Phone Number";
  }
 
}
function transitChangeguest(input) {
  if (input.value !== "") {
    document.getElementById("seat2").style.display = "block";
  } else {
    document.getElementById("seat2").style.display = "none";
  }
}

function getlastNameguest(input) {
  if (input.value !== "") {
    boollastname = true;
    if (boolfirstname && boollastname && boolpnr) {
      document.getElementById("submitguest").disabled = false;
    }
  }
}
function getfirstNameguest(input) {
   if (input.value !== "") {
    boolfirstname = true;
    if (boolfirstname && boollastname && boolpnr) {
      document.getElementById("submitguest").disabled = false;
    }
  }
}
function getPNRguest(input) {

  if (input.value !== "") {
    boolpnr = true;
    if (boolfirstname && boollastname && boolpnr) {
      document.getElementById("submitguest").disabled = false;
    }
  }
}

function resetFormGuest() {
  document.getElementById("guestform").reset();
  document.getElementById("phoneerrmsgguest").innerText = "";
}
function saveFormGuest(event) {
  event.preventDefault();
 
  var project = {};
  project.lastName = $("#lastName").val();
  project.firstName = $("#firstName").val();
  project.pnr =$("#pnr").val();;
  project.carrier = $("#carrierguest").val();;
  project.flightNumber =$("#flightNumber").val();;
  project.flightDate = 
  project.from = $("#from").val();
  project.to = $("#to").val();
  project.transit =  $("#transitguest").val();
  project.transitSeat =  $("#transitSeatguest").val();
  project.cabin =  $("#cabinguest").val();
  project.seat = $("#seatguest").val();
  project.tier = "";
  project.frequentFlyerNumber = $("#frequentFlyerNumberguest").val();
  project.comments = $("#commentsguest").val();
  project.phone = $("#phone").val();
  project.scanned =scanned;
  guestList.push(project);
  resetallvariables();
  document.getElementById("guestdiv").style.display = "none";
  document.getElementById("mainformdiv").style.display = "block";

}

function  resetallvariables() {
  if(guestList.length>0){
    for(k=1;k<=guestList.length;k++)
    document.getElementById("guest"+k).disabled = true;
  }
  document.getElementById("guestform").reset();
  document.getElementById("submitguest").disabled = true;
  boolfirstname = false;
 boollastname = false;
 boolpnr = false;
 scanned=false;
}

function isNumberKey(evt) {
  var charCode = evt.which ? evt.which : evt.keyCode;
  if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))
    return false;
  return true;
}
function backGuest(){
  document.getElementById("guestform").reset();
  document.getElementById("guestdiv").style.display = "none";
  document.getElementById("mainformdiv").style.display = "block";
  resetallvariables();
}

function ScanGuest(){
  
}