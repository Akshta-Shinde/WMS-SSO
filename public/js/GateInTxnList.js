var sUrl = "https://hjv36v7vgd.execute-api.ap-south-1.amazonaws.com/dev/iks/operations";
var selectedDate;
var btn_header_edit = '<button type= "button" class="edit-btn" style="float:right;" onclick="editHeader();" title="Click To Edit"><i class="fas fa-pen"></i></button>';
var btn_edit_check = '<button type= "button" class="save-btn" onclick="update()" title="Click To Save"><i class="fa fa-check"></i></button>';
var btn_edit_cancel = '<button type= "button" class="cancel-btn" onclick="editCancel();" title="Click To Cancel"><i class="fa fa-times"></i></button>';

$.when($.ready).then(function () {
    // getTodayDate();
    // getTxnList();
    getLayout();
});

function getLayout(){
    var header = {
		opnfor: 110000,
		activity: "A-V",
		warehouse: "WH01"
	}

	getPrcessStageDetails(sUrl, header, getTxnLines);
}

function getTxnLines(result){
    getTodayDate();
    getTxnList();
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
    console.log(today);
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
    selectedDate = $('#txnDate').val();
    var header = {
		opnfor: 110000,
		activity: "A-01",
		transaction: selectedDate,
		warehouse: "WH01",
		customer: "1",
	}

	getPrcessStageDetails(sUrl, header, setLines);
}

