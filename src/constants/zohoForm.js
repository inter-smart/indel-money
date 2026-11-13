// Form component with Zoho iframe
// Form component with Zoho iframe
"use client";

export default function ContactForm({ isMobile = false }) {
  return (
    <div
      className={`${
        isMobile ? "w-full bg-[#17479e] lg:p-6" : "w-full lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl lg:w-[40%] bg-[#17479e] p-4 sm:p-6 md:p-8"
      } flex flex-col justify-start ${isMobile ? "min-h-[500px]" : "min-h-[600px] lg:min-h-0"}`}
    >
      <div className="max-w-md mx-auto w-full lg:max-w-none">
        {/* Zoho Form Integration */}
        <div
          id="crmWebToEntityForm"
          className="zcwf_lblLeft crmWebToEntityForm"
          style={{
            backgroundColor: "transparent",
            color: "white",
            maxWidth: "600px",
            border: "none",
            boxShadow: "none",
          }}
          dangerouslySetInnerHTML={{
            __html: `<!-- Note :
   - You can modify the font style and form style to suit your website. 
   - Code lines with comments Do not remove this code are required for the form to work properly, make sure that you do not remove these lines of code. 
   - The Mandatory check script can modified as to suit your business needs. 
   - It is important that you test the modified form before going live.-->
<div id = 'crmWebToEntityForm' class = 'zcwf_lblLeft crmWebToEntityForm' style = 'background-color: white;color: black;max-width: 600px;'>
    <meta name = 'viewport' content = 'width=device-width, initial-scale=1.0'>
        <META HTTP-EQUIV = 'content-type' CONTENT = 'text/html;charset=UTF-8'>
            <form id = 'webform241827000004943757' action = 'https://crm.zoho.in/crm/WebForm' name = WebForm241827000004943757 method = 'POST' onSubmit = 'javascript:document.charset="UTF-8"; return checkMandatory241827000004943757()' accept-charset = 'UTF-8'>
                <input type = 'text' style = 'display:none;' name = 'xnQsjsdp' value = '68da39d8f44f645c2ed7bb558b6d02894be148f864dc36334de6272c32ab12f2'>
                </input>
                <input type = 'hidden' name = 'zc_gad' id = 'zc_gad' value = ''>
                </input>
                <input type = 'text' style = 'display:none;' name = 'xmIwtLD' value = '1f2fa6ca4d96dbef6570882e255bd8bef495301fb8b704662d02ae9564e8ce9229c040f7002949ab8a8e8b42ffc972eb'>
                </input>
                <input type = 'text' style = 'display:none;' name = 'actionType' value = 'Q3VzdG9tTW9kdWxlOA=='>
                </input>
                <input type = 'text' style = 'display:none;' name = 'returnURL' value = 'https&#x3a;&#x2f;&#x2f;indelmoney.com&#x2f;ncd-issue-thank-you&#x2f;'>
                </input>
                <!-- Do not remove this code. -->
                <style>
                    html,body{
                        margin: 0px;
                    }
                    .formsubmit.zcwf_button{
                        color: white !important;
                        background: transparent linear-gradient(0deg, #0279FF 0%, #00A3F3 100%);
                    }
                    #crmWebToEntityForm.zcwf_lblLeft{
                        width: 100%;
                        padding: 25px;
                        margin: 0 auto;
                        box-sizing: border-box;
                    }
                    #crmWebToEntityForm.zcwf_lblLeft *{
                        box-sizing: border-box;
                    }
                    #crmWebToEntityForm {text-align: left;
                    }
                    #crmWebToEntityForm *{
                    direction: ltr;
                    }
                    .zcwf_lblLeft .zcwf_title{
                    word-wrap: break-word;
                    padding: 0px 6px 10px;
                    font-weight: bold }
                    .zcwf_lblLeft.cpT_primaryBtn:hover{
                    background: linear-gradient(#02acff 0,#006be4 100%)no-repeat padding-box !important;
                    box-shadow: 0 -2px 0 0  #0159b9 inset !important;
                    border: 0 !important;
                    color:  #fff !important;
                    outline: 0 !important;
                    }
                    .zcwf_lblLeft .zcwf_col_fld input[ type  = text], input[ type  = password], .zcwf_lblLeft .zcwf_col_fld textarea{
                    width: 100%;
                    border: 1px solid  #c0c6cc !important;
                    resize: vertical;
                    border-radius: 2px;
                    font-size: 12px;
                    padding: 6px;
                    float: left;
                    }
                    .zcwf_lblLeft .zcwf_col_lab{
                    width: 30%;
                    word-break: break-word;
                    padding: 0px 6px 0px;
                    margin-right: 10px;
                    margin-top: 5px;
                    float: left;
                    min-height: 1px;
                    }
                    .zcwf_lblLeft .zcwf_col_fld{
                    float: left;
                    width: 100%;
                    padding: 0px 6px 0px;
                    position: relative;
                    margin-top: 5px;
                    }
                    .zcwf_lblLeft .zcwf_privacy {padding: 6px;
                    }
                    .zcwf_lblLeft .wfrm_fld_dpNn {display: none;
                    }
                    .dIB {display: inline-block;
                    }
                    .zcwf_lblLeft .zcwf_col_fld_slt{
                    width: 100%;
                    border: 1px solid  #ccc;
                    background:  #fff;
                    border-radius: 4px;
                    font-size: 12px;
                    float: left;
                    resize: vertical;
                    padding: 2px 5px;
                    }
                    .zcwf_lblLeft .zcwf_row:after, .zcwf_lblLeft .zcwf_col_fld:after{
                    content: '';
                    display: table;
                    clear: both;
                    }
                    .zcwf_lblLeft .zcwf_col_help{
                    float: left;
                    margin-left: 7px;
                    font-size: 12px;
                    max-width: 35%;
                    word-break: break-word;
                    }
                    .zcwf_lblLeft .zcwf_help_icon{
                    cursor: pointer;
                    width: 16px;
                    height: 16px;
                    display: inline-block;
                    background:  #fff;
                    border: 1px solid  #c0c6cc;
                    color:  #c1c1c1;
                    text-align: center;
                    font-size: 11px;
                    line-height: 16px;
                    font-weight: bold;
                    border-radius: 50%;
                    }
                    .zcwf_lblLeft .zcwf_row {
                    margin: 15px 0px;
                    }
                    .zcwf_lblLeft .formsubmit{
                    margin-right: 5px;
                    cursor: pointer;
                    color:  #313949;
                    font-size: 12px;
                    }
                    .zcwf_lblLeft .zcwf_privacy_txt{
                    width: 90%;
                    color: rgb(0, 0, 0);
                    font-size: 12px;
                    font-family: Arial;
                    display: inline-block;
                    vertical-align: top;
                    color:  #313949;
                    padding-top: 2px;
                    margin-left: 6px;
                    }
                    .zcwf_lblLeft .zcwf_button{
                    font-size: 12px;
                    color:  #313949;
                    border: 1px solid  #c0c6cc;
                    padding: 3px 9px;
                    border-radius: 4px;
                    cursor: pointer;
                    max-width: 120px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    }
                    .zcwf_lblLeft .zcwf_tooltip_over{
                    position: relative;
                    }
                    .zcwf_lblLeft .zcwf_tooltip_ctn{
                    position: absolute;
                    background:  #dedede;
                    padding: 3px 6px;
                    top: 3px;
                    border-radius: 4px;
                    word-break: break-word;
                    min-width: 100px;
                    max-width: 150px;
                    color:  #313949;
                    z-index: 100;
                    }
                    .zcwf_lblLeft .zcwf_ckbox{
                    float: left;
                    }
                    .zcwf_lblLeft .zcwf_file{
                    width: 55%;
                    box-sizing: border-box;
                    float: left;
                    }
                    .cBoth:after{
                    content: '';
                    display: block;
                    clear: both;
                    }
                    @media all and  (max-width: 600px){
                    .zcwf_lblLeft .zcwf_col_lab, .zcwf_lblLeft .zcwf_col_fld{
                    width: auto;
                    float: none !important;
                    }
                    .zcwf_lblLeft .zcwf_col_help {width: 40%;
                    }
                    }
                </style>
                <div class = 'zcwf_title' style = 'max-width: 600px;color: black; font-family:Arial;'>Request a Callback</div>
                <div class = 'zcwf_row'>
                    <div class = 'zcwf_col_lab' style = 'font-size:12px; font-family: Arial;'>
                        <label for = 'NAME'>Name
                            <span style = 'color:red;'>*</span>
                        </label>
                    </div>
                    <div class = 'zcwf_col_fld'>
                        <input type = 'text' id = 'NAME' aria-required = 'true' aria-label = 'NAME' name = 'NAME' aria-valuemax = '120' maxlength = '120'>
                        </input>
                        <div class = 'zcwf_col_help'>
                        </div>
                    </div>
                </div>
                <div class = 'zcwf_row'>
                    <div class = 'zcwf_col_lab' style = 'font-size:12px; font-family: Arial;'>
                        <label for = 'COBJ8CF1'>Mobile
                            <span style = 'color:red;'>*</span>
                        </label>
                    </div>
                    <div class = 'zcwf_col_fld'>
                        <input type = 'text' id = 'COBJ8CF1' aria-required = 'true' aria-label = 'COBJ8CF1' name = 'COBJ8CF1' aria-valuemax = '30' maxlength = '30'>
                        </input>
                        <div class = 'zcwf_col_help'>
                        </div>
                    </div>
                </div>
                <div class = 'zcwf_row'>
                    <div class = 'zcwf_col_lab' style = 'font-size:12px; font-family: Arial;'>
                        <label for = 'Email'>Email
                            <span style = 'color:red;'>*</span>
                        </label>
                    </div>
                    <div class = 'zcwf_col_fld'>
                        <input type = 'text' ftype = 'email' autocomplete = 'false' id = 'Email' aria-required = 'true' aria-label = 'Email' name = 'Email' aria-valuemax = '100' crmlabel = '' maxlength = '100'>
                        </input>
                        <div class = 'zcwf_col_help'>
                        </div>
                    </div>
                </div>
                <div class = 'zcwf_row'>
                    <div class = 'zcwf_col_lab' style = 'font-size:12px; font-family: Arial;'>
                        <label for = 'COBJ8CF6'>State
                            <span style = 'color:red;'>*</span>
                        </label>
                    </div>
                    <div class = 'zcwf_col_fld'>
                        <select class = 'zcwf_col_fld_slt' role = 'combobox' aria-expanded = 'false' aria-haspopup = 'listbox' id = 'COBJ8CF6' onChange = 'addAriaSelected241827000004943757()' aria-required = 'true' aria-label = 'COBJ8CF6' name = 'COBJ8CF6'>
                            <option value = '-None-'>-None-</option>
                            <option value = 'Andhra&#x20;Pradesh'>Andhra Pradesh</option>
                            <option value = 'Arunachal&#x20;Pradesh'>Arunachal Pradesh</option>
                            <option value = 'Assam'>Assam</option>
                            <option value = 'Bihar'>Bihar</option>
                            <option value = 'Chhattisgarh'>Chhattisgarh</option>
                            <option value = 'Goa'>Goa</option>
                            <option value = 'Gujarat'>Gujarat</option>
                            <option value = 'Haryana'>Haryana</option>
                            <option value = 'Himachal&#x20;Pradesh'>Himachal Pradesh</option>
                            <option value = 'Jharkhand'>Jharkhand</option>
                            <option value = 'Karnataka'>Karnataka</option>
                            <option value = 'Kerala'>Kerala</option>
                            <option value = 'Madhya&#x20;Pradesh'>Madhya Pradesh</option>
                            <option value = 'Maharashtra'>Maharashtra</option>
                            <option value = 'Manipur'>Manipur</option>
                            <option value = 'Meghalaya'>Meghalaya</option>
                            <option value = 'Mizoram'>Mizoram</option>
                            <option value = 'Nagaland'>Nagaland</option>
                            <option value = 'Odisha'>Odisha</option>
                            <option value = 'Punjab'>Punjab</option>
                            <option value = 'Rajasthan'>Rajasthan</option>
                            <option value = 'Sikkim'>Sikkim</option>
                            <option value = 'Tamil&#x20;Nadu'>Tamil Nadu</option>
                            <option value = 'Telangana'>Telangana</option>
                            <option value = 'Tripura'>Tripura</option>
                            <option value = 'Uttar&#x20;Pradesh'>Uttar Pradesh</option>
                            <option value = 'Uttarakhand'>Uttarakhand</option>
                            <option value = 'West&#x20;Bengal'>West Bengal</option>
                            <option value = 'Andaman&#x20;and&#x20;Nicobar&#x20;Islands'>Andaman and Nicobar Islands</option>
                            <option value = 'Chandigarh'>Chandigarh</option>
                            <option value = 'Dadra&#x20;and&#x20;Nagar&#x20;Haveli&#x20;and&#x20;Daman&#x20;and&#x20;Diu'>Dadra and Nagar Haveli and Daman and Diu</option>
                            <option value = 'Lakshadweep'>Lakshadweep</option>
                            <option value = 'Delhi&#x20;&#x28;National&#x20;Capital&#x20;Territory&#x20;of&#x20;Delhi&#x29;'>Delhi &#x28;National Capital Territory of Delhi&#x29;</option>
                            <option value = 'Puducherry'>Puducherry</option>
                            <option value = 'Jammu&#x20;and&#x20;Kashmir'>Jammu and Kashmir</option>
                            <option value = 'Ladakh'>Ladakh</option>
                        </select>
                        <div class = 'zcwf_col_help'>
                        </div>
                    </div>
                </div>
                <div class = 'zcwf_row'>
                    <div class = 'zcwf_privacy'>
                        <div class = 'dIB vaT' align = 'left'>
                            <div class = 'displayPurpose crm-small-font-size'>
                                <label class = 'newCustomchkbox-md dIB w100_per'>
                                    <input autocomplete = 'off' id = 'privacyTool241827000004943757' type = 'checkbox' aria-checked = 'false' name = '' aria-errormessage = 'privacyErr241827000004943757' aria-label = 'privacyTool' onclick = 'disableErr241827000004943757()'>
                                    </label>
                                </div>
                            </div>
                            <div class = 'dIB zcwf_privacy_txt' style = 'font-size: 12px;font-family:Arial;color: black;'>By submitting this form, you agree to receive marketing and promotional communications from Indel Money Limited.</div>
                            <div id = 'privacyErr241827000004943757' aria-live = 'polite' style = 'font-size:12px;color:red;padding-left: 5px;visibility:hidden;'>Please accept this</div>
                        </div>
                    </div>
                    <div class = 'zcwf_row wfrm_fld_dpNn'>
                        <div class = 'zcwf_col_lab' style = 'font-size:12px; font-family: Arial;'>
                            <label for = 'COBJ8CF16'>Campaign Name</label>
                        </div>
                        <div class = 'zcwf_col_fld'>
                            <input type = 'text' id = 'COBJ8CF16' aria-required = 'false' aria-label = 'COBJ8CF16' name = 'COBJ8CF16' aria-valuemax = '255' maxlength = '255' value = 'NCD&#x20;5'>
                            </input>
                            <div class = 'zcwf_col_help'>
                            </div>
                        </div>
                    </div>
                    <div class = 'zcwf_row wfrm_fld_dpNn'>
                        <div class = 'zcwf_col_lab' style = 'font-size:12px; font-family: Arial;'>
                            <label for = 'COBJ8CF17'>Campaign Source</label>
                        </div>
                        <div class = 'zcwf_col_fld'>
                            <input type = 'text' id = 'COBJ8CF17' aria-required = 'false' aria-label = 'COBJ8CF17' name = 'COBJ8CF17' aria-valuemax = '255' maxlength = '255' value = 'Direct'>
                            </input>
                            <div class = 'zcwf_col_help'>
                            </div>
                        </div>
                    </div>
                    <div class = 'zcwf_row wfrm_fld_dpNn'>
                        <div class = 'zcwf_col_lab' style = 'font-size:12px; font-family: Arial;'>
                            <label for = 'COBJ8CF18'>Campaign Medium</label>
                        </div>
                        <div class = 'zcwf_col_fld'>
                            <input type = 'text' id = 'COBJ8CF18' aria-required = 'false' aria-label = 'COBJ8CF18' name = 'COBJ8CF18' aria-valuemax = '255' maxlength = '255' value = 'Direct'>
                            </input>
                            <div class = 'zcwf_col_help'>
                            </div>
                        </div>
                    </div>
                    <div class = 'zcwf_row wfrm_fld_dpNn'>
                        <div class = 'zcwf_col_lab' style = 'font-size:12px; font-family: Arial;'>
                            <label for = 'COBJ8CF19'>Referral URL</label>
                        </div>
                        <div class = 'zcwf_col_fld'>
                            <input type = 'text' id = 'COBJ8CF19' aria-required = 'false' aria-label = 'COBJ8CF19' name = 'COBJ8CF19' aria-valuemax = '450' maxlength = '450' value = 'https&#x3a;&#x2f;&#x2f;indelmoney.com&#x2f;ncd-issue&#x2f;'>
                            </input>
                            <div class = 'zcwf_col_help'>
                            </div>
                        </div>
                    </div>
                    <input type = 'text' type = 'hidden' style = 'display: none;' name = 'aG9uZXlwb3Q' value = ''/>
                    <div class = 'zcwf_row'>
                        <div class = 'zcwf_col_lab'>
                        </div>
                        <div class = 'zcwf_col_fld'>
                            <input type = 'submit' id = 'formsubmit' role = 'button' class = 'formsubmit zcwf_button' value = 'Submit' aria-label = 'Submit' title = 'Submit'>
                                <input type = 'reset' class = 'zcwf_button' role = 'button' name = 'reset' value = 'Reset' aria-label = 'Reset' title = 'Reset'>
                                </div>
                            </div>
                            <script>
                                function addAriaSelected241827000004943757 (){
                                    var optionElem = event.target;
                                    var previousSelectedOption = optionElem.querySelector ( '[aria-selected=true]' );
                                    if( previousSelectedOption ){
                                        previousSelectedOption.removeAttribute ( 'aria-selected' );
                                    }
                                    optionElem.querySelectorAll ( 'option' )[ optionElem.selectedIndex ].ariaSelected = 'true';
                                }
                                function privacyAlert241827000004943757 (){
                                    var privacyTool = document.getElementById ( 'privacyTool241827000004943757' );
                                    var privacyErr = document.getElementById ( 'privacyErr241827000004943757' );
                                    if( privacyTool != undefined && !privacyTool.checked ){
                                        privacyErr.style.visibility = 'visible';
                                        privacyTool.ariaInvalid = 'true';
                                        privacyTool.focus ();
                                        return false;
                                    }
                                    return true;
                                }
                                function disableErr241827000004943757 (){
                                    var privacyTool = document.getElementById ( 'privacyTool241827000004943757' );
                                    var privacyErr = document.getElementById ( 'privacyErr241827000004943757' );
                                    if( privacyTool != undefined && privacyTool.checked && privacyErr != undefined ){
                                        privacyErr.style.visibility = 'hidden';
                                        privacyTool.ariaInvalid = 'false';
                                    }
                                }
                                function validateEmail241827000004943757 (){
                                    var form = document.forms[ 'WebForm241827000004943757' ];
                                    var emailFld = form.querySelectorAll ( '[ftype=email]' );
                                    var i;
                                    for( i = 0; i < emailFld.length; i++ ){
                                        var emailVal = emailFld[ i ].value;
                                        if((emailVal.replace( /^\s+|\s+$/g,'' )).length != 0 ){
                                            var atpos = emailVal.indexOf ( '@' );
                                            var dotpos = emailVal.lastIndexOf ( '.' );
                                            if( atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= emailVal.length ){
                                                alert ( 'Please enter a valid email address. ' );
                                                emailFld[ i ].focus ();
                                                return false;
                                            }
                                        }
                                    }
                                    return true;
                                }
                                function checkMandatory241827000004943757 (){
                                    var mndFileds = new Array ( 'NAME', 'Email', 'COBJ8CF1', 'COBJ8CF6' );
                                    var fldLangVal = new Array ( 'Name', 'Email', 'Mobile', 'State' );
                                    for( i = 0; i < mndFileds.length; i++ ){
                                        var fieldObj = document.forms[ 'WebForm241827000004943757' ][ mndFileds[ i ]];
                                        if( fieldObj ){
                                            if(((fieldObj.value ).replace( /^\s+|\s+$/g,'' )).length == 0 ){
                                                if( fieldObj.type == 'file' ){
                                                    alert ( 'Please select a file to upload.' );
                                                    fieldObj.focus ();
                                                    return false;
                                                }
                                                alert ( fldLangVal[ i ] + ' cannot be empty.' );
                                                fieldObj.focus ();
                                                return false;
                                            }
                                            else if( fieldObj.nodeName == 'SELECT' ){
                                                if( fieldObj.options[fieldObj.selectedIndex].value == '-None-' ){
                                                    alert ( fldLangVal[ i ] + ' cannot be none.' );
                                                    fieldObj.focus ();
                                                    return false;
                                                }
                                            }
                                            else if( fieldObj.type == 'checkbox' ){
                                                if( fieldObj.checked == false ){
                                                    alert ( 'Please accept  ' + fldLangVal[ i ]);
                                                    fieldObj.focus ();
                                                    return false;
                                                }
                                            }
                                            try {
                                                if( fieldObj.name == 'Last Name' ){
                                                    name = fieldObj.value;
                                                }
                                            }
                                            catch ( e ){}
                                        }
                                    }
                                    if( !validateEmail241827000004943757()){
                                        return false;
                                    }
                                    if( !privacyAlert241827000004943757()){
                                        return false;
                                    }
                                    var urlparams = new URLSearchParams ( window.location.search );
                                    if( urlparams.has( 'service' ) && ( urlparams.get( 'service' ) === 'smarturl' )){
                                        var webform = document.getElementById ( 'webform241827000004943757' );
                                        var service = urlparams.get ( 'service' );
                                        var smarturlfield = document.createElement ( 'input' );
                                        smarturlfield.setAttribute ( 'type', 'hidden' );
                                        smarturlfield.setAttribute ( 'value', service );
                                        smarturlfield.setAttribute ( 'name', 'service' );
                                        webform.appendChild ( smarturlfield );
                                    }
                                    document.querySelector ( '.crmWebToEntityForm .formsubmit' ).setAttribute ( 'disabled', true );
                                }
                                function tooltipShow241827000004943757 ( el ){
                                    var tooltip = el.nextElementSibling;
                                    var tooltipDisplay = tooltip.style.display;
                                    if( tooltipDisplay == 'none' ){
                                        var allTooltip = document.getElementsByClassName ( 'zcwf_tooltip_over' );
                                        for( i = 0; i < allTooltip.length; i++ ){
                                            allTooltip[ i ].style.display = 'none';
                                        }
                                        tooltip.style.display = 'block';
                                    }
                                    else {
                                        tooltip.style.display = 'none';
                                    }
                                }
                            </script>
                            <!-- Do not remove this --- Analytics Tracking code starts -->
                            <script id = 'wf_anal' defer src = 'https://crm.zohopublic.in/crm/WebFormAnalyticsServeServlet?rid=f683e6d2da6b341f32bf8030739e6db6a95fa67cd8a762fe0393fd809d996eb967cc566f120010f85ba4583c4595db17gidd794aac75b1ed0e4b2ad891d6a90148a8552bfd595c2bb90999b440b10b250c3gid5ff2624d67848cca16c556194712baa96abbf55e2be7868c15ac6ee719d30027gid237e554ce00dce1871bdafcd2f9538d77ebad69b20a3198fae3827f548fd077b&tw=e4a65bff76412379233b71aa830a263299741039822827dccf904f46b1e063e4'>
                        </script>
                        <!-- Do not remove this --- Analytics Tracking code ends. -->
                    </form>
                </div>`,
          }}
        />
      </div>
    </div>
  );
}
