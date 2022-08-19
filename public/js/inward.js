var sUrl = "https://hjv36v7vgd.execute-api.ap-south-1.amazonaws.com/dev/iks/operations";
var current_stage;
var txnNo;

// Receiving Pending (Auto PO) 
var oldBarcode_130300 = "";
var poRecNo_130300 = "";

// Receiving Pending (Existing PO) 
var oldBarcode_130350 = "";
var poRecNo_130350 = "";


// Start Receiving 
var oldEid;

$.when($.ready).then(function () {
    // setParentTitle();
    getUserDetails();
    fun100000_AV1();
});

// Function to get dashboard details for 1st column
function fun100000_AV1(){
    let header = {
        opnfor: 100000, 
        activity: "A-V",
        warehouse: warehouse
    }
    getPrcessStageDetails(sUrl, header, setFirstColumn);
}

function setFirstColumn(result){
	setStageDetails(result);
    var id = getFirstChild('colLines1');
    if(id){
        fun100000_AV2(id);
    }else{
        $('#displayColumn1').hide();
        $('#displayColumn2').hide();
	    $('#displayColumn3').hide();
    }
}

// Function to get dashboard details for 2st column
function fun100000_AV2(id){
	// setCssToSelectedRow(id);
	let header = {
		opnfor: 100000,
		activity: "A-V2",
		where: id,
		warehouse: warehouse
	}
	getPrcessStageDetails(sUrl, header, setSecondColumn);
}

function setSecondColumn(result){
	setStageDetails(result);
	fun100000_AV3(getFirstChild('colLines2'));
}

// Function to get dashboard details for 3st column
function fun100000_AV3(id){
	// setCssToSelectedRow(id);
	var header = {
		opnfor: 100000, 
		activity: "A-V3",
		where: id,
		warehouse: warehouse
	}
	getPrcessStageDetails(sUrl, header, setThirdColumn);
}

function setThirdColumn(result){
	setStageDetails(result);
}

// Function to get selected transaction stage
function getDetails(id){
	let arr = id.split("|");
	let cust = arr[0];
	current_stage = arr[1];
	txnNo = (arr[2] ? arr[2] : '')
	let invNo = (arr[3] ? arr[3] : '')
	let act = 'A-V';

    console.log(user)
	let header = {
		opnfor: current_stage,
		activity: act,
		transaction: txnNo,
		where: invNo,
		customer: cust,
		warehouse: warehouse,
        user: user
	}
	getPrcessStageDetails(sUrl, header, setStageDetails);
}

function getFirstChild(divID){
    let childId;
    let content = document.getElementById(divID);
    if(content){
        let firstChild = content.firstChild;

        childId = $(firstChild).attr('id');
    }else{
        childId = ''
    }

	return childId;
}

function setCssToSelectedRow(id){
	let preId;

	if(id.length == 2){
		preId = $("#displayColumn1").attr("sId");
		$("#displayColumn1").attr("sId", id);
	}else if(id.length == 6){
		preId = $("#displayColumn2").attr("sId");
		$("#displayColumn2").attr("sId", id);
	}else{
		preId = $("#displayColumn3").attr("sId");
		$("#displayColumn3").attr("sId", id);
	}

	$("#" + preId).removeClass("selectedRow");
	$("#" + id).addClass("selectedRow");
}

function getTodayDate() {
    var today = new Date().toISOString().slice(0, 10);
    $("#txnDate").val(today);
}

function getPrevDate() {
    var today = new Date($('#txnDate').val());
    today = today.setDate(today.getDate() - 1);
    today = new Date(today).toISOString().slice(0, 10);
    $("#txnDate").val(today);
    getTxnList();
}

function getNextDate() {
    var today = new Date($('#txnDate').val());
    today = today.setDate(today.getDate() + 1);
    today = new Date(today).toISOString().slice(0, 10);
    $("#txnDate").val(today);
    getTxnList();
}

function getTxnList() {
    var selectedDate = $('#txnDate').val();
    var header = {
		opnfor: 110000,
		activity: "A-01",
		transaction: selectedDate,
		warehouse: "WH01",
		customer: "1",
	}

	getPrcessStageDetails(sUrl, header, setStageDetails);
}