function setLines(result){
    tbl_data_mdm = result;
	result = result.body;

	for (const key in result) {
		var elementId = "display" + key;
		$("#" + elementId).html(result[key]);
	}
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

function createNewGateIn(){
    // getTxnMeta();
    var header = {
		opnfor: 110100,
		// tableNo: "2", 
		activity: "A-V",
		warehouse: "WH01"
	}
	getPrcessStageDetails(sUrl, header, editGEHeader);
}

function editHeader(){
    $('#displayHeader input').attr('readonly', false);
    $('#displayHeader select').attr('disabled', false);
    $("#actions").html(btn_edit_check + btn_edit_cancel);
	var jObj = tbl_data_mdm;

	for (i = 0; i < jObj.body.headerMeta.length; i++) {
		var mR = jObj.body.headerMeta[i].mR;
        var mRVal = mR.split("|");
		var mField = mRVal[1];
		var cKey = mRVal[6];
		if (cKey == 'UK' || cKey == 'LK') {
			$('#' + mField).attr('readonly', true);
		}
		else if (mRVal[6] != '' && mRVal[9] != '') {
			if($('#' + mField)[0]){
				var defaulSelected = $('#' + mField)[0].attributes[1].value;
				var e = $('#' + mField)[0];
				getDropDownList(defaulSelected, mRVal[0], e, mField, 2, 0, mRVal[9]);
			}
		}
	}
}

function editGEHeader(result){
	// $("#actions").html(btn_cancel + btn_check);
	$("#displayTitle").html(result.body.Title);
	$("#displayActivities").html(result.body.Activities);
	txnNo = "WH01-CUST01-" + getDateTime();
	$('#RecordNo').attr('value',txnNo);
	
	tbl_data_mdm = result;
	var jObj = tbl_data_mdm;

	for (i = 0; i < jObj.body.headerMeta.length; i++) {
		var mR = jObj.body.headerMeta[i].mR;
        var mRVal = mR.split("|");
		var mField = mRVal[1];
		var cKey = mRVal[6];
		if (cKey == 'UK' || cKey == 'LK') {
			$('#' + mField).attr('readonly', true);
		}
		else if (mRVal[6] != '' && mRVal[9] != '') {
			// console.log($('#' + mField)[0]);
			if($('#' + mField)[0]){
				var defaulSelected = $('#' + mField)[0].attributes[1].value;
				var e = $('#' + mField)[0];
				getDropDownList(defaulSelected, mRVal[0], e, mField, 2, 0, mRVal[9]);
			}
		}
	}
}

function save(){
	var fName = [];
	var fVal = [];
	var jObj = tbl_data_mdm;
	var isLK = false;

	for (i = 0; i < jObj.body.headerMeta.length; i++) {
		var mR = jObj.body.headerMeta[i].mR;
		var mRVal = mR.split("|");
		var mField = mRVal[1];
		var ctype = mRVal[4];
		var cKey = mRVal[6];
		var cvisible = mRVal[11];
		var field_visible = true;

		if (mRVal[6] == 'UK') {
			var cName = mField;
			var cVal = $('#' + mField).attr('value');
			fName.push(cName);
			fVal.push(cVal);
		}
		if (cKey == 'UK' || cKey == 'LK') {
			field_visible = false;
			if (cvisible == '1') {
				field_visible = true;
			}
		} else {
			if (cvisible == '-1') {
				field_visible = false;
			}
		}
		if (field_visible) {
			var cName = mField;
			if (mRVal[6] == '' && mRVal[9] == '') {
				var cVal = $('#' + mField).val();
				if(cVal){
					fName.push(cName);
					fVal.push(cVal);
				}
			}else{
				var cVal = $('select#' + mField).find('option:selected').val();
				if(cVal){
					dVal = cVal;
					fName.push(cName);
					fVal.push(cVal);
				}
			}
		}else {
			isLK = true;
		}
	}

	fName.push('CorporateID','WarehouseID','CreatedBy');
	fVal.push('1','WH01','emiza');
	fVal = "'"+fVal.join("','")+"'";

	console.log(fName);
	console.log(fVal);

	$.ajax({
			url: sUrl,
			type: 'GET',
			headers: { opnfor: 4, tableNo: "2", where: fName, fieldArray: fVal },
			contentType: 'application/json',
			success: function (result) {
				showAlerts(1, "New Record added successfully");
				getGEHeader(txnNo);
			},
			error: function (result, statusTxt, xhr) {
				// alert("Error: " + xhr.status + ": " + xhr.statusText);
			}
	});
}

function getGEHeader(txnNo){
	var cust = $('select#ClientID').find('option:selected').val();
	var header = {
		opnfor: 110100, 
		tableNo: "2",  
		activity: "A-VH",
		transaction: txnNo, 
		warehouse: "WH01",
		customer: cust
	}
	getPrcessStageDetails(sUrl, header, setGEHeader);
}

function setGEHeader(result){
	$("#displayHeader").html(result.body.Header);
	$("#actions").html(btn_header_edit);
	readonlyForm();
}

function cancel(){
	document.getElementById("displayHeader").reset();
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

function readonlyForm(){
	$('#displayHeader input').attr('readonly', true);
	$('#displayHeader select').attr('disabled', true);
}

function backToDashboard(){
    getLayout();
 }

 function update(){
	var fa = [];
	var jObj = tbl_data_mdm;
	var kVal;
	var tKey = '';
	var tVer = '';
	var isDropdown = false;
	var user = 'emiza';

	for (i = 0; i < jObj.body.headerMeta.length; i++) {
		var isDropdown = false;
		var mR = jObj.body.headerMeta[i].mR;
		var mRVal = mR.split("|");
		var mField = mRVal[1];
		var cKey = mRVal[6];
		var ctype = mRVal[4];
		var field_visible = true;
		var cvisible = mRVal[11];
		var dVal = '';
		var cVal = '';

		if (cKey == 'UK' || cKey == 'LK') {
			field_visible = false;
			if (cvisible == '1') {
				field_visible = true;
			}
		} else {
			if (cvisible == '-1') {
				field_visible = false;
			}
		}

		if (field_visible) {
			var fName = mField;
			if (mRVal[6] == '' && mRVal[9] == '') {
				if(ctype == 'timestamp'){
					// STR_TO_DATE('11-Jun-2022 11:50', '%d-%b-%Y %H:%i:%s')
					var cVal = "STR_TO_DATE('" + document.getElementById(mField).value + "', '%d-%b-%Y %H:%i:%s')";	
					fa.push(
						fName + "=" + cVal
					)
				}else{
					var cVal = document.getElementById(mField).value;
					fa.push(
						fName + "='" + cVal + "'"
					)
				}
			}else{
				var cVal = $('select#' + mField).find('option:selected').val();
				if(cVal){
					dVal = cVal;
					fa.push(
						fName + "='" + cVal + "'"
					)
				}
			}
		}

		var islkpk = false;
		if (cKey == 'LK' || cKey == 'UK' || cKey == 'PK') {
			islkpk = true;
			kVal = cVal;
			if (!field_visible) {
				kVal = document.getElementById(mField).value;
			}
			if (isDropdown) {
				if (dVal != cVal) {
					kVal = dVal;
				}
			}
			tKey = mRVal[1];
		}

		if (islkpk) {
			if (tVer != "") {
				tVer = tVer + " AND " + tKey + "='" + kVal + "'";
			} else {
				tVer = tKey + "='" + kVal + "'";
			}
		}
	}

	fa.push(
		"ModifiedBy='" + user + "', ModifiedDate=now()"
	)

	var header = {
		opnfor: 3, 
		tableNo: "2", 
		where: tVer, 
		fieldArray: fa, 
	};

	getPrcessStageDetails(sUrl, header, getUpdatedHeader)
}

function getUpdatedHeader(){
	var cust = $('select#ClientID').find('option:selected').val();
	var header = {
		opnfor: 110100, 
		tableNo: "2",  
		activity: "A-VH",
		transaction: txnNo, 
		warehouse: "WH01",
		customer: cust
	}
	getPrcessStageDetails(sUrl, header, setGEHeader);
}