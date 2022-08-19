var sUrl = "https://hjv36v7vgd.execute-api.ap-south-1.amazonaws.com/dev/iks/operations";
// var btn_add_invoice = '<button type="button" class="btn btn-success" onclick="addF()" title="Click To Add"><i class="fa fa-plus"></i>&nbsp&nbsp Add Invoice</button>';
// var btn_cancel = '<button type= "button" style="font-size:20px;border:none;background-color: transparent;color:red;" onclick="cancelUpdate();" title="Click To Cancel"><i class="fa fa-times"></i></button>';
var btn_cancel = '<button type= "button" style="font-size:40px;border:none;background-color: transparent;color:red;" onclick="cancelAdd();" title="Click To Cancel"><i class="fa fa-times"></i></button>';

var btn_update = '<button type= "button" style="font-size:20px;border:none;background-color: transparent;color:green;" onclick="updateF();" title="Click To Update"><i class="fa fa-check"></i></button>';
var btn_save = '<button type= "button" style="font-size:20px;border:none;background-color: transparent;color:green;" onclick="insertF({tbl_no}, {d_index});" title="Click To Save"><i class="fa fa-check"></i></button>';
var btn_cancelAdd = '<button type= "button" style="font-size:20px;border:none;background-color: transparent;color:red;" onclick="cancelAdd();" title="Click To Cancel"><i class="fa fa-times"></i></button>';
var btn_edit = '<button type= "button" style="font-size:20px;border:none;background-color: transparent;color:#1E90FF;" onclick="editHeader({tbl_no}, {d_index});" title="Click To Edit"><i class="fas fa-pen"></i></button>';
var btn_check = '<button type= "button" style="font-size:40px;border:none;background-color: transparent;color:green;" onclick="updateF({tbl_no})" title="Click To Check"><i class="fa fa-check"></i></button>';

var insertMode = false;
var formData = [];
var inEditMode = false;
var str_dropdown;

var tbl_body = '<tr id="R{Row-ID}">{B-COLS}</tr>';
var tbl_body_col = '<td class="tLine" style="width:{COL-WIDTH}px;text-align:{COL-ALIGN};">{B-COL-VALUE}</td>';
var dropdown = '<option value="{OPTION-ID}" {SELECTED}>{OPTION-LIST}</option>';
var dropdown_css = '<option class="option-class" value="{OPTION-ID}" {SELECTED}>{OPTION-LIST}</option>';
var dropdownOptions = 
[
	'<option class="option-class" value="{OPTION-ID}" {SELECTED}>{OPTION-LIST}</option>', 
	'<option value="{OPTION-ID}" {SELECTED}>{OPTION-LIST}</option>'
]
var newRow;
var row;
var current_stage;

var iTxt = '<input type="text" name="{NAME}" value="{VALUE}" placeholder="{PLACEHOLDER}" pattern = "[A-Za-z\s]*$" style="width: 95%" {REQUIRED} {READONLY}/>';
var iInt = '<input type="number" name="{NAME}" value="{VALUE}" placeholder="{PLACEHOLDER}" min ="1" style="width: 95%;" {REQUIRED} />';
var iDec = '<input type="number" name="{NAME}" value="{VALUE}" step="0.01" placeholder="{PLACEHOLDER}" min ="0" style="width: 95%;" {REQUIRED} />';
var iDate = '<input type="datetime" name="{NAME}" value="{VALUE}" placeholder="{PLACEHOLDER}" style="width: 95%" {REQUIRED} />';
var txnNo;

// ReceiveConsolidateInvoice variables 
var oldBarcode;
var poRecNo;

