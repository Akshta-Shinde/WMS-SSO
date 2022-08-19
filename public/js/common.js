var warehouse = 'WH01';
var user;

function printConsole(msg){
	console.log(msg);
}

// Common AJAX function to call lambda
function getPrcessStageDetails(sUrl, header, callbackFunction){
    $.ajax(
	{
		url: sUrl,
		type: 'GET',
		headers: header,
		contentType: 'application/json',
		success: function (result) {
            printConsole(result);
            setParentTitle(result);
            var responseCode = result.ResponseCode;
            var isLayoutChange = result.LayoutChange;
            var msgType = responseCode.substr(0, 2);
            var msgAction = responseCode.substr(2, 2);

            if(msgType == CONSTANTS.DEFAULT_MSG){
                // callbackFunction(result);
                if(isLayoutChange == CONSTANTS.CHANGE_LAYOUT){        // Call change layout function
                    changeLayout(callbackFunction, result);
                }else if(isLayoutChange == CONSTANTS.NO_CHANGE_LAYOUT){   // Call no change layout function
                    callbackFunction(result);
                }
            }
            else if(msgType == CONSTANTS.SAVE_MSG){
                showAlerts(1, "Record added successfully");
                if(isLayoutChange == CONSTANTS.CHANGE_LAYOUT){        // Call change layout function
                    changeLayout(callbackFunction, result);
                }else if(isLayoutChange == CONSTANTS.NO_CHANGE_LAYOUT){   // Call no change layout function
					callbackFunction(result);
                }
            }else if(msgType == CONSTANTS.UPDATE_MSG){
                showAlerts(1, "Record updated successfully");
                if(isLayoutChange == CONSTANTS.CHANGE_LAYOUT){        // Call change layout function
                    changeLayout(callbackFunction, result);
                }else if(isLayoutChange == CONSTANTS.NO_CHANGE_LAYOUT){   // Call no change layout function
					callbackFunction(result);
                }
            }
            // if(result.tmsg == ""){
            //     callbackFunction(result);
            //     // showAlerts(1, "Record updated successfully");
            // }
		},
		error: function (result, statusTxt, xhr) {
			// alert("Error: " + xhr.status + ": " + xhr.statusText);
		}
	});
}

// Function to chnage layout
function changeLayout(callbackFunction, result){
    $("#displayLayout").html(result.Layout);
    callbackFunction(result);
}

// Set html by id
function setStageDetails(result){
	tbl_data_mdm = result;
	result = result.body;

	for (const key in result) {
		var elementId = "display" + key;
		$("#" + elementId).html(result[key]);
	}
}

// Function to show alerts
function showAlerts(alertType, sMsg) {
    let sAlerts = '<div class="alert alertPadding alert-{ALERT-TYPE} alert-dismissible"><a href="#" class="close closeSize" data-dismiss="alert" aria-label="close">&times;</a><strong>{MSG}</strong></div>';
    let alertClass;
    if (alertType == 1) {
        alertClass = "success";
    } else {
        alertClass = "danger";
    }
    sAlerts = sAlerts.replace("{ALERT-TYPE}", alertClass).replace("{MSG}", sMsg);
    let alertDiv = parent.document.getElementById("fm-alerts");
    alertDiv.innerHTML += sAlerts;
}

// Function to make form readonly
function readonlyForm(){
	$('#displayHeader input').attr('readonly', true);
	$('#displayHeader select').attr('disabled', true);
}

// Function to get user deatails
function getUserDetails(){
    let nodelist = parent.document.querySelectorAll("iframe");
    user = $(nodelist).attr("un");

    // let FirstName = $(nodelist).attr("fn");
    // let RoleDescription = $(nodelist).attr("rd");
    // $("#userDetails").html(FirstName + '<br />' + RoleDescription);
}

// Function to set title
function setParentTitle(result){
    let titleDiv = parent.document.getElementById("displayTitle");
    $(titleDiv).html(result.body.Title);
}
