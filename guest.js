var phoneguest;
var boolfirstname = false;
var boollastname = false;
var boolpnr = false;
var scanned = false;
var guestList = [];

function fileUpload() {
  document.getElementById("myFileInput").click();
};

$(function () {
  $("#myFileInput").change(function (e) {
    let photoupload = document.getElementById("myFileInput").files[0];
    var formData = new FormData();
    formData.append("file", photoupload);

    $.ajax({
      url: 'https://theloungeapp.azurewebsites.net/accessdata/barcode',
      data: formData,
      processData: false,
      contentType: false,
      mimeType: "multipart/form-data",
      type: 'POST',

      success: function (data) {

        console.log(data.ResultData)
        let rd = JSON.parse(data);
        result = rd.ResultData;
        alert("guetsresult")
        let name = result.substr(2, 20).trim();
        let noofitem = result.substr(1, 1);
        let pnr = result.substr(23, 7);
        document.getElementById("submitguest").disabled = false;
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
          $('#calenderguest span').html(day.format('DD/MM/YYYY'));
          var temp1 = day.format('MM-DD-YYYY');
          var temp2 = new Date(temp1);
          var startDt = temp2.toISOString();
          document.querySelector('#dateiso').value = startDt;

          console.log(date, "date");
          // cabin
          $("#cabin").val(result.substr(47, 1));
          $("#inputSeat").val(result.substr(48, 4).replace(/^0+/, ''));
          scanned = true;
        }

        else {
          document.getElementById("seat2guest").style.display = "none";
          $("#lastName").val(name.split('/')[0]);
          $("#firstName").val(name.split('/')[1]);
          $("#pnr").val(result.substr(23, 7));
          $("#from").val(result.substr(30, 3));
          $("#to").val(result.substr(33, 3));
          //  carrier
          $("#carrierguest").val(result.substr(36, 3).trim());
          $("#flightNumber").val(result.substr(39, 5).trim().replace(/^0+/, ''));

          let date = result.substr(44, 3);
          let day = moment().dayOfYear(date);
          $('#calenderguest span').html(day.format('DD/MM/YYYY'));
          var temp1 = day.format('MM-DD-YYYY');
          var temp2 = new Date(temp1);
          var startDt = temp2.toISOString();
          document.querySelector('#dateiso').value = startDt;

          $("#cabin").val(result.substr(47, 1));
          $("#seatguest").val(result.substr(48, 4).replace(/^0+/, ''));
          $("#cabinguest").val(result.substr(137, 16));

          scanned = true;
        }
      },
      error: function (xhr, textStatus, error) {
        alert("error2 " + xhr.responseText);
      }

    });

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
});

  function contactChangeguest(input) {
    var numguest = phoneguest.getNumber();
    var validguest = phoneguest.isValidNumber();
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
    project.pnr = $("#pnr").val();;
    project.carrier = $("#carrierguest").val();;
    project.flightNumber = $("#flightNumber").val();;
    project.flightDate = document.querySelector('#dateiso').value;
    project.from = $("#from").val();
    project.to = $("#to").val();
    project.transit = $("#transitguest").val();
    project.transitSeat = $("#transitSeatguest").val();
    project.cabin = $("#cabinguest").val();
    project.seat = $("#seatguest").val();
    project.tier = "";
    project.frequentFlyerNumber = $("#frequentFlyerNumberguest").val();
    project.comments = $("#commentsguest").val();
    project.phone = $("#phone").val();
    project.scanned = scanned;
    guestList.push(project);
    resetallvariables();
    document.getElementById("guestdiv").style.display = "none";
    document.getElementById("mainformdiv").style.display = "block";

  }

  function resetallvariables() {
    if (guestList.length > 0) {
      for (k = 1; k <= guestList.length; k++)
        document.getElementById("guest" + k).disabled = true;
    }
    document.getElementById("guestform").reset();
    document.getElementById("submitguest").disabled = true;
    boolfirstname = false;
    boollastname = false;
    boolpnr = false;
    scanned = false;
  }

  function isNumberKey(evt) {
    var charCode = evt.which ? evt.which : evt.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))
      return false;
    return true;
  }

  function backGuest() {
    document.getElementById("guestform").reset();
    document.getElementById("guestdiv").style.display = "none";
    document.getElementById("mainformdiv").style.display = "block";
    resetallvariables();
  }
