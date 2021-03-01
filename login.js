$(document).ready(function () {
    getallLounges();

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