function addF(tbl_no, optionIndex) {
	insertMode = true;
	var jObj = tbl_data_mdm;
	var newTd;
	var firstTr = $("#tbl_form tbody").prepend(tbl_body).children('tr:first');
	
	for (i = 0; i <  jObj.body.lineMeta.length; i++) {
		var mR = jObj.body.lineMeta[i].mR;
		var mRVal = mR.split("|");
		var metaWidth = mRVal[8];
		var cKey = mRVal[6];
		var cVisible = mRVal[11];

		if (cKey == 'LK') {
			newTd = " ";
		} 
		if (cKey == 'UK' && cVisible == 'N') {
			newTd = " ";
		} 
		// if(cVisible == 'N'){
		// 	newTd = " ";	
		// }
		else {
			newTd = tbl_body_col.replace("{COL-WIDTH}", metaWidth).replace("{B-COL-VALUE}", "");
		}
		firstTr.append(newTd);
	}

	btn_save = btn_save.replace('{tbl_no}', tbl_no).replace('{d_index}', optionIndex);
	firstTr.append(tbl_body_col.replace("{COL-WIDTH}", "100").replace("{B-COL-VALUE}", btn_save + "  " + btn_cancelAdd));
	newRow = firstTr[0];
	editCell(firstTr[0], tbl_data_mdm, tbl_no, optionIndex);
}

function editCell(e, tbl_data, tbl_no, optionIndex) {
    var tbl_col = 0;
    row = e;
    formData = [];
    inEditMode = true;  
    var jObj = tbl_data;
    for (i = 0; i < jObj.body.lineMeta.length; i++) {
        var mR = jObj.body.lineMeta[i].mR;
        var mRVal = mR.split("|");
        var mType = mRVal[4];
        var mField = mRVal[1];
        var mNull = mRVal[3];
        var mPH = mRVal[7];
        var htmlFF;
		if($(e).children()[i]){
			formData.push($(e).children()[i]);
		}
        // tbl_col = i;
        var cvisible = mRVal[11];
        var cKey = mRVal[6];
        var field_visible = true;

        if (cKey == 'UK' || cKey == 'LK') {
            field_visible = false;
            if (cvisible == 'Y') {
                field_visible = true;
            }
        } else {
            if (cvisible == 'N') {
                field_visible = false;
            }
        }
        // if (cKey == 'UK' || cKey == 'LK' || cvisible == '0') {
        // console.log($(e).children()[tbl_col]);
        // console.log(field_visible);
        if (field_visible) {
            // if (cKey != 'LK' && cKey != 'UK') {
            var strv = $(e).children()[tbl_col].innerHTML;
            if (mRVal[6] != '' && mRVal[9] != '') {
                getDropDownList(strv, mRVal[0], $(e).children()[tbl_col], mField, tbl_no, optionIndex, mRVal[9]);
            } else {
                if (mType == 'text' || mType == 'longtext') {
                    htmlFF = iTA.replace("{NAME}", mField).replace("{VALUE}", strv).replace("{PLACEHOLDER}", mPH);
                    if (mNull == 'N') {
                        htmlFF = htmlFF.replace("{REQUIRED}", "required");
                    }
                } else if (mType == 'varchar') {
                    htmlFF = iTxt.replace("{NAME}", mField).replace("{VALUE}", strv).replace("{PLACEHOLDER}", mPH);
                    // console.log(htmlFF);
                    if (mNull == 'N') {
                        htmlFF = htmlFF.replace("{REQUIRED}", "required");
                    }
                }
                else if (mType == 'smallint' || mType == 'tinyint' || mType == 'year' || mType == 'int') {
                    htmlFF = iInt.replace("{NAME}", mField).replace("{VALUE}", parseInt(strv)).replace("{PLACEHOLDER}", mPH);
                    if (mNull == 'N') {
                        htmlFF = htmlFF.replace("{REQUIRED}", "required");
                    }
                }
                else if (mType == 'decimal') {
                    htmlFF = iDec.replace("{NAME}", mField).replace("{VALUE}", strv).replace("{PLACEHOLDER}", mPH);
                    if (mNull == 'N') {
                        htmlFF = htmlFF.replace("{REQUIRED}", "required");
                    }
                }
                else if (mType == 'datetime') {
                    htmlFF = iDate.replace("{NAME}", mField).replace("{VALUE}", strv).replace("{PLACEHOLDER}", mPH);
                    if (mNull = 'N') {
                        htmlFF = htmlFF.replace("{REQUIRED}", "required");
                    }
                }
                $(e).children()[tbl_col].innerHTML = htmlFF;
            }
            tbl_col++;
        }
    }
    if (insertMode == false) {
        $(e).children()[tbl_col].innerHTML = tbl_body_col.replace("{B-COL-VALUE}", btn_cancel + " " + btn_update).replace("{COL-WIDTH}", 100);
    }
}