function createNewGateIn(){
    // getTxnMeta();
    var header = {
		opnfor: 110100,
		// tableNo: "2", 
		activity: "A-V",
		warehouse: "WH01"
	}
	getPrcessStageDetails(sUrl, header, setStageDetails);
}

function getDateTime(){
	var currentdate = new Date();
	var year    = currentdate.getFullYear();
	var month   = currentdate.getMonth()+1; 
	var day     = currentdate.getDate();
	var hour    = currentdate.getHours();
	var minute  = currentdate.getMinutes();

	if(month.toString().length == 1) {
		month = '0'+month;
	}
	if(day.toString().length == 1) {
			day = '0'+day;
	}   
	if(hour.toString().length == 1) {
			hour = '0'+hour;
	}
	if(minute.toString().length == 1) {
			minute = '0'+minute;
	}
	var datetime = year + month + day + "-" + hour + minute;
	return datetime;
}

function f_110100(act_id){
    if(act_id == CONSTANTS.ACTIVITY_01){
        backToDashboard();
    }
    else if(act_id == CONSTANTS.ACTIVITY_AX_01){
		let txnNo = $('#RecordNo').val();
        var cust = $("input[name=ClientID]").attr('id');
        console.log(cust);
        var header = {
            opnfor: 110100,
            tableNo: "2", 
            activity: "AX-01",
            transaction: txnNo,
            warehouse: "WH01",
            customer: cust,
            user: "emiza"
        }

        getPrcessStageDetails(sUrl, header, backToDashboard);
    }
}
// Function to get Dashboard
function backToDashboard(){
    fun100000_AV1();

    // If there's Alert - remove it
    if(document.getElementById("fm-alerts") != null){
        let alertDiv = parent.document.getElementById("fm-alerts");
        alertDiv.innerHTML = '';
    }

}

// Gate- In Pending assignment  
function f_110105(act_id){
    if(act_id == CONSTANTS.ACTIVITY_01){
        backToDashboard();
    }
    else if(act_id == CONSTANTS.ACTIVITY_AX_01){
        // Send To Capture Invoice Details
        let txnNo = $('#RecordNo').val()
        let assignTo = $('select#AssignTo').find('option:selected').val();
        // var assignTo = '1';
        let user = 'emiza';
        let cust = $("input[name=ClientID]").attr("cId");
    
        let header = {
            opnfor: '110105', 
            activity: act_id,
            transaction: txnNo,
            where: assignTo, 
            warehouse: warehouse,
            customer: cust,
            user: user
        }
        getPrcessStageDetails(sUrl, header, setStageDetails);
    }
}

// Pending SAN
function f_120001(act_id){
    if(act_id == CONSTANTS.ACTIVITY_01){
        backToDashboard();
    }
}

// Capture Invoice wise details
function f_120100(act_id){
    if(act_id == CONSTANTS.ACTIVITY_01){
        backToDashboard();
    }
    else if(act_id == CONSTANTS.ACTIVITY_AX_01){
        // Send To Unloading
        let txnNo = $('#RecordNo').val();
        let warehouse = 'WH01';
        let customer = $(ClientID).attr('sid');
        let user = 'emiza'
    
        let header = {
            opnfor: '120100',
            activity: act_id,
            transaction: txnNo, 
            warehouse: warehouse,
            customer: customer,
            user: user
        }
        getPrcessStageDetails(sUrl,header, setStageDetails);
    }
}

// Capture Invoice SKU Details
function f_120130(act_id){
    if(act_id == CONSTANTS.ACTIVITY_01){
        backToDashboard();
    }
    else if(act_id == CONSTANTS.ACTIVITY_AX_01){
        // Capture Invoice SKU completed
        let invRecNo = $(GEInvNo).attr('sid');
        let warehouse = 'WH01';
        let customer = $(ClientId).attr('sid');
        let user = 'emiza'
    
        let header = {
            opnfor: '120130',
            activity: act_id,
            transaction: invRecNo,
            warehouse: warehouse,
            customer: customer,
            user: user
        }
        getPrcessStageDetails(sUrl,header, setStageDetails);
    }
}

