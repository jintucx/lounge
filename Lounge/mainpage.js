var lounge;
var phonenumber;
var booleanfirstname = false;
var booleanlastname = false;
var booleanpnr = false;
var booleancarrier = false;
var booleancabin = false;
var scannedprim = false;
var boolphone = true;
var benefit = 1;
// phone initialises

$(function () {
  var inputPhone = document.querySelector("#inputPhone");
  phonenumber = intlTelInput(inputPhone, {
    initialCountry: "ae",
    utilsScript: "util.js",
    separateDialCode: true,
  });
});
// date initialise
$(document).ready(function () {
  $('#datepick').datepicker({
    minDate: '-1D',
    maxDate: '+1D',
    onSelect: function () {
      var dateObject = $("#datepick").datepicker({ dateFormat: 'yy-mm-dd' }).val();
    let startDt= moment(dateObject).format("YYYY-MM-DDT00:00:00.000") + "Z";
        document.querySelector('#datestartiso').value = startDt;
    }
  });
  $("#datepick").datepicker().datepicker("setDate", new Date());
  var dateObject = $("#datepick").datepicker({ dateFormat: 'yy-mm-dd' }).val();
  let startDt= moment(dateObject).format("YYYY-MM-DDT00:00:00.000") + "Z";
      document.querySelector('#datestartiso').value = startDt;
});
// get params
$(function () {
  getallCarrier();
  var currentPageURL = decodeURIComponent(window.location.search.substring(1));
  var queryString = currentPageURL.split("&");
  lounge = queryString[0].split("=")[1];
});

function thisFileUpload() {
  document.getElementById("upload").click();
  $("#mainformdiv input:text").val("");
  
};

function goLounge() {
  window.location.href = "login.html"
}
// scanning code
$(function () {

  $("#upload").change(function (e) {
    
    let photoupload = document.getElementById("upload").files[0];
    var formData = new FormData();
    formData.append("file", photoupload);
    if(photoupload){
      document.getElementById("main").style.display = "none";
    document.getElementById("loading").style.display = "block";
    $.ajax({
      url: 'https://theloungeapp.azurewebsites.net/accessdata/barcode',
      data: formData,
      processData: false,
      contentType: false,
      mimeType: "multipart/form-data",
      type: 'POST',

      success: function (data) {
        document.getElementById("main").style.display = "block";
        document.getElementById("loading").style.display = "none";
        console.log(data.ResultData)
        let rd = JSON.parse(data);
        result = rd.ResultData;
        let name = result.substr(2, 20).trim();
        let noofitem = result.substr(1, 1);
        let pnr = result.substr(23, 7);
        getpostapi("Primary", pnr);
        // document.getElementById("submit").disabled = false;

        if (noofitem == 2) {
          flight1 = result.split(pnr)[1];
          flight2 = result.split(pnr)[2];

          $("#inputLastname").val(name.split('/')[0]);
          $("#inputFirstname").val(name.split('/')[1]);
          $("#inputPnr").val(result.substr(23, 7));

          $("#inputDeparture").val(result.substr(30, 3));
          $("#inputTransit").val(result.substr(33, 3));

          $("#inputArrival").val(flight2.substr(3, 3));
          document.getElementById("seat2").style.display = "block";
          $("#inputSeat2").val(flight2.substr(18, 4).replace(/^0+/, ''));
          //  carrier
          $("#inputFFT").val(result.substr(36, 3).trim());
          $("#inputFlight").val(result.substr(39, 5).trim().replace(/^0+/, ''));
          let date = result.substr(44, 3);
          let day = moment().dayOfYear(date);
          //  $('#calenderstart span').html(day.format('DD/MM/YYYY'));
          var temp1 = day.format('MM/DD/YYYY');
          // var temp2 = new Date(temp1);
          // var startDt = temp2.toISOString();
          let startDt= moment(temp1).format("YYYY-MM-DDT00:00:00.000") + "Z";
          document.querySelector('#datestartiso').value = startDt;

          $("#datepick").datepicker({ dateFormat: 'yy-mm-dd' }).val(temp1)
          // cabin
          $("#selectid").val(result.substr(47, 1));
          $("#inputSeat").val(result.substr(48, 4).replace(/^0+/, ''));

        }

        else {
          document.getElementById("seat2").style.display = "none";
          $("#inputLastname").val(name.split('/')[0]);
          $("#inputFirstname").val(name.split('/')[1]);
          $("#inputPnr").val(result.substr(23, 7));
          $("#inputDeparture").val(result.substr(30, 3));
          $("#inputArrival").val(result.substr(33, 3));
          //  carrier
          $("#inputFFT").val(result.substr(36, 3).trim());
          $("#inputFlight").val(result.substr(39, 5).trim().replace(/^0+/, ''));
          //  date=result.substr(44, 3);
          // cabin
          $("#selectid").val(result.substr(47, 1));
          $("#inputSeat").val(result.substr(48, 4).replace(/^0+/, ''));
          $("#inputFFTN").val(result.substr(137, 16));
          //  carrier 2

          let date = result.substr(44, 3);
          let day = moment().dayOfYear(date);
          var temp1 = day.format('MM/DD/YYYY');
          // var temp2 = new Date(temp1);
          // var startDt = temp2.toISOString();
          // document.querySelector('#datestartiso').value = startDt;
          let startDt= moment(temp1).format("YYYY-MM-DDT00:00:00.000") + "Z";
          document.querySelector('#datestartiso').value = startDt;
          
          $("#datepick").datepicker({ dateFormat: 'yy-mm-dd' }).val(temp1)
          c = result.substr(131, 3);
          ffairline = result.substr(134, 3);
          ffnno = result.substr(137, 16);
          console.log(c, ffairline, ffnno, "resulr");
          scannedprim = true;
        }
        validation();
      },
      error: function (xhr, textStatus, error) {

        document.getElementById("main").style.display = "block";
        document.getElementById("loading").style.display = "none";
        alert( JSON.parse(xhr.responseText).Error);
        resetForm();
      }
    });
  }
  });
});