function editHeader(tbl_no, optionIndex){
    $('#displayHeader input').attr('readonly', false);
    $('#displayHeader select').attr('disabled', false);
	btn_check = btn_check.replace('{tbl_no}', tbl_no);
    $("#actions").html(btn_check + btn_cancel);
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
				getDropDownList(defaulSelected, mRVal[0], e, mField, 2, optionIndex, mRVal[9]);
			}
		}
	}
}


function getDropDownList(cellText, cellIndex, e, mf, tbl_no, optionIndex, fk_sql){
	var strdd = '';
    var fdd;
    var oldValue;
	var wh = "WH01";
	var cust =  "A";
    $.ajax(
        {
            url: sUrl,
            type: 'GET',
            headers: { opnfor: 2, tableNo: tbl_no, where: cellIndex, warehouse: wh, customer: cust, fieldArray: fk_sql},
            contentType: 'application/json',
            success: function (result) {
                for (i = 0; i < result.body.rData.length; i++) {
                    var c = result.body.rData[i].c;
                    var mRVal = c.split("|");
                    var tdd = dropdownOptions[optionIndex].replace("{OPTION-ID}", mRVal[0]).replace("{OPTION-LIST}", mRVal[1]);
                    var seltxt;
                    if (mRVal[1] == cellText) {
                        seltxt = 'selected';
                        oldValue = mRVal[1];
                    } else {
                        seltxt = ' ';
                    }
                    tdd = tdd.replace("{SELECTED}", seltxt);
                    strdd += tdd;
                }
				if(optionIndex == '0'){
					fdd = "<select class='form-control' id='" + mf + "' name='" + mf + "'>" + strdd + "</select>";
				}else if(optionIndex = '1'){
					fdd = "<select id='" + mf + "' name='" + mf + "'>" + strdd + "</select>";
				}
				str_dropdown = fdd;
                e.innerHTML = str_dropdown;
            },
            error: function (result, statusTxt, xhr) {
                // alert("Error: " + xhr.status + ": " + xhr.statusText);
            }
        });
}