// Unloading
function f_120150(act_id){
    if(act_id == CONSTANTS.ACTIVITY_01){
        backToDashboard();
    }
    else if(act_id == CONSTANTS.ACTIVITY_AX_01){
        // Send To Stickering
        let invNo = $(InvoiceNo).attr('sid');
        let rBoxQty = $('#RecievedBoxQty').val();
        let rDBoxQty = $('#RecievedDamagedBoxQty').val();
        let wCon = rBoxQty + "|" + rDBoxQty;
        let warehouse = 'WH01';
        let customer = $(ClientId).attr('sid');
        let user = 'emiza'
    
        let header = {
            opnfor: '120150', 
            activity: act_id,
            transaction: invNo, 
            where:wCon,
            warehouse: warehouse,
            customer: customer,
            user: user
        }
        getPrcessStageDetails(sUrl,header, setStageDetails);
    }
}



// Stickering
function f_120200(act_id){
    if(act_id == CONSTANTS.ACTIVITY_01){
        backToDashboard();
    }
    else if(act_id == CONSTANTS.ACTIVITY_02){
    //    Print all stickers...
    }
    else if(act_id == CONSTANTS.ACTIVITY_AX_01){
        // Stickering completed
        let invRecNo = $(InvoiceNo).attr('sid');
        let warehouse = 'WH01';
        let customer = $(ClientId).attr('sid');
        let user = 'emiza'
    
        let header = {
            opnfor: '120200',
            activity: act_id,
            transaction: invRecNo,
            warehouse: warehouse,
            customer: customer,
            user: user
        }
        getPrcessStageDetails(sUrl,header, setStageDetails);
    }
}