function getallCarrier() {

  $.ajax({
    url: "https://theloungeapp.azurewebsites.net/ffpbenefit/carriers",
    type: "GET",

    success: function (result) {
      $("#inputFFT").empty().append('<option value="">Select</option>');
      $("#carrierguests").empty().append('<option value="">Select</option>');
      if (result.ResultData.length > 0) {
        result.ResultData.map(function (lounge) {
          $("#inputFFT").append(
            $("<option></option>").attr("value", lounge).text(lounge)
          );
          $("#carrierguest").append(
            $("<option></option>").attr("value", lounge).text(lounge)
          );
        });
      }
    },
    error: function (xhr, textStatus, error) {
      console.log("error", error);
      alert(xhr.responseJSON.Error)
      if (xhr.statusText == "Unauthorized" && xhr.status == 401) {
        localStorage.removeItem(accessToken);
        location.removeItem(graphToken);
        document.getElementById("errmsg").innerText =
          "Authorization token has expired. Please login the Application";
      }
    },
  });
}

function Validatecarrier() {
  var id = $("#inputFFTN").val();
  var jsoninput = {};
  jsoninput.Carrier = $("#inputFFT").val();
  jsoninput.Lounge = lounge;

    $.ajax({
    url:
      "https://theloungeapp.azurewebsites.net/frequentflyer/" + id + "/benefit",

    type: "POST",

    data: JSON.stringify(jsoninput),
    contentType: "application/json",
    success: function (result) {
      document.getElementById("guestrow").style.display = "block";
      document.getElementById("tier").innerHTML = result.ResultData.Tier;
      document.getElementById("tier").value = result.ResultData.Tier;
      benefit = result.ResultData.Benefit;
      var guest = result.ResultData.Benefit - 1;
      var noofguestloggedin = result.ResultData.AccompanyingGuestLogs.length;
      var noofactualusers = guest - noofguestloggedin;
    
      var k = noofactualusers + 1;
    
      $("#userlist").empty();
      for (i = 1; i <= noofactualusers; i++) {
        $("#userlist").append(
          "<div class='form-group row'><div class='col-sm-4'>" +
          "<button type='button' id='guest" +
          i +
          "' class='btn form-control validatebtn' onclick='guestAdd()'>Add Guest" +
          i +
          "</button></div ><div class='col-sm-4'>Please add a guest</div>" +
          "</div > "
        );
      }
      result.ResultData.AccompanyingGuestLogs.map((guest, index) => {
        $("#userlist").append(
          "<div class='form-group row'><div class='col-sm-4'>" +
          "<button type='button' id='guest" +
          k +
          "' class='btn form-control validatebtn' disabled >Add Guest" +
          k +
          "</button></div ><div class='col-sm-4'>" +
          guest.FirstName +
          "&nbsp;" +
          guest.LastName +
          "&nbsp;" +
          guest.PNR +
          "&nbsp;" +
          "</div></div > "
        );
        k++;
      });
    },
    error: function (xhr, textStatus, error) {
      console.log("error", error);
      alert(xhr.responseJSON.Error)
      if (xhr.statusText == "Unauthorized" && xhr.status == 401) {
        localStorage.removeItem(accessToken);
        location.removeItem(graphToken);
        document.getElementById("errmsg").innerText =
          "Authorization token has expired. Please login the Application";
      }
    },
  });
}

