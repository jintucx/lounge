$(document).ready(function () {
    $('#selectid').on('change', function(){
        var selected = $(this).val();
        if (selected !==""){
          document.getElementById("loungesubmit").disabled=false;
        }
        else{
            document.getElementById("loungesubmit").disabled=true;
        }
      });
});

document.addEventListener("DOMContentLoaded", function() {
    microsoftTeams.initialize();
    let token =localStorage.getItem("accessToken");
    if (token) {
        getallLounges();
    } else {
        $("#btnLogin").show();
        document.getElementById("wholecontent").style.display = 'none';
        document.getElementById("loading").style.display = "none";
    }
});

function submit(){
    var lounge=$('#selectid').val();
    var uri_enc = encodeURIComponent(lounge);
    window.location.href="form.html?lounge="+uri_enc;
  }

  function getallLounges(){
    $.ajax({
      url: 'https://theloungeapp.azurewebsites.net/ffpbenefit/lounges',
      type: 'GET',
     
      success: function (result) {
          $('#selectid').empty().append('<option value="">Select</option>');
          if (result.ResultData.length > 0) {
              result.ResultData.map(function (lounge) {
                  $('#selectid').append($('<option></option>').attr('value', lounge).text(lounge));
              });
          }
          
          
      },
      error: function (xhr, textStatus, error) {
          console.log("error", error);
          if (xhr.statusText == 'Unauthorized' && xhr.status == 401) {
              localStorage.removeItem(accessToken);
              location.removeItem(graphToken);
              document.getElementById("errmsg").innerText = "Authorization token has expired. Please login the Application"
          }
  
      }
  });
  }

  function Login() {
   
    localStorage.setItem("accessToken", "token");
    $("#btnLogin").hide();
    document.getElementById("wholecontent").style.display = 'block';
           document.getElementById("loading").style.display = "none";
           getallLounges();
    // microsoftTeams.authentication.authenticate({
    //     url: window.location.origin + "/signin-simple-start.html",
    //     width: 600,
    //     height: 535,
    //     successCallback: function (result) {
    //         // console.log("result", result);
    //         token = result.accessToken;
    //        localStorage.setItem("accessToken", token)
    //        getallLounges();
    //         $("#btnLogin").hide();
    //         document.getElementById("wholecontent").style.display = 'none';
    //        document.getElementById("loading").style.display = "none";
    //     },
    //     failureCallback: function (reason) {
    //         console.log("error", reason)
    //         $("#btnLogin").show();
    //         document.getElementById("wholecontent").style.display = 'none';
    //         document.getElementById("loading").style.display = "none";
    //         // handleAuthError(reason);
    //     }
    // });
}