function insertF(tbl_no, optionIndex) {
	insertMode = false;
	inEditMode = false;
	var fName = [];
	var fVal = [];
	var TRinner = '';
	var jObj = tbl_data_mdm;
	var isLK = false;
	var tbl_col = 0;

	for (i = 0; i < jObj.body.lineMeta.length; i++) {
		var mR = jObj.body.lineMeta[i].mR;
		var mRVal = mR.split("|");
		var cwidth = mRVal[8];
		var newTD = '';
		var cvisible = mRVal[11];
		var cKey = mRVal[6];
		var field_visible = true;
		var canBenull = mRVal[3];

		if (mRVal[6] == 'UK') {
			cVal = '{UUID}';
		}

		if (cvisible == 'N') {
			if(canBenull == 'N'){
				fName.push(mRVal[1]);
				fVal.push(mRVal[2]);
			}
			
			field_visible = false;	
		}

		// if (mRVal[6] != 'LK' && mRVal[6] != 'UK') {
		if (cKey == 'UK' || cKey == 'LK') {
			field_visible = false;
			if (cvisible == 'Y') {
				field_visible = true;
			}
		} 
		// else {
		// 	if (cvisible == 'N') {
		// 		if(canBenull == 'N'){
		// 			fName.push(mRVal[1]);
		// 			fVal.push(mRVal[2]);
		// 		}
				
		// 		field_visible = false;	
		// 	}
		// }
		// if (cvisible == 'N') {
		// 	if(canBenull == 'N'){
		// 		fName.push(mRVal[1]);
		// 		fVal.push(mRVal[2]);
		// 	}
			
		// 	field_visible = false;	
		// }

		if(cvisible == 'N'){
			field_visible = false;
		}

		if (field_visible) {
			var Ftype = $(formData).children()[tbl_col].type;
			var cVal = $(formData).children()[tbl_col].value;
			var cName = $(formData).children()[tbl_col].name;

			isLK = false;
			fName.push(cName);
			fVal.push(cVal);

			if (Ftype == 'text' || Ftype == 'number' || Ftype == 'textarea') {
				newTD = tbl_body_col.replace("{B-COL-VALUE}", cVal).replace("{COL-WIDTH}", cwidth);
			} else if (Ftype == 'select-one' || Ftype == 'select-multiple' || Ftype == 'select') {
				// var selops = $(formData).children()[i];
				var selops = $(formData).children()[tbl_col];
				var ValTxt = $(selops).children("option:selected").text();
				newTD = tbl_body_col.replace("{B-COL-VALUE}", ValTxt).replace("{COL-WIDTH}", cwidth);
			}
			TRinner = TRinner + newTD;
			tbl_col++;
		} else {
			isLK = true;
		}
	}

	btn_edit = btn_edit.replace('{tbl_no}', tbl_no).replace('{d_index}', optionIndex);

	newTD = tbl_body_col.replace("{B-COL-VALUE}", btn_edit).replace("{COL-WIDTH}", 100);
	TRinner = TRinner + newTD;

	fName = JSON.stringify(fName);
	fName = fName.replace(/"/g, '').replace(/[\[\]']+/g, '');
	fVal = JSON.stringify(fVal);
	fVal = fVal.replace(/"/g, "'").replace(/[\[\]]+/g, '');
	fName = fName + ",CreatedBy";
	fVal = fVal + ",'SystemUser" + "'";

	// console.log('fName: ',fName);
	// console.log('fVal:',fVal);

	$.ajax(
		{
			url: sUrl,
			type: 'GET',
			headers: { opnfor: 4, tableNo: tbl_no, where: fName, fieldArray: fVal  },
			contentType: 'application/json',
			success: function (result) {
				var rst = displayResult(result);
				if (rst) {
					TRinner = TRinner.replace("{UUID}", result.body.ri).replace("{B-COL-VALUE}", result.body.ri);
					$(newRow).attr("id", "R" + result.body.ri);
					newRow.innerHTML = TRinner;
					showAlerts(1, "New Record added successfully");
				} else {
					$(newRow).remove();
					showAlerts(0, "Unable To Add Record");
				}
			},
			error: function (result, statusTxt, xhr) {
				// alert("Error: " + xhr.status + ": " + xhr.statusText);
			}
		}
    );
}

// function updateF() {
// 	// eid = nodelist[0].empID;
// 	inEditMode = false;
// 	var fa = [];
// 	var tVer = '';
// 	var jObj = tbl_data_mdm;
// 	var tKey = '';
// 	var TRinner = '';
// 	var kVal;
// 	var newTD;
// 	var tbl_col = 0;
// 	rowID = rowID.replace('R', '');
// 	var isDropdown = false;

// 	for (i = 0; i < jObj.body.meta.length; i++) {
// 		isDropdown = false;
// 		var mR = jObj.body.meta[i].mR;
// 		var mRVal = mR.split("|");
// 		var cwidth = mRVal[8];
// 		var dVal = '';
// 		var cVal = '';
// 		var ValTxt = '';
// 		var cvisible = mRVal[11];
// 		var cKey = mRVal[6];
// 		var field_visible = true;
// 		// tbl_col = i;
// 		if (cKey == 'UK' || cKey == 'LK') {
// 			field_visible = false;
// 			if (cvisible == '1') {
// 				field_visible = true;
// 			}
// 		} else {
// 			if (cvisible == '-1') {
// 				field_visible = false;
// 			}
// 		}
// 		if (field_visible) {
// 			// if (mRVal[6] != 'LK' && mRVal[6] != 'UK') {
// 			var fName = $(formData).children()[tbl_col].name
// 			var Ftype = $(formData).children()[tbl_col].type;
// 			if (Ftype == 'text' || Ftype == 'number' || Ftype == 'textarea') {
// 				dVal = $(formData).children()[tbl_col].defaultValue;
// 				cVal = $(formData).children()[tbl_col].value;
// 				newTD = tbl_body_col.replace("{B-COL-VALUE}", cVal).replace("{COL-WIDTH}", cwidth);
// 			} else if (Ftype == 'select-one' || Ftype == 'select-multiple' || Ftype == 'select') {
// 				isDropdown = true;
// 				var selops = $(formData).children()[tbl_col];
// 				dVal = $(selops).attr('oldVal');
// 				cVal = $(formData).children()[tbl_col].value;
// 				ValTxt = $(selops).children("option:selected").text();
// 				newTD = tbl_body_col.replace("{B-COL-VALUE}", ValTxt).replace("{COL-WIDTH}", cwidth);
// 			}
// 			fa.push(
// 				fName + "='" + cVal + "'"
// 			)
// 			TRinner = TRinner + newTD;
// 			tbl_col++;
// 		}

// 		var islkpk = false;
// 		if (cKey == 'LK' || cKey == 'UK' || cKey == 'PK') {
// 			islkpk = true;
// 			kVal = cVal;
// 			if (!field_visible) {
// 				kVal = rowID;
// 			}
// 			if (isDropdown) {
// 				if (dVal != cVal) {
// 					kVal = dVal;
// 				}
// 			}

// 			// kVal = rowID;

// 			tKey = mRVal[1];
// 		}
// 		// else if (cKey == 'PK') {
// 		// 	islkpk = true;
// 		// 	kVal = dVal;
// 		// 	tKey = mRVal[1];
// 		// }
// 		if (islkpk) {
// 			if (tVer != "") {
// 				tVer = tVer + " AND " + tKey + "='" + kVal + "'";
// 			} else {
// 				tVer = tKey + "='" + kVal + "'";
// 			}
// 		}
// 	}
// 	fa.push(
// 		"modified_by='" + eid + "'"
// 	)
// 	tVer = JSON.stringify(tVer);
// 	tVer = tVer.replace(/"/g, '').replace(/[\[\]]+/g, '');

// 	newTD = tbl_body_col.replace("{B-COL-VALUE}", btn_edit).replace("{COL-WIDTH}", 100);
// 	TRinner = TRinner + newTD;
// 	if (fa.length > 1) {
// 		$.ajax(
// 			{
// 				url: sUrl,
// 				type: 'GET',
// 				headers: { opnfor: 3, thisMatrix: $("#initableList").children("option:selected").val(), thisvertical: tVer, fieldArray: fa },
// 				contentType: 'application/json',
// 				success: function (result) {
// 					var rst = displayResult(result);
// 					if (rst) {
// 						editRow[0].innerHTML = TRinner;
// 						showAlerts(1, "Record Updated Successfully");
// 					} else {
// 						showAlerts(2, "Unable To Update Record");
// 					}
// 				},
// 				error: function (result, statusTxt, xhr) {
// 					alert("Error: " + xhr.status + ": " + xhr.statusText);
// 				}
// 			});
// 	}
// }


function updateF(tbl_no){
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
			// if (cvisible == 'Y') {
			// 	field_visible = true;
			// }
		} 
		else {
			if (cvisible == 'N') {
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
					// var cVal = $('#'+mField).value;
					// console.log(cVal);
					fa.push(
						fName + "='" + cVal + "'"
					)
				}
			}else{
				var cVal = $('select#' + mField).find('option:selected').val();
				dVal = cVal;
				fa.push(
					fName + "='" + cVal + "'"
				)
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

	$.ajax(
		{
			url: sUrl,
			type: 'GET',
			headers: { opnfor: 3, tableNo: tbl_no, where: tVer, fieldArray: fa },
			contentType: 'application/json',
			success: function (result) {
				var rst = displayResult(result);
				if (rst) {
					// TRinner = TRinner.replace("{UUID}", result.body.ri).replace("{B-COL-VALUE}", result.body.ri);
					// $(newRow).attr("id", "R" + result.body.ri);
					// newRow.innerHTML = TRinner;
					showAlerts(1, "Record updated successfully");
				} else {
					$(newRow).remove();
					showAlerts(0, "Unable To update Record");
				}
			},
			error: function (result, statusTxt, xhr) {
				alert("Error: " + xhr.status + ": " + xhr.statusText);
			}
		}
    );


}

function editLineItem(e){
	console.log(e);
}

function deleteLineItem(e){
	console.log(e);
}


// Function to remove new added line in edit mode
function cancelAdd() {
	insertMode = false;
	inEditMode = false;
	$(newRow).remove();
}

// function cancelUpdate() {
// 	inEditMode = false;
// 	editRow[0].innerHTML = editHTML;
// }


function displayResult(result) {
    // alert testing test123
    if (result.msg != "") {
        //alert(result.msg);
        console.log(result.tmsg);
        return false;
    } else {
        return true;
    }
}
