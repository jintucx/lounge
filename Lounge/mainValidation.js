function getlastName(input) {
    if (input.value !== "") {
        booleanlastname = true;
        validation();
    }
}

function getfirstName(input) {

    if (input.value !== "") {
        booleanfirstname = true;
        validation();
    }
}

function getPNR(input) {
    if (input.value !== "") {
        booleanpnr = true;
        validation();
    }
}
   // cabin change
$(function () {
 
    $('#selectid').on('change', function () {
        var selected = $(this).val();
        if (selected !== "") {
            booleancabin = true;
            validation();
        }
    });
});
 // carrier change
$(function () {
   
    $("#inputFFT").on("change", function () {
        var selected = $(this).val();
        if (selected !== "") {
            document.getElementById("validatebtn").disabled = false;
            booleancarrier = true;
            validation();
        } else {
            document.getElementById("validatebtn").disabled = true;
        }
    });
});


function contactChange(input) {
    let num = phonenumber.getNumber();
    let valid = phonenumber.isValidNumber();
    document.getElementById("phoneerrmsg").innerText = "";
    if (input.value) {
        if (valid) {
            boolphone = true;
            document.getElementById("phoneerrmsg").innerText = "";
            $("#inputPhone").val(num);
        } else {
            boolphone = false;
            document.getElementById("phoneerrmsg").innerText = "Invalid Phone Number";
        }
    } else {
        boolphone = true;
    }
    validation();

}

function validation() {
    if ($("#inputLastname").val() !== "") {
        booleanfirstname = true;
    }
    if ($("#inputFirstname").val() !== "") {
        booleanlastname = true;
    }
    if ($("#inputPnr").val() !== "") {
        booleanpnr = true;
    }
    if ($("#inputFFT").val() !== "" && $("#inputFFT").val() !== null) {
        booleancarrier = true;
        document.getElementById("validatebtn").disabled = false;
    }
    else {
        booleancarrier = false;
        document.getElementById("validatebtn").disabled = true;
    }
    if ($("#selectid").val() !== "" && $("#selectid").val() !== null) {
        booleancabin = true;
    }

    if (booleanfirstname && booleanlastname && booleanpnr && booleancarrier && booleancabin && boolphone) {

        document.getElementById("submit").disabled = false;
    }
    else {

        document.getElementById("submit").disabled = true;
    }
}