// Approve and send SAN
function f_120300(act_id){
    if(act_id == CONSTANTS.ACTIVITY_01){
        backToDashboard();
    }
    else if(act_id == CONSTANTS.ACTIVITY_AX_01){
        // Send Email, SAN Completed
        let warehouse = 'WH01';
        let txnNo = $('#RecordNo').val(); // RecordNo
        let customer = $(ClientID).attr('sid'); // ClientID
        let user = 'emiza'

        document.getElementById("spaceRemove").remove(); // To remove extra </br>'s

        let comment = document.getElementById("textAdditionalComment").value; // Getting the Additional comment value

        if(!comment){ // If no value in Additional comment, remove the specific Div
            document.getElementById("additionalComment").remove();
        }else{ // If there's value add the comment to the email
            document.getElementById("additionalComment").innerHTML  = comment
            document.getElementById("additionalComment").style.display = "block";
        }
        
        document.getElementById("textAdditionalComment").remove(); // Remove the Text-Area even if the comment is present or not 

        let emailBody = document.getElementById('sanFinalMail').innerHTML; // get the email body which needs to send

        // As it's String and we have to pass this body to JSON we need to make this email body in single quotes(')  
        let finalBody = emailBody.replace(/"/g, "'"); 

        // Making of final email, concat the email body and the style/css into the emailFinal
        emailFinal = "<html><head><style>.sanEmailHeader{ border:1px solid darkgrey; text-align:left; padding:5px; background:#d5d5d5; } .sanEmailLine{ border:1px solid darkgrey; text-align:center; padding:5px; } .sanTable{ font-family:arial,sans-serif; border-collapse:collapse; width:62%; }</style></head><body>" + finalBody + "</body></html>"
    
        let header = {
            opnfor: '120300',
            activity: act_id,
            transaction: txnNo, 
            warehouse: warehouse,
            customer: customer,
            user: user,
            where:emailFinal
        }
        getPrcessStageDetails(sUrl,header, setStageDetails);
    }
}


// Associate PO or Create new PO
function f_130200(act_id){
    if(act_id == CONSTANTS.ACTIVITY_01){
        backToDashboard();
    }
    else if(act_id == CONSTANTS.ACTIVITY_AX_01){
        //  Create PO
        let warehouse = 'WH01';
        let customer = $(ClientId).attr('sid');
        let user = 'emiza'
    
        let header = {
            opnfor: '130200',
            activity: 'AX-01', // Create PO
            transaction: $(GEInvNo).attr('sid'),
            warehouse: warehouse,
            customer: customer,
            user: user
        }
        getPrcessStageDetails(sUrl,header, setStageDetails);
    }
    else if(act_id == CONSTANTS.ACTIVITY_AX_02){
        //  Associate PO
        let customer = $(ClientId).attr('sid');
        let user = 'emiza';
        // let SelectedPOArray = [] // Selected PO IDs to Associate PO aka to update the Ref number in PO header.
        // let wherePOs = "ID IN (";
        let wherePOs = "";
        let checkboxes = document.querySelectorAll('input[type=checkbox]:checked') 
        for (let i = 0; i < checkboxes.length; i++) { // Looping on all the checkbox who are selected/checked.
            // SelectedPOArray.push(checkboxes[i].value) // Pushing into Array
            // if(wherePOs){
            //     wherePOs = wherePOs + "|";
            // }
            wherePOs += checkboxes[i].value + ",";
        }

        if(wherePOs){
            // for(i=0; i < SelectedPOArray.length; i++){
            //         wherePOs += "'" + SelectedPOArray[i] + "',"
            //     }
            // wherePOs = wherePOs.replace(/,\s*$/, "");
            // wherePOs += ")"

            let header = {
                opnfor: '130200',
                activity: act_id,
                transaction: $(GEInvNo).attr('sid'),
                warehouse: warehouse,
                customer: customer,
                user:user,
                where: wherePOs   // PO no's
            }
            getPrcessStageDetails(sUrl,header, setStageDetails);
        }

        if(wherePOs){
            showAlerts(1, "Purchase Order(s) successfully Associated");
            
        }else{
            showAlerts(0, "Please select the Purchase Order(s) to Associate or Create New Purchase Order");
            
        }
    }
}

// Receiving Pending (Auto PO)
function f_130300(act_id){
    if(act_id == CONSTANTS.ACTIVITY_01){
        oldBarcode_130300 = "";
        poNo_130300 = "";
        backToDashboard();
    }else if(act_id == CONSTANTS.ACTIVITY_02){
        fun_130300_boxDetailsCompleted() 
    }else if(act_id == CONSTANTS.ACTIVITY_AX_01){
        oldBarcode_130300 = "";
        poNo_130300 = "";
        let customer = $(ClientId).attr('sid');
        let user = 'emiza';
        let header = {
            opnfor: '130300',
            activity: act_id,
            transaction: $(InvoiceId).attr('sid'),
            warehouse: warehouse,
            customer: customer,
            user:user
        }
        getPrcessStageDetails(sUrl,header, setStageDetails);
    }

}

// Receiving Pending (Existing PO)
function f_130350(act_id){
    if(act_id == CONSTANTS.ACTIVITY_01){
        oldBarcode_130350 = "";
        poNo_130350 = "";
        backToDashboard();
    }else if(act_id == CONSTANTS.ACTIVITY_02){
        fun_130350_boxDetailsCompleted()
    }

}

// GRN Pending
function f_130395(act_id){
    if(act_id == CONSTANTS.ACTIVITY_01){
        backToDashboard();
    }else if(act_id == CONSTANTS.ACTIVITY_02){
        let customer = $(ClientId).attr('sid');
        let user = 'emiza';
        let txnNo = $(GEInvNo).attr('sid');
        let poNo = $(".poInner").attr("id");
        
        let header = {
            opnfor: "130395",
            activity: "A-V",
            transaction: txnNo, 
            warehouse: warehouse,
            customer: customer,
            user: user,
            where:poNo
        }
        getPrcessStageDetails(sUrl,header, setStageDetails);
    }
}
// Putaway pending

function f_130396(act_id){
    if(act_id == CONSTANTS.ACTIVITY_01){
        oldBarcode_130350 = "";
        poNo_130396 = "";
        backToDashboard();
    }
    // else if(act_id == CONSTANTS.ACTIVITY_02){
    //     fun_130350_boxDetailsCompleted()
    // }

}


// GRN after putaway

function f_130399(act_id){
    if(act_id == CONSTANTS.ACTIVITY_01){
        backToDashboard();
    }else if(act_id == CONSTANTS.ACTIVITY_AX_01){
        // Send Email, GRN after putaway complete
        let txnNo = $(RelHeaderId).attr('sid');
        let warehouse = 'WH01';
        let customer = $(ClientId).attr('sid');
        let user = 'emiza'
        
        document.getElementById("spaceRemove").remove(); // To remove extra </br>'s

        let comment = document.getElementById("textAdditionalComment").value; // Getting the Additional comment value

        if(!comment){ // If no value in Additional comment, remove the specific Div
            document.getElementById("additionalComment").remove();
        }else{ // If there's value add the comment to the email
            document.getElementById("additionalComment").innerHTML  = comment
            document.getElementById("additionalComment").style.display = "block";
        }
        
        document.getElementById("textAdditionalComment").remove(); // Remove the Text-Area even if the comment is present or not

        let emailBody = document.getElementById('grnFinalMail').innerHTML; // get the email body which needs to send

        // As it's String and we have to pass this body to JSON we need to make this email body in single quotes(') 
        let finalBody = emailBody.replace(/"/g, "'");

        // Making of final email, concat the email body and the style/css into the emailFinal
        emailFinal = "<html><head><style>.grnTable { font-family:arial,sans-serif; border-collapse:collapse; width:62%; } .grnLineTable { font-family:arial,sans-serif; border-collapse:collapse; width:100%; } .grnEmailHeader { border:1px solid darkgrey; text-align:center; padding:5px; background:#d5d5d5 } .grnEmailLine{ border:1px solid darkgrey; text-align:center; padding:5px }</style></head><body>" + finalBody + "</body></html>"

        let header = {
            opnfor: '130400',
            activity: 'AX-01',
            transaction: txnNo, 
            where:emailFinal,
            warehouse: warehouse,
            customer: customer,
            user: user
        }
        getPrcessStageDetails(sUrl,header, setStageDetails);
    }
}

// GRN  
function f_130400(act_id){
    if(act_id == CONSTANTS.ACTIVITY_01){
        backToDashboard();
    }else if(act_id == CONSTANTS.ACTIVITY_AX_01){
        // Send Email, GRN 1 Completed
        let txnNo = $(RelHeaderId).attr('sid');
        let warehouse = 'WH01';
        let customer = $(ClientId).attr('sid');
        let user = 'emiza'
        
        document.getElementById("spaceRemove").remove(); // To remove extra </br>'s

        let comment = document.getElementById("textAdditionalComment").value; // Getting the Additional comment value

        if(!comment){ // If no value in Additional comment, remove the specific Div
            document.getElementById("additionalComment").remove();
        }else{ // If there's value add the comment to the email
            document.getElementById("additionalComment").innerHTML  = comment
            document.getElementById("additionalComment").style.display = "block";
        }
        
        document.getElementById("textAdditionalComment").remove(); // Remove the Text-Area even if the comment is present or not

        let emailBody = document.getElementById('grnFinalMail').innerHTML; // get the email body which needs to send

        // As it's String and we have to pass this body to JSON we need to make this email body in single quotes(') 
        let finalBody = emailBody.replace(/"/g, "'");

        // Making of final email, concat the email body and the style/css into the emailFinal
        emailFinal = "<html><head><style>.grnTable { font-family:arial,sans-serif; border-collapse:collapse; width:62%; } .grnLineTable { font-family:arial,sans-serif; border-collapse:collapse; width:100%; } .grnEmailHeader { border:1px solid darkgrey; text-align:center; padding:5px; background:#d5d5d5 } .grnEmailLine{ border:1px solid darkgrey; text-align:center; padding:5px }</style></head><body>" + finalBody + "</body></html>"

        let header = {
            opnfor: '130400',
            activity: 'AX-01',
            transaction: txnNo, 
            where:emailFinal,
            warehouse: warehouse,
            customer: customer,
            user: user
        }
        getPrcessStageDetails(sUrl,header, setStageDetails);
    }
}

// To change the Selected PO background color and to remove the effect of previous Selected PO

function fun_130200_BChange(eId){
	
	if(document.getElementById('B-'+eId).checked){  // Check if it's selected
   	 	document.getElementById(eId).style.backgroundColor = "LightYellow"; // Selected PO color	
    }

	if(document.getElementById('B-'+eId).checked == false){  // Check if it's not selected 
   	 	document.getElementById(eId).style.backgroundColor = "white"; // Selected PO color
    }
}

// Receiving Pending (Auto PO)

function fun_130300_searchBox(searchedBarcode){
    let warehouse = 'WH01';
    let customer = $(ClientId).attr('sid');
    let user = 'emiza';
    // var oldBarcode_130300;
    // var poRecNo_130300;

	if(oldBarcode_130300 != ""){
		document.getElementById(oldBarcode_130300).classList.remove('selectedBarcode')
	}

	if(searchedBarcode){
		searchedBarcode = searchedBarcode.toUpperCase();
		if(document.getElementById(searchedBarcode) != null){
			document.getElementById(searchedBarcode).className = 'stickerDiv selectedBarcode' // Adding the current class with selectedBarcode class
			location.hash = '#' + searchedBarcode;
			oldBarcode_130300 = searchedBarcode
		}else{
			if(oldBarcode_130300 != ""){
				document.getElementById(oldBarcode_130300).classList.remove('selectedBarcode')
			}
		}

		poNo_130300 = $(ID).attr('sid');

		let header = {
			opnfor: '130300',  
			activity: CONSTANTS.ACTIVITY_01,
			transaction: searchedBarcode, // Searched barcode
			where: $(InvoiceId).attr('sid'), // GateInInvoiceRec No aka cno,
			fieldArray: poNo_130300,
			warehouse: warehouse,
			customer: customer,
            user: user
		}
        getPrcessStageDetails(sUrl,header, setStageDetails);
        history.pushState(null, null, ' ') // Remove the barcode from the URL
	}

	document.getElementById('scanBarcodetxt').value = ''
}


function fun_130300_boxDetailsCompleted(){

	if(document.getElementById(oldBarcode_130300) != null){
		document.getElementById(oldBarcode_130300).classList.remove('selectedBarcode');

        let warehouse = 'WH01';
        let customer = $(ClientId).attr('sid');
        let txnNo = $(InvoiceId).attr('sid') 

        let header = {
            opnfor: "130300", 
            activity:"A-V",
            transaction: txnNo, 
            warehouse: warehouse,
            customer: customer,

        }
        getPrcessStageDetails(sUrl,header, setStageDetails);
		showAlerts(1, "Selected Box Receiving completed");
        oldBarcode_130300 = "";
	}else{
		showAlerts(0, "Please Scan/Select the Barcode");
	}
}

// Receiving Pending (Existing PO)
function fun_130350_searchBox(searchedBarcode){
    let warehouse = 'WH01';
    let customer = $(ClientId).attr('sid');
    // let oldBarcode_130350;
    // let poRecNo_130350;

	if(oldBarcode_130350 != ""){
		document.getElementById(oldBarcode_130350).classList.remove('selectedBarcode')
	}

	if(searchedBarcode){
		searchedBarcode = searchedBarcode.toUpperCase();
		if(document.getElementById(searchedBarcode) != null){
			document.getElementById(searchedBarcode).className = 'stickerDiv selectedBarcode' // Adding the current class with selectedBarcode class
			location.hash = '#' + searchedBarcode;
			oldBarcode_130350 = searchedBarcode
		}else{
			if(oldBarcode_130350 != ""){
				document.getElementById(oldBarcode_130350).classList.remove('selectedBarcode')
			}
		}

		poRecNo_130350 = $(ID).attr('sid');

		var header = {
			opnfor: current_stage,  
			activity: CONSTANTS.ACTIVITY_01,
			transaction: searchedBarcode, // Searched barcode
			where: $(InvoiceId).attr('sid'), // GateInInvoiceRec No aka cno,
			fieldArray: poRecNo_130350,
			warehouse: warehouse,
			customer: customer,
            user: user
		}
		
		getPrcessStageDetails(sUrl,header, setStageDetails);
        history.pushState(null, null, ' ') // Remove the barcode from the URL
	}

	document.getElementById('scanBarcodetxt').value = ''
}

// Receiving Pending (Existing PO)
function fun_130350_boxDetailsCompleted(){

	if(document.getElementById(oldBarcode_130350) != null){
        let customer = $(ClientId).attr('sid');
        let user = 'emiza';

		document.getElementById(oldBarcode_130350).classList.remove('selectedBarcode');
        let header = {
            opnfor: current_stage, 
            activity:"A-V",
            transaction: txnNo, 
            warehouse: warehouse,
            customer: customer
        }
        getPrcessStageDetails(sUrl,header, setStageDetails);
		showAlerts(1, "Selected Box Receiving completed");
        oldBarcode_130350 = "";
	}else{
		showAlerts(0, "Please Scan/Select the Barcode");
	}

}


