var phoneguest;
var boolfirstname = false;
var boollastname = false;
var boolpnr = false;
var boolguestphone = true;
var scanned = false;
var guestList = [];

function fileUpload() {
  document.getElementById("myFileInput").click();
  $("#guestdiv input:text").val("");
};

//  date picker
$(document).ready(function () {
 callcalender();
});
function callcalender(){
  $('#datepickguest').datepicker({
    minDate: '-1D',
    maxDate: '+1D',
    onSelect: function () {
      let dateObject = $("#datepickguest").datepicker({ dateFormat: 'yy-mm-dd' }).val();
      // document.querySelector('#dateiso').value = dateObject;
      let startDt = moment(dateObject).format("YYYY-MM-DDT00:00:00.000") + "Z";
      document.querySelector('#dateiso').value = startDt;

    }
  });
  $("#datepickguest").datepicker().datepicker("setDate", new Date());
  let dateObject = $("#datepickguest").datepicker({ dateFormat: 'yy-mm-dd' }).val();
  // document.querySelector('#dateiso').value = dateObject;
  let startDt = moment(dateObject).format("YYYY-MM-DDT00:00:00.000") + "Z";
  document.querySelector('#dateiso').value = startDt;
}

// scan
$(function () {
  $("#myFileInput").change(function (e) {
    document.getElementById("main").style.display = "none";
    document.getElementById("loading").style.display = "block";
    let photoupload = document.getElementById("myFileInput").files[0];
    var formData = new FormData();
    formData.append("file", photoupload);
    if (photoupload) {
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
          getpostapi("AccompanyingGuest", pnr);

          if (noofitem == 2) {
            flight1 = result.split(pnr)[1];
            flight2 = result.split(pnr)[2];

            $("#lastName").val(name.split('/')[0]);
            $("#firstName").val(name.split('/')[1]);
            $("#pnr").val(result.substr(23, 7));
            $("#from").val(result.substr(30, 3));
            $("#transitguest").val(result.substr(33, 3));

            $("#to").val(flight2.substr(3, 3));
            document.getElementById("seat2").style.display = "block";
            $("#transitSeatguest").val(flight2.substr(18, 4).replace(/^0+/, ''));
            //  carrier
            $("#frequentFlyerNumberguest").val(result.substr(36, 3).trim());
            $("#flightNumber").val(result.substr(39, 5).trim().replace(/^0+/, ''));

            let date = result.substr(44, 3);
            let day = moment().dayOfYear(date);
            let temp1 = day.format('MM/DD/YYYY');
            //  let  temp2 = new Date(temp1);
            //  let  startDt = temp2.toISOString();
            let startDt = moment(temp1).format("YYYY-MM-DDT00:00:00.000") + "Z";

            document.querySelector('#dateiso').value = startDt;
            $("#datepickguest").datepicker({ dateFormat: 'yy-mm-dd' }).val(temp1)

            // cabin
            $("#cabinguest").val(result.substr(47, 1));
            $("#seatguest").val(result.substr(48, 4).replace(/^0+/, ''));
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
            let temp1 = day.format('MM/DD/YYYY');
            // let  temp2 = new Date(temp1);
            // let  startDt = temp2.toISOString();
            let startDt = moment(temp1).format("YYYY-MM-DDT00:00:00.000") + "Z";
            document.querySelector('#dateiso').value = startDt;
            $("#datepickguest").datepicker({ dateFormat: 'yy-mm-dd' }).val(temp1)

            $("#cabinguest").val(result.substr(47, 1));
            $("#seatguest").val(result.substr(48, 4).replace(/^0+/, ''));

            scanned = true;
          }
          validationguest();
        },
        error: function (xhr, textStatus, error) {
          document.getElementById("main").style.display = "block";
          document.getElementById("loading").style.display = "none";

          alert( JSON.parse(xhr.responseText).Error);
          resetallvariables();
        }

      });
    }
  });
});

// phone initialise
$(function () {
  var input = document.querySelector("#phone");
  phoneguest = intlTelInput(input, {
    initialCountry: "ae",
    utilsScript: "util.js",
    separateDialCode: true,
  });
});


function resetFormGuest() {
  // document.getElementById("guestform").reset();
  $("#guestdiv input:text").val("");
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
  if (project.lastName !== "" && project.firstName !== "" && project.pnr !== "" && project.flightDate !== undefined) {
  
  let dateObject = $("#datepickguest").datepicker({ dateFormat: 'yy-mm-dd' }).val();
 let slected=new Date(dateObject);
    let date = new Date();
    let yesterday = new Date();
    let tommorrow = new Date();
  yesterday.setDate(date.getDate() - 1);;
     tommorrow.setDate(date.getDate() + 1);;
   
    if(slected.setHours(0,0,0,0) ==date.setHours(0,0,0,0) ||
    slected.setHours(0,0,0,0) ==yesterday.setHours(0,0,0,0)||
    slected.setHours(0,0,0,0) ==tommorrow.setHours(0,0,0,0)){
      guestList.push(project);
      resetallvariables();
    document.getElementById("guestdiv").style.display = "none";
    document.getElementById("mainformdiv").style.display = "block";
    }else{
      alert("Insert proper date")
    }
  }
  else if(project.flightDate == undefined) {
    alert("Insert proper date")
  }
  

}

function resetallvariables() {
  if (guestList.length > 0) {
    for (k = 1; k <= guestList.length; k++)
      document.getElementById("guest" + k).disabled = true;
  }
  // document.getElementById("guestform").reset();
  $("#guestdiv input:text").val("");
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
  // document.getElementById("guestform").reset();
  $("#guestdiv input:text").val("");
  document.getElementById("guestdiv").style.display = "none";
  document.getElementById("mainformdiv").style.display = "block";
  resetallvariables();
}

