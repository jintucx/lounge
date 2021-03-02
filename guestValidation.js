function validationguest() {
    if ($("#lastName").val() !== "") {
        boolfirstname = true;
    }
    if ($("#firstName").val() !== "") {
        boollastname = true;
    }
    if ($("#pnr").val() !== "") {
        boolpnr = true;
    }
    if (
        boolfirstname && boollastname && boolpnr && boolguestphone) {
        document.getElementById("submitguest").disabled = false;
    } else {
        document.getElementById("submitguest").disabled = true;
    }
}

function contactChangeguest(input) {
    var numguest = phoneguest.getNumber();
    var validguest = phoneguest.isValidNumber();
    document.getElementById("phoneerrmsgguest").innerText = "";

    if (input.value) {
        if (validguest) {
            boolguestphone = true;
            document.getElementById("phoneerrmsgguest").innerText = "";
            $("#phone").val(numguest);
        } else {
            boolguestphone = false;
            document.getElementById("phoneerrmsgguest").innerText = "Invalid Phone Number";
        }
    } else {
        boolguestphone = true;
    }
    validationguest

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
        validationguest();
    }
}

function getfirstNameguest(input) {
    if (input.value !== "") {
        boolfirstname = true;
        validationguest();
    }
}

function getPNRguest(input) {

    if (input.value !== "") {
        boolpnr = true;
        validationguest();
    }
}

function getpostapi(usertype, pnrnumber) {
    data = {};
    data.GuestType = usertype;
    data.PNR = pnrnumber;
    $.ajax({
      url: "https://theloungeapp.azurewebsites.net/accessdata/scanned",
      type: "POST",
  
      data: JSON.stringify(data),
      contentType: "application/json",
      success: function (result) {
      },
      error: function (xhr, textStatus, error) {
        console.log("error", error);
        if (xhr.statusText == "Unauthorized" && xhr.status == 401) {
          document.getElementById("errmsg").innerText =
            "Authorization token has expired. Please login the Application";
        }
      },
    });
  }
