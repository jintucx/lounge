var phoneguest;
var boolfirstname = false;
var boollastname = false;
var boolpnr = false;
var boolguestphone = true;
var scanned = false;
var guestList = [];

function fileUpload() {
  document.getElementById("myFileInput").click();
};
 
$(document).ready(function() {
	$('#datepickguest').datepicker({
    minDate: '-1D',
        maxDate: '+1D',
        onSelect: function() { 
          // var dateObject = $(this).datepicker('getDate'); 
       let dateObject = $( "#datepickguest" ).datepicker({ dateFormat: 'yy-mm-dd' }).val();
          document.querySelector('#dateiso').value =dateObject;
          let temp = new Date(dateObject);
          let startDt = temp.toISOString();
  document.querySelector('#dateiso').value = startDt;
         
      }
  })
});

$(function () {
  $("#myFileInput").change(function (e) {
    document.getElementById("main").style.display = "none";
    document.getElementById("loading").style.display = "block";
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
        document.getElementById("main").style.display = "block";
        document.getElementById("loading").style.display = "none";
        console.log(data.ResultData)
        let rd = JSON.parse(data);
        result = rd.ResultData;

        let name = result.substr(2, 20).trim();
        let noofitem = result.substr(1, 1);
        let pnr = result.substr(23, 7);
        getpostapi("AccompanyingGuest",pnr);
    
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
         let  temp2 = new Date(temp1);
         let  startDt = temp2.toISOString();
          document.querySelector('#dateiso').value = startDt;
          $("#datepickguest" ).datepicker({ dateFormat: 'yy-mm-dd' }).val(temp1)
       
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
          let  temp2 = new Date(temp1);
          let  startDt = temp2.toISOString();
           document.querySelector('#dateiso').value = startDt;
           $("#datepickguest" ).datepicker({ dateFormat: 'yy-mm-dd' }).val(temp1)

          $("#cabinguest").val(result.substr(47, 1));
          $("#seatguest").val(result.substr(48, 4).replace(/^0+/, ''));

          scanned = true;
        }
        validationguest();
      },
      error: function (xhr, textStatus, error) {
        document.getElementById("main").style.display = "block";
        document.getElementById("loading").style.display = "none";
     
        alert(xhr.responseJSON.Error);
        resetallvariables();
      }

    });

    var input = document.querySelector("#phone");

    phoneguest = intlTelInput(input, {
      initialCountry: "ae",
      utilsScript: "util.js",
      separateDialCode: true,
    });


   
    
  });
});


function validationguest(){
  if( $("#lastName").val() !==""){
    boolfirstname =true;
  }
  if( $("#firstName").val() !==""){
    boollastname =true;
  }
  if( $("#pnr").val() !==""){
    boolpnr =true;
  }
  if (
    boolfirstname && boollastname && boolpnr&&boolguestphone) {
    document.getElementById("submitguest").disabled = false;
  } else{
    document.getElementById("submitguest").disabled = true;
  }
}

  function contactChangeguest(input) {
    var numguest = phoneguest.getNumber();
    var validguest = phoneguest.isValidNumber();
    document.getElementById("phoneerrmsgguest").innerText = "";
    if (input.value) {
      if (validguest) {
        document.getElementById("phoneerrmsgguest").innerText = "";
        $("#inputPhone").val(num);
      } else {
        boolguestphone = false;
        document.getElementById("phoneerrmsgguest").innerText = "Invalid Phone Number";
      }
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
      if (boolfirstname && boollastname && boolpnr &&boolguestphone) {
        document.getElementById("submitguest").disabled = false;
      }else{
        document.getElementById("submitguest").disabled = true;
      }
    }
  }

  function getfirstNameguest(input) {
    if (input.value !== "") {
      boolfirstname = true;
      if (boolfirstname && boollastname && boolpnr &&boolguestphone) {
        document.getElementById("submitguest").disabled = false;
      }else{
        document.getElementById("submitguest").disabled = true;
      }
    }
  }

  function getPNRguest(input) {

    if (input.value !== "") {
      boolpnr = true;
      if (boolfirstname && boollastname && boolpnr &&boolguestphone) {
        document.getElementById("submitguest").disabled = false;
      }else{
        document.getElementById("submitguest").disabled = true;
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
    if(project.lastName !=="" && project.firstName !=="" && project.pnr!=="" && project.flightDate !==""){
    guestList.push(project);
    }
    else{
alert("inavlid date")
    }
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

  function getpostapi(usertype,pnrnumber){
    data={};
    data.GuestType=usertype;
    data.PNR=pnrnumber;
    $.ajax({
      url: "https://theloungeapp.azurewebsites.net/accessdata/scanned",
     type: "POST",
 
     data: JSON.stringify(data),
     contentType: "application/json",
     success: function (result) {
     },
     error: function (xhr, textStatus, error) {
       console.log("error", error);
      //  alert(xhr.responseJSON.Error)
       if (xhr.statusText == "Unauthorized" && xhr.status == 401) {
      
         document.getElementById("errmsg").innerText =
           "Authorization token has expired. Please login the Application";
       }
     },
   });
  }