function resetForm() {
  $("#mainformdiv input:text").val("");
  // document.getElementById("mainform").reset();
  document.getElementById("phoneerrmsg").innerText = "";
  document.getElementById("validatebtn").disabled = true;
}

function submitForm(event) {
  event.preventDefault();
  var project = {};
  project.lastName = $("#inputLastname").val();
  project.firstName = $("#inputFirstname").val();
  project.pnr = $("#inputPnr").val();
  project.carrier = $("#inputFFT").val();
  project.flightNumber = $("#inputFlight").val();
  project.flightDate = document.querySelector('#datestartiso').value;
  project.from = $("#inputDeparture").val();
  project.to = $("#inputArrival").val();
  project.transit = $("#inputTransit").val();
  project.transitSeat = $("#inputSeat2").val();
  project.cabin = $("#selectid").val();
  project.seat = $("#inputSeat").val();
  project.tier = $("#tier").val();
  project.frequentFlyerNumber = $("#inputFFTN").val();
  project.comments = $("#inputComments").val();
  project.phone = $("#inputPhone").val();
  project.lounge = lounge;
  project.benefit = benefit;
  project.upn = "iyas@cxunicorn.com";
  project.scanned = scannedprim;
  project.accompanyingGuests = guestList;
  postdata(project);
}

function transitChange(input) {
  if (input.value !== "") {
    document.getElementById("seat2").style.display = "block";
  } else {
    document.getElementById("seat2").style.display = "none";
  }
}

function guestAdd() {

  document.getElementById("mainformdiv").style.display = "none";
  document.getElementById("guestdiv").style.display = "block";
  callcalender();
}

function postdata(project) {
  document.getElementById("main").style.display = "none";
  document.getElementById("loading").style.display = "block";
  $.ajax({
    url: " https://theloungeapp.azurewebsites.net/accessdata/submit",
    // url:"https://4c3c906375c6.ngrok.io/accessdata/submit",
    type: "POST",

    data: JSON.stringify(project),
    contentType: "application/json",
    success: function (result) {
      window.location.href = "login.html"
    },
    error: function (xhr, textStatus, error) {
      document.getElementById("error").innerHTML = xhr.responseJSON.Error;
      document.getElementById("main").style.display = "block";
      document.getElementById("loading").style.display = "none";
      console.log("error", error);
      // alert(xhr.responseJSON.Error)
      if (xhr.statusText == "Unauthorized" && xhr.status == 401) {

        document.getElementById("errmsg").innerText =
          "Authorization token has expired. Please login the Application";
      }
    },
  });


}


