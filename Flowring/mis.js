// 所有初始化function 全都放在initMIS()
var misLocale;
var g_memid;
var lang;
function initMIS(programName,memid,misProgramLogID,locale) {
	if(locale!='zh_TW' && locale!='zh_CN' && locale!='en') locale='zh_TW';
	$.ajax({
		url: 'js/language/'+locale+'.js',
		type:'POST',
		async:false,
		dataType: "json",
		success: function(jData) {
			lang=jData;
		},
		error: function(msg) {
		}
	});	
	g_memid=memid;
	if(locale==undefined || locale=='') locale='zh_TW';
	misLocale=locale;
	initLoadingMask();
	initQuery();
	initProgramUpdate(programName,memid,locale);
	initProgramErrorMessage(programName,memid);
	//initProgramAjaxSend(programName,memid);
	$(window).bind('unload', function(){
		if (misProgramLogID==undefined) misProgramLogID=0;
		$.ajax({
			url: 'ProgramUnloadLog.jsp',
			type:'POST',
			data: {
					ProgramName		: programName,
					MemID			: memid,
					misProgramLogID	: misProgramLogID				
			},
			success: function(response) {
			},
			error: function() {
			}
		});
	});
	//繁轉簡
	$(document).ajaxComplete(function(){
		translateStoT(locale);
	});
	translateStoT(locale);
}
function translateStoT(locale) {
	var thisBrowser=getBrowserInf();
	if(locale=='zh_CN') {
		if(thisBrowser.type=='IE'){
			ie_switchTS();
		} else {
			tongwen_TtoS();
		}
	}
}
function tongwen_TtoS(){
  var s=document.getElementById("tongwenlet_cn");
  if(s!=null){document.body.removeChild(s);}
  var s=document.createElement("script");
  s.language="javascript";
  s.type="text/javascript";
  s.src="js/WFU/tongwen-ts.js";
  s.id="tongwenlet_cn";
  document.body.appendChild(s); 
}
function ie_switchTS(){
  var s=document.getElementById("temp_tsSwitch");
  if(s!=null){document.body.removeChild(s);}
  var s=document.createElement("script");
  s.language="javascript";
  s.type="text/javascript";
  s.src="js/WFU/StranJF_WFU_nate.js";
  s.id="temp_tsSwitch";
  document.body.appendChild(s); 
}
function initProgramAjaxSend(programName,memid) { //每次觸發ajax時 寫進Program log
	$( document ).ajaxSend(function( event, jqxhr, settings ) {
		if(settings.url != 'ProgramAjaxLog.jsp') {
			$.ajax({
				url: 'ProgramAjaxLog.jsp',
				type:'POST',
				data: {
					ProgramName	: programName,
					MemID		: memid,
					AjaxName	: settings.url,
					Data		: settings.data
				},
				success: function(response) {
				},
				error: function() {
				}
			});
		};
	});
}

function initLoadingMask() {
	var htmlStr=
		 '<div id="misMaskWhite" class="mask-white"></div>'
		+'<div id="misLoading" class="loading" style="display:none;">'
		+	'<table style="width:100%;font-size:0.9em;">'
		+		'<tr>'
		+			'<td id="LoadingMaskText"></td>'
		+			'<td><img src="images/loading.gif"/></td>'
		+		'</tr>'
		+	'</table>'	
		+'</div>';
	$(htmlStr).insertBefore('body');
}
function initQuery() {//for 多屏顯示
	if($(window).width()<=480){
		$('.query input,.query select,.query textarea').css('width','100%');
	}
}

function toggleQuery() {
	$('.query').slideToggle();

}

function initProgramUpdate(programName,memid,locale) {
	var htmlStr=
		 '<div id="misPrgUpdateMask" class="mask-black"></div>'
		+'<div id="misPrgUpdateBox" class="dialogbox">'
		+	'<div id="misPrgUpdateBoxHeader" class="dialogbox-header">'
		+		'<span style="font-weight:bold;margin-top:5px;font-family:微軟正黑體;">　'+lang.initProgramUpdate0+'</span>'
		+		'<span id="misPrgUpdateClose" style="float:right;"><span style="font-size:0.9em;color:grey;margin-right:5px;"></span><img src="images/lightbox_close.png" title="'+lang.initProgramUpdate1+'" style="width:22px;height:24px;margin:0px 2px;cursor:pointer;" onclick="hideProgramUpdate()"/></span>'
		+	'</div>'
		+	'<div id="misPrgUpdateBoxBody" style="height:330px;padding:4px 4px 4px 4px;">'
		+		'<div id="misPrgUpdateBoxText" style="font-family:微軟正黑體;text-align:left;height:320px;padding:5px 5px 5px 5px;background-color:white;overflow:auto;border-radius:4px;">'
		+		'</div>'
		+	'</div>'
		+'</div>';
	$(htmlStr).insertBefore('body');
	
	$('head').prepend('<link rel="stylesheet" href="css/font-awesome/css/font-awesome.min.css"/>');
	var programNameStr="'"+programName+"'";
	var memidStr="'"+memid+"'";
	var headingHtml=$('.heading').html();
	var now = new Date();
	var today='';
	if($(window).width()>480){
		today=now.getMonth()+1+'/'+now.getDate()+'('+lang.initProgramUpdate2.substring(now.getDay(),now.getDay()+1)+')'+getYearWeek(now)+lang.initProgramUpdate3;
	}
	htmlStr='<table style="width:100%;">'+
				'<tr>'+
					'<td style="width:35%;font-size:0.8em;text-align:left;padding-left:20px;"><span id="MisToday" style="vertical-align:middle;">'+today+'</span><marquee id="MisMarquee" scrollamount="3" style="float:right;color:yellow;margin:0px 5px 0px 5px;font-family:微軟正黑體;"></marquee></td>'+
					'<td style="width:30%;vertical-align:top;text-shadow: 1px 1px 2px #444, 0 0 10px #fff, 0 0 3px #eee;"><span>'+headingHtml+'</span></td>'+
					'<td style="width:35%;text-align:right;">'+
						'<i class="fa fa-star-o" aria-hidden="true" title="'+lang.initProgramUpdate4+'" onclick="toggleFUF('+programNameStr+','+memidStr+')"></i>'+
						'<i class="fa fa-search" aria-hidden="true" title="'+lang.initProgramUpdate5+'" onclick="toggleQuery()"></i>'+
						'<i class="fa fa-info-circle" aria-hidden="true" title="'+lang.initProgramUpdate6+'" onclick="showProgramUpdateList('+programNameStr+')"></i>'+
					'</td>'+
				'</tr>'+
			'</table>';
	$('.title').html(htmlStr);
	$('.heading').html(htmlStr);
	var leftTdWidth=$('.heading table tr td:eq(0)').width();
	var middleTdWidth=$('.heading table tr td:eq(1)').width();
	var rightTdWidth=$('.heading table tr td:eq(2)').width();
	var newmiddleTdWidth=$('.heading table tr td:eq(1) span').width()+20;
	$('.heading table tr td:eq(0)').width(leftTdWidth+(middleTdWidth-newmiddleTdWidth)/2);
	$('.heading table tr td:eq(1)').width(newmiddleTdWidth);
	$('.heading table tr td:eq(2)').width(rightTdWidth+(middleTdWidth-newmiddleTdWidth)/2);
	$('#MisMarquee').outerWidth($('.heading table tr td:eq(0)').outerWidth()-$('#MisToday').outerWidth()-50);
	//避免釘選Menu後，會遮住function btn，所以只有當未釘選Menu時才把function btn往上搬
	if($(window).width()>480 && ($('#thumbtackMenuBtn', window.parent.document).attr('data')==0 || $('#thumbtackMenuBtn', window.parent.document).attr('data')==undefined)){
		$('.misFunctionBtn').prependTo('.heading table tr td:eq(2)');
	} else {
		$('.misFunctionBtn').height('22');
	}
	$.ajax({
		url: 'ProgramMarquee.jsp',
		type:'POST',
		async:false,
		data: {
			Locale	: locale
		},
		success: function(response) {
			response = $.trim(response);
			$('#MisMarquee').html(response);
		},
		error: function() {
			alert('ProgramMarquee request error');
		}
	});
	$.ajax({
		url: 'ProgramCheckFUF.jsp',
		type:'POST',
		async:false,
		data: {
			ProgramName	: programName,
			MemID		: memid
		},
		success: function(response) {
			response = $.trim(response);
			if(response=='true') {
				$('.fa-star-o').removeClass('fa-star-o').addClass('fa-star').css('color','yellow').attr('title',lang.initProgramUpdate7);
			}
		},
		error: function() {
			alert('ProgramCheckFUF request error');
		}
	});
			
	$('#misPrgUpdateBox').draggable({handle:'#misPrgUpdateBoxHeader'});
	$.ajax({
		url: 'ProgramUpdate-ajax1.jsp',
		type:'POST',
		async:false,
		data: {
			ProgramName	: programName,
			MemID		: memid
		},
		success: function(response) {
			response = response.replace(/>\s+</g,'><'); //為了解決IE9 innerHtml的問題
			response = $.trim(response);
			if (response!='') {
				$('#misPrgUpdateBoxText').html(response);
				var updateItems=$('#misPrgUpdateBoxText table tbody tr li').size();
				$('#misPrgUpdateClose>img').hide();
				var i=(updateItems<5) ? updateItems*2 : 10;
				function countDown(){
					$('#misPrgUpdateClose>span').html(i);
					if(i<=0){
						$('#misPrgUpdateClose>span').html('');
						$('#misPrgUpdateClose>img').show();
					} else {
						i--;
						setTimeout(function(){countDown()},1000);
					}
				}
				countDown();
				showProgramUpdate();
			}
		},
		error: function() {
			alert('ProgramUpdate-ajax1 request error');
		}
	});
}

function toggleFUF(programName,memid){//設定或取消常用功能
	var isSave='false'
	if($('.heading i').hasClass('fa-star-o')) {
		isSave='true';
		$('.fa-star-o').removeClass('fa-star-o').addClass('fa-star').css('color','yellow').attr('title',lang.initProgramUpdate7);
	} else {
		$('.fa-star').removeClass('fa-star').addClass('fa-star-o').css('color','').attr('title',lang.initProgramUpdate4);
	}
	$.ajax({
		url: 'ProgramUpdateFUF.jsp',
		type:'POST',
		async:false,
		data: {
			MemID			: memid,
			ProgramName		: programName,
			IsSave			: isSave
		},
		success: function(response) {
			showFUF();
			accordion_head.first().addClass('active').next().slideDown('normal');
		},
		error: function() {
			alert('更新常用功能設定 發生錯誤');
		}
	});
}

function initProgramErrorMessage(programName,memid){
	$( document ).ajaxError(function( event, jqxhr, settings, exception ){ 
		var ajaxurl=settings.url;
		if( ajaxurl != 'ProgramErrorMessage-ajax.jsp' && programName != '' && ajaxurl.indexOf("portal.flowring.com/WebAgenda/MIS/js")<0 && jqxhr.status!=0){ // && jqxhr.statusText != 'error'){ //避免錯誤處理程式自身錯誤造成無限循環；網路造成之錯誤不寫入
			$.ajax({
				url: 'ProgramErrorMessage-ajax.jsp',
				type:'POST',
				async:true,
				data: {
					ProgramName		: programName,
					MemID			: memid,
					AjaxURL			: settings.url,
					AjaxData		: settings.data,
					ErrStatus		: jqxhr.status,
					ErrStatusText	: jqxhr.statusText,
					ErrResponseText	: jqxhr.responseText,
					BrowserType		: getBrowserInf().type,
					BrowserVersion	: getBrowserInf().version
				},
				success: function(response) {
				},
				error: function() {
				}
			});
		}
	});
}

function programLogin(programName,javaScriptStr) {
	$.ajax({
		url: 'ProgramLogin.jsp',
		type:'POST', 
		data: {ProgramName : programName},
		error: function() {
			alert('ProgramLogin error');
		},
		success: function() {
			eval(javaScriptStr);
		}  				
	});
}
function showLoadingMask(loadingMaskText) {
	$('#misMaskWhite,#misLoading').show();
	$('.query,.query *,.data,.data *').not('#misLoading').addClass('misBlur');
	if(loadingMaskText==undefined) loadingMaskText='Loading...'
	$('#LoadingMaskText').html(loadingMaskText);
	//將 Box 置中
	var boxLeft=0;
	var boxTop=0;
	boxLeft = ($(window).width()-$('.loading').outerWidth())/2; 
	boxTop = ($(window).height()-$('.loading').outerHeight())/2;
	$('#misLoading').css({
		'top':boxTop,
		'left':boxLeft
	});
};		
function hideLoadingMask() {
	$('.query,.query *,.data,.data *').addClass('misClear')
	$('.query,.query *,.data,.data *').removeClass('misBlur');
	setTimeout("$('.query,.query *,.data,.data *').removeClass('misClear')",200);//0.5秒 
	setTimeout("$('#misMaskWhite,#misLoading').hide()",10);//0.01秒 
};

function showProgramUpdateList(programName) {
	$.ajax({
		url: 'ProgramUpdate-ajax2.jsp',
		type:'POST',
		async:false,
		data: {
			ProgramName	: programName
		},
		success: function(response) {
			response = response.replace(/>\s+</g,'><'); //為了解決IE9 innerHtml的問題
			$('#misPrgUpdateBoxText').html(response);
			showProgramUpdate();
		},
		error: function() {
			alert('ProgramUpdate-ajax2 request error');
		}
	});
}

function showProgramUpdate() {
	$('#misPrgUpdateMask,#misPrgUpdateBox').show();
	//將 Box 置中
	var boxLeft=0;
	var boxTop=0;
	boxLeft = ($(window).width()-$('#misPrgUpdateBox').outerWidth())/2; 
	boxTop = ($(window).height()-$('#misPrgUpdateBox').outerHeight())/2;
	$('#misPrgUpdateBox').css({
		'top':boxTop,
		'left':boxLeft
	});
};		
function hideProgramUpdate() {
	$('#misPrgUpdateMask,#misPrgUpdateBox').hide();
};

function datepicker(e) {
	if (e==null) e='.datepicker';
	if(misLocale=='zh_TW') {
		$( e ).datepicker({ 
			dateFormat: 'yy-mm-dd',
			changeMonth: true,
			changeYear: true,
			showOtherMonths: true,
			selectOtherMonths: true,
			showButtonPanel: true,
			showAnim: 'clip',  //show,slideDown,fadeIn,blind,bounce,clip,drop,fold,slide
			monthNamesShort: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
			dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
			currentText: '今天',
			closeText: '關閉',
			autoSize: false , //true  
			showOn:'focus' , //focus,button,both
			buttonText:'選擇日期'
		});
	} else {
		$( e ).datepicker({ 
			dateFormat: 'yy-mm-dd',
			changeMonth: true,
			changeYear: true,
			showOtherMonths: true,
			selectOtherMonths: true,
			showButtonPanel: true,
			showAnim: 'clip',  //show,slideDown,fadeIn,blind,bounce,clip,drop,fold,slide
			autoSize: false , //true  
			showOn:'focus'  //focus,button,both
		});
	}
	$('#ui-datepicker-div').hide();
}

//TinyMCE--------------------------------------------------
function setTinyMCE() {
	tinyMCE.init({
		// General options
		language:"zh-tw", 
		mode : "textareas",
		editor_selector : "mceEditor",  
		theme : "advanced",
		plugins : "autolink,lists,pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template,wordcount,advlist,autosave,visualblocks",
		// Theme options
		theme_advanced_buttons1 : "bold,italic,underline,fontsizeselect,fontselect,|,undo,redo,|,bullist,numlist,|,outdent,indent,|,forecolor,backcolor,code",
		//"save,newdocument,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,styleselect,formatselect,fontselect,fontsizeselect",
		//theme_advanced_buttons2 : "cut,copy,paste,pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,|,insertdate,inserttime,preview,|,forecolor,backcolor",
		//theme_advanced_buttons3 : "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen",
		//theme_advanced_buttons4 : "insertlayer,moveforward,movebackward,absolute,|,styleprops,|,cite,abbr,acronym,del,ins,attribs,|,visualchars,nonbreaking,template,pagebreak,restoredraft,visualblocks",
		theme_advanced_toolbar_location : "top",
		theme_advanced_toolbar_align : "left",
		theme_advanced_statusbar_location : "none",//"bottom",
		theme_advanced_resizing : true,

		// Example content CSS (should be your site CSS)
		content_css : "css/content.css",

		// Drop lists for link/image/media/template dialogs
		template_external_list_url : "lists/template_list.js",
		external_link_list_url : "lists/link_list.js",
		external_image_list_url : "lists/image_list.js",
		media_external_list_url : "lists/media_list.js",

		// Style formats
		style_formats : [
			{title : 'Bold text', inline : 'b'},
			{title : 'Red text', inline : 'span', styles : {color : '#ff0000'}},
			{title : 'Red header', block : 'h1', styles : {color : '#ff0000'}},
			{title : 'Example 1', inline : 'span', classes : 'example1'},
			{title : 'Example 2', inline : 'span', classes : 'example2'},
			{title : 'Table styles'},
			{title : 'Table row 1', selector : 'tr', classes : 'tablerow1'}
		],

		// Replace values for the template plugin
		template_replace_values : {
			username : "Some User",
			staffid : "991234"
		}
	});
}

function setTinyMCE4() {
	if($('#TinymceImgUploadForm').html()==null){
		var htmlStr ='<div style="display:none">'
					+'<form name="TinymceImgUploadForm" id="TinymceImgUploadForm" enctype="multipart/form-data" method="post" action="TinymceImgUpload.jsp" target="TinymceHiddeniFrame">'
					+	'<input  type="file" name="TinymceImgUpload" id="TinymceImgUpload" />'
					+'</form>'
					+'<iframe name="TinymceHiddeniFrame" id="TinymceHiddeniFrame"></iframe>'
					+'</div>';
		$(htmlStr).insertBefore('body');
	}

	tinymce.init({
		//body_id		: 	"TinyMCEBody",
		selector	: 	".mceEditor",
		editor_selector : "mceEditor",  
		theme		: 	"modern",
		language	: 	"zh_TW",
		width		:	"100%",
		plugins		: 	[
						"advlist autolink lists link image charmap print preview hr anchor pagebreak",
						"searchreplace wordcount visualblocks visualchars code fullscreen",
						"insertdatetime media nonbreaking save table contextmenu directionality",
						"emoticons template paste textcolor"// moxiemanager" 
						],
		toolbar1	: 	"insertfile undo redo | bold italic underline | fontsizeselect fontselect | forecolor backcolor | bullist numlist | outdent indent | link image table | preview code | frequentphrase",
		//toolbar2	: 	"styleselect fontsizeselect fontselect | print preview media | link image| alignleft aligncenter alignright alignjustify",
        paste_data_images: true, 
		menubar		:	false, //關閉Menubar
		//menubar		: 	"tools table format view insert edit", //設定Menubar
		statusbar 	: 	false, //關閉狀態列
		font_formats: 	
						"微軟正黑體=微軟正黑體;"+
						"新細明體=新細明體;"+
						"仿宋體=FangSong;"+
						"Andale Mono=andale mono,times;"+
						"Arial=arial,helvetica,sans-serif;"+
						"Arial Black=arial black,avant garde;"+
						"Book Antiqua=book antiqua,palatino;"+ 
						"Comic Sans MS=comic sans ms,sans-serif;"+ 
						"Courier New=courier new,courier;"+ 
						"Georgia=georgia,palatino;"+ 
						"Helvetica=helvetica;"+ 
						"Impact=impact,chicago;"+ 
						"Symbol=symbol;"+ 
						"Tahoma=tahoma,arial,helvetica,sans-serif;"+ 
						"Terminal=terminal,monaco;"+ 
						"Times New Roman=times new roman,times;"+
						"Trebuchet MS=trebuchet ms,geneva;"+
						"Verdana=verdana,geneva;"+ 
						"Webdings=webdings;"+
						"Wingdings=wingdings,zapf dingbats",
		image_advtab: 	true,
		toolbar_items_size : 'small',				
        file_browser_callback: function(field_name, url, type, win) {
			if(type=='image') {// 插入/編輯 圖片
				$(".mce-floatpanel").css('z-index',65530);//原來的z-index=65536，在上傳完成前讓input視窗退到mask後
				$("#TinymceImgUpload").val('').click();
				if($('#TinymceImgUpload').val()=='') {
					$('.mce-placeholder').val('');
					$(".mce-floatpanel").css('z-index',65536);
				}
			}
		},
		setup: function(editor) {
			editor.on('init', function() {
				this.getDoc().body.style.fontFamily = '微軟正黑體'; //設定內文字型
				this.getDoc().body.style.fontSize = '12px'; //設定內文字型大小
			});
			editor.addButton('frequentphrase', {
			 // text		: '常用詞句',
				title		: lang.tinymce0+' '+lang.tinymce1,
				image       : 'images/Editing-Border-Color-icon-s.png',
				icon		: false,
				onclick		: function () {
					var htmlStr='<div id="misFPMask" class="mask-black" style="display:none;"></div>'+
								'<div id="misFPBox" class="dialogbox" style="width:50%;">'+
									'<div id="misFPHeader" style="font-weight:bold;font-size:1.1em;text-align:center;height:20px;cursor:move;margin:4px 4px 0px 4px;padding:4px;">'+
									'<span style="font-weight:bold;margin-top:5px;margin-left:20px;">'+lang.tinymce1+'</span>'+
									'<img src="images/lightbox_close.png" title="'+lang.tinymce2+'" style="width:22px;height:24px;float:right;margin:0px 2px;cursor:pointer;" onclick="cancelMisFP()"/>'+
									'</div>'+
									'<div style="height:240px;padding:4px 4px 4px 4px;">'+
										'<div id="misFPTbDiv" style="width:100%;height:205px;overflow:auto;"></div>'+
										'<div style="margin-top:9px;">'+
											'<button id="ConfirmMisFP" class="successBtn">'+lang.tinymce0+'</button>'+
											'<button onclick="cancelMisFP()" class="dangerBtn">'+lang.tinymce2+'</button>'+
										'</div>'+
									'</div>'+
								'</div>';
					if($('#misFPBox').attr('class')==undefined) {
						$('body').prepend(htmlStr);
						$('#misFPBox').draggable({handle:'#misFPHeader'});
					}
					showFrequentPhrase();
					showMisFPBox();
					$('#ConfirmMisFP').click(function(){
						var fp='';
						$('#misFPTb .misFPcheckbox').each(function(){
							if($(this).prop('checked')) {
								var e=$(this).parent().parent().find('td:eq(1)').html();
								e=e.replace(/\x0a/g,'<br>');//把換行符號改成<br>
								fp=fp+e+'<br/>';
							}
						});
						editor.insertContent(fp);
						hideMisFPBox();
					});
				}
			});
		}		
	});
	//選取檔案後submit Form 執行TinymceImgUpload.jsp上傳圖檔
	$('#TinymceImgUpload').change(function(){
		if($('#TinymceImgUpload').val()!='') {
			$(this).closest('form').trigger('submit');
		}
	});
}

function showFrequentPhrase() {
	$.ajax({
		url: 'FrequentPhrase-ajax.jsp',
		type:'POST',
		async:false,
		data: {
			MemID	: g_memid,
			Locale	: misLocale
		},
		success: function(response) {
			response = response.replace(/>\s+</g,'><'); //為了解決IE9 innerHtml的問題
			$('#misFPTbDiv').html(response);
			$('#misFPTb').misTable({
				sort:{
					sortFirstTime	:'false',
					sortColumn		: 2,
					ascDesc			: 'asc',
					notSortColumn	: '.notsort'
				},
				update:{
					enabled			: 'true',
					insert:{
						enabled			: 'true',
						afterShowInsert	: function($thisRow){
						},
						beforeSave		: function($thisRow,valArray,txtArray){
							return true; //可自訂資料檢查，若 return false;則會中止儲存動作 
						},
						saveAjax		: function(valArray,$thisRow){
							showSaving($thisRow);
							$.ajax({
								url: 'FrequentPhrase-ajax1.jsp',
								type:'POST',
								data: {
									FrequentPhrase		: valArray[1],
									RankNumber			: valArray[2],
									MemID				: g_memid
								},
								success: function(response) {
									hideSaving($thisRow);
									showFrequentPhrase();
								},
								error: function(msg,ajaxOptions,thrownError) {
									alert(this.url.substring(this.url.indexOf('-')+1,this.url.length-4)+': '+thrownError+' / status:'+msg.status);
									showFrequentPhrase();
								}
							});
						}
					},
					edit :{
						enabled			: 'true',
						afterShowEdit	: function($thisRow){
						},
						saveAjax		: function(valArray,$thisRow){
							showSaving($thisRow);
							$.ajax({
								url: 'FrequentPhrase-ajax2.jsp',
								type:'POST',
								data: {
									ID					: $thisRow.attr('data'),
									FrequentPhrase		: valArray[1],
									RankNumber			: valArray[2],
									MemID				: g_memid
								},
								success: function(response) {
									hideSaving($thisRow);
									showFrequentPhrase();
								},
								error: function(msg,ajaxOptions,thrownError) {
									alert(this.url.substring(this.url.indexOf('-')+1,this.url.length-4)+': '+thrownError+' / status:'+msg.status);
									showFrequentPhrase();
								}
							});
						}
					},
					delete : { 
						enabled		: 'true',
						deleteAjax	: function($thisRow){
							showSaving($thisRow);
							$.ajax({
								url: 'FrequentPhrase-ajax3.jsp',
								type:'POST',
								data: {
										ID					: $thisRow.attr('data'),
									   },
								success: function(response) {
									hideSaving($thisRow);
									showFrequentPhrase();
								},
								error: function(msg,ajaxOptions,thrownError) {
									alert(this.url.substring(this.url.indexOf('-')+1,this.url.length-4)+': '+thrownError+' / status:'+msg.status);
									showFrequentPhrase();
								}
							});
						}
					}
				}
				/*
				fixTbHead:{
						enabled			: 'true',
						tbBodyHeight	: '170px'
					}
				*/
			});
		},
		error: function(msg,ajaxOptions,thrownError) {
			alert(this.url.substring(this.url.indexOf('-')+1,this.url.length-4)+': '+thrownError+' / status:'+msg.status);
		}
	});
}
function showMisFPBox() {
	$('#misFPMask').show();
	$('#misFPBox').show();
	//將 Box 置中
	var boxLeft=0;
	var boxTop=0;
	boxLeft = ($(window).width()-$('#misFPBox').outerWidth())/2; 
	boxTop = ($(window).height()-$('#misFPBox').outerHeight())/2;
	$('#misFPBox').css({
		'top':boxTop,
		'left':boxLeft
	});
};		
function hideMisFPBox() {
	$('#misFPMask').remove();
	$('#misFPBox').remove();
};
function toggleMisFPCheckbox() {
	if($('#misToggleFPCheckbox').prop('checked')) {
		$('#misFPTb .misFPcheckbox').prop('checked',true);
	} else {
		$('#misFPTb .misFPcheckbox').prop('checked',false);
	}
}
function cancelMisFP() {
	hideMisFPBox();
}

//圖檔上傳完成後會呼叫insertTinymceImgUrl將路徑寫入[圖片網址]欄位
function insertTinymceImgUrl(fileName,isErr,sizeInBytes) {
	$(".mce-floatpanel").css('z-index',65536);
	if(sizeInBytes>=5120000) {
		alert(lang.tinymce3+' : '+sizeInBytes+' Byte, '+lang.tinymce4);

	} else {
		$('.mce-placeholder').val('Upload/TinyMCE_Upload/'+fileName);
	}
}
	
function setTinyMCE4Min() {
	tinymce.init({
		selector	: 	".mceEditor",
		editor_selector : "mceEditor",  
		theme		: 	"modern",
		language	: 	"zh_TW",
		width		:	"100%",
		plugins		: 	[
						"advlist autolink lists link image charmap print preview hr anchor pagebreak",
						"searchreplace wordcount visualblocks visualchars code fullscreen",
						"insertdatetime media nonbreaking save table contextmenu directionality",
						"emoticons template paste textcolor"// moxiemanager" 
						],
		toolbar1	: 	"undo redo | bold italic underline | fontsizeselect | forecolor | bullist numlist ",
		menubar		:	false, //關閉Menubar
		statusbar 	: 	false, //關閉狀態列
		image_advtab: 	true,
		toolbar_items_size : 'small',				
		setup: function(ed) {
			ed.on('init', function() {
				this.getDoc().body.style.fontFamily = '微軟正黑體'; //設定內文字型
				this.getDoc().body.style.fontSize = '12px'; //設定內文字型大小
			});
		}		
	});
}	
//-------------end of tinymce-------------------------------------------------------

//--for chosen plugin
function chosen(obj) {
	$(obj).chosen({search_contains:true,no_results_text: lang.chosen0});
}

function isChina(s){  //是否含有中文:true,false >>若有中文，正規表示式有可能判斷錯誤，所以要先判斷是否含有中文
	var patrn=/[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi;  
	if(!patrn.exec(s)){  
		return false;  
	}  
	else{  
		return true;  
	}  
}  


function isNumber(val) {    
	var reg = /^[0-9]*$/;
	if(isChina(val)) {
		return false;
	}
	else {
	   return reg.test(val);    
	}
}

function isDecimal(val) {    
	var reg = /^[0-9]*\.?[0-9]*$/;
	if(isChina(val)) {
		return false;
	}
	else {
	   return reg.test(val);    
	}
}

function isMoney(val) {   
	var reg =  /^[0-9\-][0-9\,]*\.?[0-9]*$/;
	if(isChina(val)) {
		return false;
	}
	else {
	   return reg.test(val);    
	}
} 		
		
function isPhoneNumber(val) {    
   var reg = /^[0-9\(\)#~\+\-]*$/;    
   return reg.test(val);    
} 		
function isEMailAddress(val) {    
	var reg =/^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
	if(isChina(val)) {
		return false;
	}
	else {
	   return reg.test(val);    
	}
} 		
function isWebSiteUrl(val) {    
   var reg = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;    
   return reg.test(val);    
}
function isTaxID(val) {    
	var reg = /^[0-9]{8}$/;    
	if(isChina(val)) {
		return false;
	}
	else {
	   return reg.test(val);    
	}
} 
function isInvoiceID(val) {    
	var reg = /^[A-Z]{2}[0-9]{8}/;    
	if(isChina(val)) {
		return false;
	}
	else {
	   return reg.test(val);    
	}
} 
function isDate(para) {
	try {
		var answer=true;
		var D, d = para.split(/\D+/);
		if(d[0]>9999) answer=false; 
		if(d[1].length>2 || d[2].length>2) answer=false; 
		d[0] *= 1;
		d[1] -= 1;
		d[2] *= 1;
		D = new Date(d[0], d[1], d[2]);
		if(D.getFullYear() != d[0] || D.getMonth() != d[1] || D.getDate() != d[2]) answer=false;
		return answer;
	}
	catch (er) {
		return false;
	}
}
function isIP(val) {    
   var reg = /^((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))*$/;    
   return reg.test(val);    
} 		
		
function stripHTML(input) {
	var output = '';
	if(typeof(input)=='string'){
		var output = input.replace(/(<([^>]+)>)/ig,"");
	}
	return output;
}

function formatNumber(number,fix) {
	if(fix==undefined) fix=2;
    var number = number.toFixed(fix) + '';
    var x = number.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

function showclock( ){
	var hour,min,sec
	now=new Date( )
	hour=now.getHours( )
	min=now.getMinutes( )
	sec=now.getSeconds( )
	document.clock.time.value="現在時間是"+hour+":"+min+":"+sec
	setTimeout("showclock( )",1000)
}

function getYearWeek(date){  
    var date2=new Date(date.getFullYear(), 0, 1); 
	var firstDayOfYear=new Date(date.getFullYear()+'-01-01');
    var day2=date2.getDay(); //年度第一天星期幾 週日=0,週一=1
	var month=date.getMonth()+1;
	var today=new Date(date.getFullYear()+'/'+month+'/'+date.getDate());
	var totalDays=Math.ceil((today - firstDayOfYear)/ 86400000);//距年初天數
	var weekNum=Math.floor((totalDays+day2)/7)+1;
	return weekNum;
} 

function getLastDateOfMonth(tYear,tMonth) {	
	if (tMonth=='') tMonth=12;
	var d= new Date();
	d.setFullYear(tYear);
	d.setMonth(tMonth);
	d.setDate(0); //設定日期為當月最後一天
	var eYear=d.getFullYear();
	var eMonth=d.getMonth()+1;
	var eDay=d.getDate();
	return eYear+'-'+eMonth+'-'+eDay;
};
function getTodayDate() {
	var today= new Date();
	var Year=today.getFullYear();  //西元年 4位數字
	var Month=today.getMonth()+1;  //月
	var Day=today.getDate();       //日
	var Weekday=today.getDay();    //星期 0~6  日~六
	var WeekdayInChinese='日一二三四五六';
	var cWeekday=WeekdayInChinese.substring(Weekday,Weekday+1)
	return Year+'/'+Month+'/'+Day+'(星期'+cWeekday+')';
}	
function getFirstDateOfWeek(tYear,tWeek) {	
	var basedate= new Date();
	basedate.setFullYear(tYear);
	basedate.setMonth(0);
	basedate.setDate((tWeek-1)*7); 
	var eYear=basedate.getFullYear();
	var eMonth=basedate.getMonth()+1;
	var eDay=basedate.getDate();
	var eWeekday=basedate.getDay()+1;
	basedate.setDate(eDay+7-eWeekday % 7-6);
	eYear=basedate.getFullYear();
	if (eYear<tYear) {
		basedate.setFullYear(tYear);
		basedate.setMonth(0);
		basedate.setDate(1);
	};
	eYear=basedate.getFullYear();
	if (tWeek==1 && eWeekday!=7) {
		eYear=tYear-1;
		eMonth=12;
		eDay=31-eWeekday+1;
	}
	else {
		eMonth=basedate.getMonth()+1;
		eDay=basedate.getDate();
	}	
	var firstDateOfWeek=eYear+'-'+eMonth+'-'+eDay;
	return firstDateOfWeek;
};

function getLastDateOfWeek(tYear,tWeek) {	
	var basedate= new Date();
	basedate.setFullYear(tYear);
	basedate.setMonth(0);
	basedate.setDate((tWeek-1)*7);
	var eYear=basedate.getFullYear();
	var eMonth=basedate.getMonth()+1;
	var eDay=basedate.getDate();
	var eWeekday=basedate.getDay()+1;
	basedate.setDate(eDay+7-eWeekday % 7);
	eYear=basedate.getFullYear();
	if (eYear>tYear) {
		basedate.setFullYear(tYear);
		basedate.setMonth(11);
		basedate.setDate(31);
	};
	eYear=basedate.getFullYear();
	eMonth=basedate.getMonth()+1;
	eDay=basedate.getDate();
	eWeekday=basedate.getDay();
	var lastDateOfWeek=tYear+'-'+eMonth+'-'+eDay;
	return lastDateOfWeek;
};
function getBrowserInf() {
	var Sys = {};
	var ua = navigator.userAgent.toLowerCase();
	var s;
	(s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] :
	(s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
	(s = ua.match(/edge\/([\d.]+)/)) ? Sys.ie = s[1] :
	(s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
	(s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
	(s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
	(s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
	
	var browserType;
	var browserVer;
	if (Sys.ie) {browserType='IE'; browserVer=Sys.ie};
	if (Sys.firefox) {browserType='Firefox'; browserVer=Sys.firefox};
	if (Sys.chrome) {browserType='Chrome'; browserVer=Sys.chrome};
	if (Sys.opera) {browserType='Opera'; browserVer=Sys.opera};
	if (Sys.safari) {browserType='Safari'; browserVer=Sys.safari};
	return {type:browserType,version:browserVer};
};
//表格 ajax 排序-20150705-----------------
function misTableSorter(tbID,orderBy,ascDesc,refreshTable,forbidOrderList) {
	$('#'+tbID+' th').not(forbidOrderList).css('cursor','pointer');
	$('#'+tbID+' th').click(function(){
		var clickID=$(this).attr('id');
		if (forbidOrderList==null) forbidOrderList='';
		if(forbidOrderList.indexOf(clickID)==-1) {
			$('#'+tbID+' th').removeClass('asc desc');
			setSortImg(ascDesc,clickID);
			if(orderBy == clickID) {
				if(ascDesc == 'DESC'){
					ascDesc='ASC';
				}	
				else{
					ascDesc='DESC';
				}
			}
			refreshTable(clickID,ascDesc);
		}
	});
}
function setSortImg(ascDesc,clickID) {
	if(ascDesc == 'DESC'){
		$('#'+clickID).addClass('desc');
	}	
	else{
		$('#'+clickID).addClass('asc');
	}
}

$.fn.outerHTML = function(s) {
    return s
        ? this.before(s).remove()
        : jQuery("<p>").append(this.eq(0).clone()).html();
};

//MIS Table Plugin 20150826 by Nate/20160201 v2.0 by Nate
var tgDetail='true';
(function($){
	$.fn.misTable = function(options){
	var defaults ={
			zebra				: 'true',			//奇偶數列套用class
			evenClass			: 'Even',			//奇數列的class
			oddClass			: 'Odd',			//偶數列的Class
			highlightColumns	: '',				//強調顯示某幾欄
			highlightEvenClass	: 'highlightEven',	//奇數列強調顯示欄的class
			highlightOddClass	: 'highlightOdd',	//偶數列強調顯示欄的class
			trSelect			: 'true',			//'true':表格列點選效果
			tdSelect			: 'false',			//'true':表格cell點選效果
			sort : {								//排序
				enabled			:'true',			//設定是否要執行sort功能
				ajax : {
					enabled		: 'false',			//若為true,則按下表頭時會觸發doAjax function，而不會由misTable排序
					doAjax		: function(){}
				},
				sortFirstTime	:'true',			//第一次套用時是否要執行sort
				sortColumn		: 0,				//預設的排序欄位
				ascDesc			: 'asc',   			//升冪或降冪排序
				sortHeadLineNo	: 0,				//點選<thead>中的第幾列可觸發排序，0是第一列
				notSortColumn	: '',				//不可排序的欄位list 如:'.edit,.No'
				beforeSort 		: function($th,toggleDetail){	//$th : 表頭被點選到的th物件
					if(toggleDetail=='true' ) {//for toggleDetail 排序前先刪除detail並移除trSelect
						$th.parent().parent().parent().children('tbody').children('.data-detail').remove();
						$th.parent().parent().parent().children('tbody').children('.misInsert').remove();
						$th.parent().parent().parent().children('tbody').children('.detail').removeClass('trSelected detail');
						$th.parent().parent().parent().children('tbody').children('tr').children('td').removeClass('tdSelected');
						if($th.parent().parent().find('.misUpdateStatus').html()=='') {
							$('.misEditBtn,.misDeleteBtn,.misInsertBtn').show();
						}
					}
				},	//在排序前執行的函數
				afterSort	 	: function(){}		//在排序後執行的函數
			},
			fixTbHead : {
				enabled			:'false',			//'true':固定表頭
				fixLeftColumns	: null,				//填寫數字，表格要固定的左邊欄位，從0開始
				tbBodyHeight	: '200px',			//固定表頭後，設定tbody的固定高度
				tbScroll_x		: 'false',			//固定表頭後,設定x軸方向可捲動
				tbScroll_x_width: '100%'			//固定表頭後,設定表格之固定寬度
			},
			toggleDetail : {
				enabled			: 'false',			//點選列後展開顯示明細
				notToggleColumn	: '',				//不可toggleDetail的欄位list 如:'.edit,.No,.td3'
				showDetail		: function(){}	//toggleDetail中要顯示的內容,$td : 點選到的td欄位物件
			},
			query				: 'false',			//查詢列，可查詢各欄位值，輸入字串後按下Enter開始查詢
			queryPosition		: 'top',			//top,bottom,both 查詢列位置
			afterSettingQuery	: function(){},
			update : {					//可新增刪除修改//檢查格式:date,number,decimal,money,phone,email,url,tax,invoice,ip
				enabled			: 'false',
				afterInit		: function(){},
				insert : {
					enabled			: 'true',			//可新增資料
					mustInputClass	: 'must',
					afterShowInsert	: function(){},
					afterCancelInsert	: function(){},
					beforeSave		: function(){},		//可自訂資料檢查，若 return false;則會中止儲存動作
					saveAjax		: function(){}
				},
				edit : {
					enabled			: 'true',
					mustInputClass	: 'must',
					editExcludedClass: 'editExcluded',	//不編輯之欄位List
					afterShowEdit	: function(){},
					afterCancelEdit	: function(){},
					beforeSave		: function(){},		//可自訂資料檢查，若 return false;則會中止儲存動作
					saveAjax		: function(){}
				},
				delete : {
					enabled			: 'true',
					appendAlertMsg	: '',							//詢問確認刪除資料時，附加詢問的訊息
					deleteAjax		: function(){}
				},
				insertBtnSrc	: '<i class="fa fa-plus-square fontAwesome-button" aria-hidden="true"></i>',
				editBtnSrc		: '<i class="fa fa-pencil-square-o fontAwesome-button" aria-hidden="true"></i>',
				deleteBtnSrc	: '<i class="fa fa-trash-o fontAwesome-button" aria-hidden="true"></i>',
				saveBtnSrc		: '<i class="fa fa-check fontAwesome-button" aria-hidden="true"></i>',
				cancelBtnSrc	: '<i class="fa fa-times fontAwesome-button" aria-hidden="true"></i>'
				/*
				insertBtnSrc	: '<img src="images/page-white-add-icon.png" class="image-button"/>',
				editBtnSrc		: '<img src="images/bedit.gif" class="image-button"/>',
				deleteBtnSrc	: '<img src="images/bdelete.gif" class="image-button"/>',
				saveBtnSrc		: '<img src="images/save-icon.png" class="image-button"/>',
				cancelBtnSrc	: '<img src="images/cancel-icon.png" class="image-button"/>'
				*/
			},
			pager : {
				enabled			: 'false',
				pageRowsList	: '10,15,20,30,40,50,100,200,All',
				pageRowsDefault	: '15',
				pagerClass		: 'total-blue',
				ajax : {
					enabled		: 'false',			//若為true,則按下表頭時會觸發doAjax function，而不會由misTable處理
					doAjax		: function(){}
				}
			},
			panel				: 'false',	//設定當滑鼠移至thead上方時，左上角會出現功能icon
			rowspan	: {							//必須停用sort及update才會套用
				column			: null,			//前幾欄若內容完全相同則合併列;如 1 :若第0欄及第1欄的內容皆相同則0,1欄皆合併列
				zebraMode		: 0,			//0:全部依合併列的奇偶排,1:合併列欄位與其他欄位分開排,2:複雜排法
				zebraClass		: 'Even-green', //當zebraMode=2時，奇數rowspan列套用之Class
				border			: 'false'		//右邊及下邊加邊框
			}
		};
		$.extend(true,defaults,options);
		return this.each(function(){
			//*****設定初值******************************
			if (options==undefined) options=defaults;
			var settings=defaults, $table=$(this);
			$table.find('tbody:first>tr').removeClass('misQueryHide').removeClass('misQueryShow').addClass('misQueryShow');
			zebra($table);
			var misLeftTableSize=$('.misLeftTable').size();
			if ($table.attr('id')==undefined) {
				var leftTableID='misLeftTable_'+misLeftTableSize;
			} else {
				var leftTableID='misLeftTable_'+$table.attr('id');
			}
			if(settings.panel=='true' && settings.fixTbHead.fixLeftColumns==null) {//設定Panel初值
				$table.find('thead').prepend('<div class="misTablePanel"><img class="misQueryBtn"  src="images/magnifier-left-icon.png"  title="'+lang.misTable0+'"/></div>');
				$table.find('.misTablePanel').offset({'top':$table.position().top-$('.misTablePanel').height()+2,'left':$table.position().left});
				$table.children('thead:first').hover(function(){
					$table.children('thead').children('.misTablePanel').show();
				}, function() {
					$table.children('thead').children('.misTablePanel').hide();
				});
				$table.find('.misTablePanel:first>.misQueryBtn').click(function(){$.fn.misTable.query($table)});
			}
			//for mobil
			if($(window).width()<=480){
				settings.fixTbHead.tbScroll_x='true';
			}
			
			if(settings.sort.ajax.enabled=='true') settings.sort.sortFirstTime='false';
			
			//*****設定獨立功能******************************
			//獨立設定zebra
			$.fn.misTable.zebra = function(evenClass,oddClass){
				$table.find('tbody:first').find('.misQueryShow').removeClass(settings.evenClass).removeClass(settings.oddClass);
				settings.zebra='true';
				settings.evenClass=evenClass;
				settings.oddClass=oddClass;
				zebra($table);
			}
			//獨立設定query
			$.fn.misTable.query = function($table,e){ //參數e:'true','false',未填寫則自動切換
				if(settings.queryPosition=='bottom' || settings.queryPosition=='both') {
					if(e==undefined) {
						if($table.children('tfoot').children('.misTableQuery').css('display')=='none') {
							e='true';
						} else {
							e='false';
						};
					}
				} else {
					if(e==undefined) {
						if($table.children('thead').children('.misTableQuery').css('display')=='none') {
							e='true';
						} else {
							e='false';
						};
					}
				}
				settings.query=e;
				if(e=='true') {//顯示查詢列
					if(settings.queryPosition=='bottom' && $table.children('tfoot').children('.misTableQuery').size()>0) {
						$table.children('tfoot').children('.misTableQuery').show();
					} else if(settings.queryPosition=='top' && $table.children('thead').children('.misTableQuery').size()>0) {
						$table.children('thead').children('.misTableQuery').show();
					} else if(settings.queryPosition=='both' && $table.children('thead').children('.misTableQuery').size()>0) {
						$table.children('thead').children('.misTableQuery').show();
						$table.children('tfoot').children('.misTableQuery').show();
					} else {
						query();
					}
				} else {//隱藏查詢列
					var hasQueryText='false';
					$table.children('tfoot').children('.misTableQuery').find('input').each(function(){
						if($(this).val()!='') {
							hasQueryText='true';
							$(this).val('');
						}
					});
					$table.children('thead').children('.misTableQuery').find('input').each(function(){
						if($(this).val()!='') {
							hasQueryText='true';
							$(this).val('');
						}
					});
					if(hasQueryText=='true') doMisQuery($table);
					$table.children('tfoot').children('.misTableQuery').hide();
					$table.children('thead').children('.misTableQuery').hide();
				}
			}
			//套用奇偶數列Class**************************
			function zebra($targetTable) {
				if(settings.zebra=='true'){
					$targetTable.find('tbody:first').find('.misQueryShow:even').removeClass(settings.evenClass).removeClass(settings.oddClass).addClass(settings.oddClass);
					$targetTable.find('tbody:first').find('.misQueryShow:odd').removeClass(settings.evenClass).removeClass(settings.oddClass).addClass(settings.evenClass);
					if(settings.highlightColumns.length>0) {
						highlightColumns($targetTable,settings.highlightColumns);
					}
				}
			};
			//highlight欄 *********************************
			function highlightColumns($table,columns) {
				var columns=columns.split(",")
				for (i = 0; i < columns.length; i++) { 
					$table.children('tbody').find('.misQueryShow:even').find('td:eq('+columns[i]+')').removeClass(settings.highlightEvenClass).removeClass(settings.highlightOddClass).addClass(settings.highlightEvenClass);
					$table.children('tbody').find('.misQueryShow:odd').find('td:eq('+columns[i]+')').removeClass(settings.highlightEvenClass).removeClass(settings.highlightOddClass).addClass(settings.highlightOddClass);
				}
				//highlight欄 Hover效果
				$table.children('tbody').find('.misQueryShow').hover(
					function () {
						for (i = 0; i < columns.length; i++) { 
							$(this).find('td:eq('+columns[i]+')').addClass("misHighlightColumnHover")
						}
					},  //MouseIn 
					function () {
						for (i = 0; i < columns.length; i++) { 
							$(this).find('td:eq('+columns[i]+')').removeClass("misHighlightColumnHover")
						}
					}//MouseOut
				);
			}
			//****資料編輯功能****************
			if(settings.update.enabled=='true' && !(settings.update.insert.enabled=='false' && settings.update.edit.enabled=='false' && settings.update.delete.enabled=='false')) {
				if(settings.update.insert.enabled=='true') {
					$table.find('thead>tr:first').append('<th class="misUpdate" style="width:47px;"><span class="misUpdateStatus"></span><span class="misInsertBtn" title="'+lang.misTable1+'">'+settings.update.insertBtnSrc+'</span></th>')
				} else {
					$table.find('thead>tr:first').append('<th class="misUpdate" style="width:47px;"><span class="misUpdateStatus"></span><span class="misInsertBtn">'+lang.misTable2+'</span></th>')
				}
				$table.find('.misInsert').append('<td class="misUpdate"><span class="misSaveBtn" title="'+lang.misTable3+'">'+settings.update.saveBtnSrc+'</span><span class="misCancelBtn" title="'+lang.misTable4+'">'+settings.update.cancelBtnSrc+'</span></td>');
				var editBtnStr='<span class="misEditBtn" title="'+lang.misTable2+'">'+settings.update.editBtnSrc+'</span>';
				var deleteBtnStr='<span class="misDeleteBtn" title="'+lang.misTable5+'">'+settings.update.deleteBtnSrc+'</span>';
				if(settings.update.edit.enabled=='false') editBtnStr='';
				if(settings.update.delete.enabled=='false') deleteBtnStr='';
				$table.find('tbody:first>tr').append('<td class="misUpdate">'+editBtnStr+deleteBtnStr+'</td>');
				$table.find('tfoot:first>tr').append('<td class="misUpdate"></td>');
				var updateBtnStr='';
				updateBtnStr=$table.find('tbody:first>tr:first>.misUpdate').html();
				var insTdArray=new Array(50);//$table.find('.misUpdate>td').size());
				$table.find('.misInsert>td').each(function(i) {
					insTdArray[i]=$(this).html();
				});
				settings.update.afterInit($table); 
				//Insert
				$table.find('.misInsertBtn').click(function(){//show
					var $thisRow=$table.find('.misInsert');
					$table.find('.misUpdateStatus').html(lang.misTable1);
					$table.find('.misInsert').show();
					$table.find('.misInsert').find('td').children().not('.mceEditor').show();
					$table.find('.misEditBtn,.misDeleteBtn,.misInsertBtn').hide();
					$table.find('tbody:eq(0) .detail').removeClass('detail');
					$table.find('tbody:eq(0) tr').removeClass('trSelected');
					$table.find('tbody:eq(0) .data-detail').remove();
					settings.update.insert.afterShowInsert($thisRow); 
				});
				//save 
				$table.find('.misInsert>td').delegate('.misSaveBtn','click',function() { //show
					if($table.html()==$(this).parents('table:first').html()) {//避免誤選到內層套用的misTable
						var $thisRow=$table.find('.misInsert');
						if(!checkInput('insert',$thisRow)) return;//檢查必填項目
						var valArray=new Array($thisRow.find('td').size());
						var txtArray=new Array($thisRow.find('td').size());
						$thisRow.find('td').each(function(i) {
							valArray[i]=$(this).children().val();
							if($(this).children().attr('type')=='checkbox') {
								$(this).children().prop('checked') ? valArray[i]=1:valArray[i]=0;
							}
							//for tiny-mce
							if($(this).children().hasClass('mce-tinymce')) {
								var mceID=$(this).find('iframe:first').attr('id');
								var $iframe = $('#'+mceID),$contents = $iframe.contents();
								valArray[i] = $contents.find('body').html();
								$(this).children().val(valArray[i]);
							}
							//for txtArray
							txtArray[i] = $(this).children().find('option:selected').text();
						});
						//beforeSave
						var continueSave=settings.update.insert.beforeSave($thisRow,valArray,txtArray); 
						if(continueSave==false) return;
						
						//複製插入列到tbody
						if($table.find('tbody>tr').size()>0) {
							$table.find('tbody').prepend($table.find('tbody>tr:first').clone());
						} else {
							$table.find('tbody').prepend($thisRow.clone().removeClass('misInsert').addClass('misQueryShow').removeAttr('data'));
							$table.find('tbody>tr:first>td:last').html(editBtnStr+deleteBtnStr);
							updateBtnStr=$table.find('tbody>tr:first>.misUpdate').html();
							//重新對齊td寬度
							$thisRow.find('td').each(function(i) {
								$table.find('tbody>tr:first>td').eq(i).outerWidth($(this).outerWidth());
							})
						}
						//修改插入到tbody的值
						$thisRow.find('td').each(function(i) {
							if($(this).find('select').size()>0) {
								$table.find('tbody>tr:first>td').eq(i).html($(this).children().find('option:selected').text()).attr('data',valArray[i]);
							} else if($(this).children().attr('type')=='checkbox') {
								if($(this).children().prop('checked')) {
									$table.find('tbody>tr:first>td').eq(i).children().attr('checked',true).val(true);
								} else {
									$table.find('tbody>tr:first>td').eq(i).children().removeAttr('checked');
								}
								$table.find('tbody>tr:first>td').eq(i).children().prop('disabled','true');
							} else if($(this).children().size()==0) {
								$table.find('tbody>tr:first>td').eq(i).html($(this).html());
							} else if($(this).hasClass('misUpdate')) {
								$table.find('tbody>tr:first>td').eq(i).html(updateBtnStr);
							} else {
								$table.find('tbody>tr:first>td').eq(i).html(valArray[i]);
							};
						});
						$thisRow.hide();
						//寫入db
						settings.update.insert.saveAjax(valArray,$thisRow);
						//還原insert列內容
						$thisRow.find('td').each(function(i) {
							$(this).html(insTdArray[i]);
						});
						zebra($table);
						$table.find('.misUpdateStatus').html('');
						$table.find('.misEditBtn,.misDeleteBtn,.misInsertBtn').show();
					}
				});
				//cancel
				$table.find('.misInsert>td').delegate('.misCancelBtn','click',function() { //show
					var $thisRow=$table.find('.misInsert');
					$table.find('.misUpdateStatus').html('');
					$table.find('.misInsert').hide();
					$table.find('.misEditBtn,.misDeleteBtn,.misInsertBtn').show();
					//還原insert列內容
					$thisRow.find('td').each(function(i) {
						$(this).html(insTdArray[i]);
					});
					settings.update.insert.afterCancelInsert($thisRow); 
				});
				//Edit
				$table.delegate('.misEditBtn','click',function() { //show
					if($table.html()==$(this).parents('table:first').html()) {//避免誤選到內層套用的misTable
						$table.find('.misUpdateStatus').html(lang.misTable2);
						$table.find('.misEditBtn,.misDeleteBtn,.misInsertBtn').hide();
						var $thisRow=$(this).parents('tr:first');
						var tdArray=new Array($thisRow.find('td').size());
						$thisRow.children('td').each(function(i) {
							tdArray[i]=$(this).html();
							var value=''
							var editExcludedClass=settings.update.edit.editExcludedClass;//*要排除編輯的欄位序號
							if(!$table.find('.misInsert:first>td').eq(i).hasClass(editExcludedClass)) {
								if($(this).children().attr('type')=='checkbox') {
									$(this).children().prop('disabled',false);//若是checkbox選項
								} else {
									$(this).attr('data')!=undefined ? value=$(this).attr('data'):value=$(this).html();
									$(this).html($table.find('.misInsert>td').eq(i).html());
									$(this).children().not('.misSaveBtn,.misCancelBtn').val(value).removeClass('hasDatepicker').removeAttr('id').css({'font-family':'微軟正黑體','font-size':'1em','width':'96%'});
								}
							};
							$(this).children().show();
						}); 
						settings.update.edit.afterShowEdit($thisRow); 
						//save edit
						$thisRow.find('.misSaveBtn').click(function(){
							if(!checkInput('edit',$thisRow)) return;//檢查必填項目
							var valArray=new Array($thisRow.find('td').size());
							var txtArray=new Array($thisRow.find('td').size());
							$thisRow.find('td').each(function(i) {
								if($(this).children().size()==0) {
									valArray[i]=$(this).html();
								} else {
									valArray[i]=$(this).children().val();
								};
								if($(this).children().attr('type')=='checkbox') {
									$(this).children().prop('checked') ? valArray[i]=1:valArray[i]=0;
								}
								//for tiny-mce
								if($(this).children().hasClass('mce-tinymce')) {
									var mceID=$(this).find('iframe:first').attr('id');
									var $iframe = $('#'+mceID),$contents = $iframe.contents();
									valArray[i] = $contents.find('body').html();
								}
								//for txtArray
								txtArray[i] = $(this).children().find('option:selected').text();
							});
							//beforeSave
							var continueSave=settings.update.edit.beforeSave($thisRow,valArray,txtArray); 
							if(continueSave==false) return;
							
							$thisRow.find('td').each(function(i) {
								//將輸入值寫回到row
								if($(this).find('select').size()>0) {
									$(this).html($(this).children().find('option:selected').text()).attr('data',valArray[i]);
								} else if($(this).children().attr('type')=='checkbox') {
									if( $(this).children().prop('checked') ) {
										$(this).children().removeAttr('checked').attr('checked',true).val(true);
									} else {
										$(this).children().removeAttr('checked');
									}
									$(this).children().prop('disabled','true');
								} else if($(this).hasClass('misUpdate')) {
									$(this).html(tdArray[i]);
								} else {
									$(this).html(valArray[i]);
								};
							});
							$table.find('.misUpdateStatus').html('');
							$table.find('.misEditBtn,.misDeleteBtn,.misInsertBtn').show();
							settings.update.edit.saveAjax(valArray,$thisRow);//user寫入資料庫
						});
						//cancel edit
						$thisRow.find('.misCancelBtn').click(function(){
							$thisRow.find('td').each(function(i) {
								$(this).html(tdArray[i]);
							}); 
							$table.find('.misUpdateStatus').html('');
							$table.find('.misEditBtn,.misDeleteBtn,.misInsertBtn').show();
							settings.update.edit.afterCancelEdit($thisRow); 
						});
						if($table.find('.data-detail').size()>0) {//點選編輯時已經展開Detail
							$table.find('.data-detail').remove();
							$table.find('.detail').removeClass('detail');
							$thisRow.removeClass('trSelected').addClass('trSelected');
						}
					}
				});
				//Delete
				$table.delegate('.misDeleteBtn','click',function() { //show
					if($table.html()==$(this).parents('table:first').html()) {//避免誤選到內層套用的misTable
						var $thisRow=$(this).parents('tr:first');
						$thisRow.addClass('misDeleteRow');
						if($table.find('.data-detail').size()>0) {//點選編輯時已經展開Detail
							$table.find('.data-detail').remove();
							$table.find('.detail').removeClass('detail');
							$thisRow.removeClass('trSelected').addClass('trSelected');
						}
						var alertMsg=lang.misTable6;
						if(settings.update.delete.appendAlertMsg!='') alertMsg=alertMsg+'\n ('+settings.update.delete.appendAlertMsg+')';
						if ( confirm(alertMsg) ){
							var thisRowIndex=$thisRow.index();
							settings.update.delete.deleteAjax($thisRow);
							$thisRow.remove();
							if(thisRowIndex==0) {//當固定表頭時，刪除第一列會造成td寬度錯誤
								$table.find('thead>tr:first>th').each(function(i){
									$table.find('tbody>tr>td').eq(i).outerWidth($(this).outerWidth());
								});
							};
							zebra($table);
						} else {
							$thisRow.removeClass('misDeleteRow trSelected');
						}
					}
				});
				//檢查資料
				function checkInput(type,$thisRow) {
					var isErr='false',errMsg='',$th=$table.find('thead>tr:first>th');
					var mustInputClass;
					if(type=='insert') mustInputClass=settings.update.insert.mustInputClass;//*必填的欄位序號;
					if(type=='edit') mustInputClass=settings.update.edit.mustInputClass;//*必填的欄位序號;
					$thisRow.find('td').each(function(i) {
						var $inputItem=$(this).children();
						//檢查必填項目
						var inputVal=$inputItem.val();
						if($(this).children().hasClass('mce-tinymce')) {//處理tinymce欄位
								var mceID=$(this).find('iframe:first').attr('id');
								var $iframe = $('#'+mceID),$contents = $iframe.contents();
								inputVal=$contents.find('body').html();
								if(inputVal=='<p><br data-mce-bogus="1"></p>') inputVal='';
						}
						if($inputItem.hasClass(mustInputClass) && (inputVal=='' || inputVal==null)) {
							isErr='true';
							errMsg=errMsg+'['+$th.eq(i).html()+lang.misTable7+']';
						}
						//檢查格式:date,number,decimal,money,phone,email,url,tax,invoice,ip
						if($inputItem.hasClass('date') && $inputItem.val()!='' && !isDate($inputItem.val())) {
							isErr='true';
							errMsg=errMsg+'['+$th.eq(i).html()+lang.misTable8+']';
						};
						if($inputItem.hasClass('number') && $inputItem.val()!='' && !isNumber($inputItem.val())) {
							isErr='true';
							errMsg=errMsg+'['+$th.eq(i).html()+lang.misTable8+']';
						};
						if($inputItem.hasClass('decimal') && $inputItem.val()!='' && !isDecimal($inputItem.val())) {
							isErr='true';
							errMsg=errMsg+'['+$th.eq(i).html()+lang.misTable8+']';
						};
						if($inputItem.hasClass('money') && $inputItem.val()!='' && !isMoney($inputItem.val())) {
							isErr='true';
							errMsg=errMsg+'['+$th.eq(i).html()+lang.misTable8+']';
						};
						if($inputItem.hasClass('phone') && $inputItem.val()!='' && !isPhoneNumber($inputItem.val())) {
							isErr='true';
							errMsg=errMsg+'['+$th.eq(i).html()+lang.misTable8+']';
						};
						if($inputItem.hasClass('email') && $inputItem.val()!='' && !isEMailAddress($inputItem.val())) {
							isErr='true';
							errMsg=errMsg+'['+$th.eq(i).html()+lang.misTable8+']';
						};
						if($inputItem.hasClass('url') && $inputItem.val()!='' && !isWebSiteUrl($inputItem.val())) {
							isErr='true';
							errMsg=errMsg+'['+$th.eq(i).html()+lang.misTable8+']';
						};
						if($inputItem.hasClass('tax') && $inputItem.val()!='' && !isTaxID($inputItem.val())) {
							isErr='true';
							errMsg=errMsg+'['+$th.eq(i).html()+lang.misTable8+']';
						};
						if($inputItem.hasClass('invoice') && $inputItem.val()!='' && !isInvoiceID($inputItem.val())) {
							isErr='true';
							errMsg=errMsg+'['+$th.eq(i).html()+lang.misTable8+']';
						};
						if($inputItem.hasClass('ip') && $inputItem.val()!='' && !isIP($inputItem.val())) {
							isErr='true';
							errMsg=errMsg+'['+$th.eq(i).html()+lang.misTable8+']';
						};
					});
					//顯示錯誤訊息
					if(isErr=='true') {
						alert(errMsg);
						return false;
					} else {
						return true;
					}
				};
			}

			//****query 查詢 ********************
			query();
			function query() {
				var htmlStr='<tr class="misTableQuery total-navy" style="width:100%;" title="'+lang.misTable9+'">';
				$table.find('thead:first>tr:eq('+settings.sort.sortHeadLineNo+')').children('th').each(function(i){
					var tdWidth=$(this).width()-4;
					var tdHeight=$(this).height()-4;
					if($(this).hasClass('misUpdate')) {
						htmlStr=htmlStr+'<td></td>';
					} else {
						htmlStr=htmlStr+'<td style="padding:0px;"><input type="text" value="" style="width:'+tdWidth+'px;height:'+tdHeight+'px;" placeholder="'+$(this).html()+'"/></td>';
					};
				});
				htmlStr=htmlStr+'</tr>';
				if(settings.queryPosition=='top' || settings.queryPosition=='both'){
					$table.children('thead').append(htmlStr);
				}
				if(settings.queryPosition=='bottom' || settings.queryPosition=='both'){
					if($table.children('tfoot').length==0) {//tfoot not found
						$table.append('<tfoot>'+htmlStr+'</tfoot>');
					}
					else {
						$table.children('tfoot').prepend(htmlStr);
					}
				}
				$('.misTableQuery').width($table.find('thead:first>tr:eq('+settings.sort.sortHeadLineNo+')').width()).find('input').css('font-size','1em');
				$table.find('.misTableQuery input').keyup(function(e){
					$table.children('thead').find('.misTableQuery input').eq($(this).parent().index()).val($(this).val());
					$table.children('tfoot').find('.misTableQuery input').eq($(this).parent().index()).val($(this).val());
					if (e.keyCode == 13 ) { //Enter key pressed
						$(this).blur();
					};
				});
				$table.find('.misTableQuery input').blur(function(e){
					$table.children('thead').find('.misTableQuery input').eq($(this).parent().index()).val($(this).val());
					$table.children('tfoot').find('.misTableQuery input').eq($(this).parent().index()).val($(this).val());
					doMisQuery($table);
				});
				settings.afterSettingQuery($table.find('.misTableQuery')); 
			}
			function doMisQuery($targetTable){
				var $leftTable=$('#'+leftTableID);
				var queryStr='';
				$targetTable.children('tbody').children('tr').removeClass('misQueryHide').removeClass('misQueryShow').addClass('misQueryShow');
				$leftTable.children('tbody').children('tr').removeClass('misQueryHide').removeClass('misQueryShow').addClass('misQueryShow');
				if(settings.queryPosition=='bottom' || settings.queryPosition=='both') {
					var qp='tfoot';
				} else {
					var qp='thead';
				}
				//同步兩邊查詢欄位之內容
				if(settings.fixTbHead.fixLeftColumns!=null) {
					$table.find(qp+':first>.misTableQuery input').each(function(i){//同步左邊
						if(i>settings.fixTbHead.fixLeftColumns) $leftTable.find(qp+'>.misTableQuery input:eq('+i+')').val($(this).val());
					});
					$leftTable.find(qp+':first>.misTableQuery input').each(function(i){//同步左邊
						if(i<=settings.fixTbHead.fixLeftColumns) $table.find(qp+'>.misTableQuery input:eq('+i+')').val($(this).val());
					});
				}
				if($targetTable.attr('id')!=$leftTable.attr('id')) {
					$targetTable.children(qp).children('.misTableQuery:first').find('input').each(function(i){
						queryStr=$(this).val();
						if(queryStr!=''){
							$targetTable.children('tbody').children('.misQueryShow').each(function(j){
								if($(this).find('td:eq('+i+'):contains('+queryStr+')').length==0) {
									$(this).removeClass('misQueryHide').removeClass('misQueryShow').addClass('misQueryHide');
								} 
							});
						}
					});
					//show,hide
					$targetTable.children('tbody').children('.misQueryHide').hide();
					$targetTable.children('tbody').children('.misQueryShow').show();
					$targetTable.children('tbody').children('.misQueryShow:first').children('td').each(function(i){
						$(this).outerWidth($targetTable.children('tbody').children('tr:first').children('td:eq('+i+')').outerWidth());
					})
					zebra($targetTable);
					if(settings.fixTbHead.fixLeftColumns!=null) {//右邊查詢同步左邊
						$targetTable.find(qp+':first>.misTableQuery input').each(function(i){
							queryStr=$(this).val();
							if(queryStr!=''){
								$leftTable.find('tbody:first>.misQueryShow').each(function(j){
									if($(this).find('td:eq('+i+'):contains('+queryStr+')').length==0) {
										$(this).removeClass('misQueryHide').removeClass('misQueryShow').addClass('misQueryHide');
									} 
								});
							}
						});
						//show,hide
						$leftTable.find('tbody:first>.misQueryHide').hide();
						$leftTable.find('tbody:first>.misQueryShow').show();
						zebra($leftTable);
					}
				};
				if($targetTable.attr('id')==$leftTable.attr('id')) {//左邊查詢同步右邊
					$targetTable.find(qp+':first>.misTableQuery input').each(function(i){
						queryStr=$(this).val();
						if(queryStr!=''){
							$targetTable.find('tbody:first>.misQueryShow').each(function(j){
								if($(this).find('td:eq('+i+'):contains('+queryStr+')').length==0) {
									$(this).removeClass('misQueryHide').removeClass('misQueryShow').addClass('misQueryHide');
								} 
							});
						}
					});
					//show,hide
					$targetTable.find('tbody:first>.misQueryHide').hide();
					$targetTable.find('tbody:first>.misQueryShow').show();
					zebra($targetTable);
					//同步右邊
					$table.find(qp+':first>.misTableQuery input').each(function(i){
						queryStr=$(this).val();
						if(queryStr!=''){
							$table.find('tbody:first>.misQueryShow').each(function(j){
								if($(this).find('td:eq('+i+'):contains('+queryStr+')').length==0) {
									$(this).removeClass('misQueryHide').removeClass('misQueryShow').addClass('misQueryHide');
								} 
							});
						}
					});
					//show,hide
					$table.find('tbody:first>.misQueryHide').hide();
					$table.find('tbody:first>.misQueryShow').show();
					zebra($table);
				}
				if(settings.pager.enabled=='true' && settings.query=='true') {
					$targetTable.children('tfoot').children('.misTablePager').find('.misPageRowsList').val('All');
					$targetTable.children('tfoot').children('.misTablePager').find('.misTotalPages').html(1);
					$targetTable.children('tfoot').children('.misTablePager').find('.misCurrentPage').html(1);
					$targetTable.children('tfoot').children('.misTablePager').find('.misPage').val(1);
					$targetTable.children('tfoot').children('.misTablePager').find('.misTotalRows').html($targetTable.children('tbody').find('.misQueryShow').size());
				}
				//query列隱藏若已設定pager要再執行一次
				if($targetTable.children('tfoot').children('tr').hasClass('misTablePager')  && settings.query!='true') {
					var totalRows=$targetTable.children('tbody').find('.misQueryShow').size();
					var totalPages=Math.ceil(totalRows/settings.pager.pageRowsDefault);
					$targetTable.children('tfoot').children('.misTablePager').find('.misPageRowsList').val(settings.pager.pageRowsDefault);
					$targetTable.children('tfoot').children('.misTablePager').find('.misTotalRows').html(totalRows);
					$targetTable.children('tfoot').children('.misTablePager').find('.misTotalPages').html(totalPages);
					changePage($targetTable.children('tfoot').children('.misTablePager').find('.misCurrentPage').html());
				}
			};
			//*******表頭固定功能****************
			if(settings.fixTbHead.enabled=='true') {
				var tbOrigWidth=$table.width();
				var tdWidth=new Array($table.find('thead:first>tr:first').children('th').size());
				var trHeight=new Array($table.find('tbody:first>tr').size());
				var browser=getBrowserInf();
				//暫存各column的原始寬度
				$table.find('thead:first>tr:first').children('th').each(function(i){
					tdWidth[i]=$(this).outerWidth();
				});
				if(settings.fixTbHead.tbScroll_x=='true') {
					$table.find('tbody:first>tr').each(function(i){
						trHeight[i]=$(this).outerHeight();
					});
				}
				//若設定X軸可捲動
				if(settings.fixTbHead.tbScroll_x=='true') {
					$table.css({'width':settings.fixTbHead.tbScroll_x_width,'display':'block'});
					$table.find('tr').not('.misInsert').css({'width':tbOrigWidth,'display':'block'});//配合update功能修改
					//同步tbody與thead,tfoot之捲動
					$table.find('tbody:first').scroll(function () { 
						$(this).parent().find('thead:first,tfoot:first').scrollLeft($(this).scrollLeft());
					});
					$table.find('thead:first,tfoot:first').css({'overflow-x':'hidden'});
					$table.find('tbody:first').css({'overflow-x':'scroll'});
					tbOrigWidth=settings.fixTbHead.tbScroll_x_width;
				}
				//將thead,tbody,tfoot設定成block，固定表頭
				$table.width(tbOrigWidth);
				$table.find('thead:first,tfoot:first').css({'display':'block','width':'100%','overflow-y':'scroll','scrollbar-track-color':'#DDD','scrollbar-arrow-color':'#DDD'});
				$table.find('tbody:first').css({'display':'block','width':'100%','overflow-y':'scroll','height':settings.fixTbHead.tbBodyHeight});
				
				var rowHeight=$table.find('tfoot:first>tr:first').height();
				//設定x軸可捲動後需要重新設定tr td的高度
				if(settings.fixTbHead.tbScroll_x=='true') {
					$table.find('tbody:first>tr').each(function(i){
						$(this).height(trHeight[i]).css('border','0px');
						$(this).children('td').outerHeight(trHeight[i]);
					});
					$table.find('tfoot:first>tr>td').css({'height':rowHeight});
				}
				//將column寬度套用至tbody
				if(settings.fixTbHead.tbScroll_x=='true') {
					$table.find('tbody:first>tr').each(function(){
						$(this).children('td').each(function(i){
							$(this).outerWidth(tdWidth[i]);
						});
					});
				} else {
					var firstStr='';
					if($table.find('tbody:first>tr').size()>50 && browser.type!='Chrome') firstStr=':first';
					$table.find('tbody:first>tr'+firstStr).each(function(){
						$(this).children('td').each(function(i){
							$(this).outerWidth(tdWidth[i]);
						});
					});
				}
				if(browser.type=='Firefox'){
					var tbodytrWidth=$table.find('tbody:first>tr:first').width();
					$table.find('thead:first>tr').width(tbodytrWidth);
					$table.find('tfoot:first>tr').width(tbodytrWidth);
					//重新抓一次column寬度，避免scroll bar造成的誤差
					if(settings.fixTbHead.tbScroll_x=='false') {
						$table.find('tbody:first>tr:first').children('td').each(function(i){
							tdWidth[i]=$(this).outerWidth();
						});
					}
				}
				//將column寬度套用至thead,tfoot
				$table.find('thead:first>tr:first').children('th').each(function(i){
					$(this).outerWidth(tdWidth[i]);
				});
				$table.find('tfoot:first>tr').each(function(){
					$(this).find('td').each(function(i){
						$(this).outerWidth(tdWidth[i]);
					});
				});
				if($table.children('thead').children('tr').size()==1) {
					$table.find('thead:first>tr>th').height($table.children('thead').height());
					//解決firfox的bug
				}
			}
			
			//****固定左邊欄位功能***************************************
			if(settings.fixTbHead.fixLeftColumns!=null) {
				var tableWidth=$table.width();
				//複製表格
				$table.parent().prepend('<div id="misLeftBox" style="overflow:hidden;border:0px;float:left;"></div><div id="misRightBox" style="overflow:hidden;border:0px;float:left;margin:0px 0px 0px 0px;"></div>');
				$('#misLeftBox').html($table.clone().attr('id',leftTableID));
				$('#misRightBox').html($table);
				var $leftTable=$('#'+leftTableID);
				var leftTableWidth=0;
				$table.find('thead:first>tr:first').children('th').each(function(i){
					if(i<=settings.fixTbHead.fixLeftColumns) {
						leftTableWidth=leftTableWidth+$(this).width();
						$(this).hide();
					}
				});
				if(settings.queryPosition=='top' || settings.queryPosition=='both'){
					$table.children('thead').children('.misTableQuery').children('td').each(function(i){
						if(i<=settings.fixTbHead.fixLeftColumns) {
							//leftTableWidth=leftTableWidth+$(this).width();
							$(this).hide();
						}
					});
				}
				$leftTable.find('tbody:first>tr').outerWidth(leftTableWidth);
				$table.find('thead:first>tr').outerWidth($table.find('thead:first>tr').width()-leftTableWidth);
				$table.find('tbody:first>tr').each(function(){
					$(this).children('td').each(function(i){
						if(i<=settings.fixTbHead.fixLeftColumns) $(this).hide();
					});
				});
				$leftTable.find('tbody:first>tr').each(function(){
					$(this).children('td').each(function(i){
						if(i>settings.fixTbHead.fixLeftColumns) $(this).hide();
					});
				});
				$table.find('tbody:first>tr,tfoot:first>tr').width($table.find('tbody:first>tr').width()-leftTableWidth);
				$table.find('tfoot:first>tr').each(function(){
					$(this).children('td').each(function(i){
						if(i<=settings.fixTbHead.fixLeftColumns) $(this).hide();
					});
				});
				var browser=getBrowserInf();
				var widthAdjust=0;
				if(browser.type=='Firefox' || browser.type=='Chrome' ) widthAdjust=20;//調整捲軸造成寬度錯誤之問題
				$('#misLeftBox').outerWidth(leftTableWidth);
				$('#misRightBox').outerWidth(tableWidth-leftTableWidth-widthAdjust);
				$('#misRightBox').outerWidth($('#misRightBox').outerWidth()+widthAdjust-1);
				$leftTable.find('thead:first,tfoot:first').css({'overflow-y':'hidden','overflow-x':'hidden'});
				$leftTable.find('tbody:first').css({'overflow-y':'hidden','overflow-x':'scroll'});
				
				$('.plate').height($('.plate').height()+$table.height());//彌補因為table設定成float後減少之高度
				//捲動同步
				$table.find('tbody:first').scroll(function () { 
					$leftTable.find('tbody:first').scrollTop($(this).scrollTop());
				});
				//Query同步left coloum 
				if(settings.query=='false') $leftTable.find('.misTableQuery').hide();
				$leftTable.find('.misTableQuery input').keyup(function(e){
					$leftTable.children('thead').find('.misTableQuery input').eq($(this).parent().index()).val($(this).val());
					$leftTable.children('tfoot').find('.misTableQuery input').eq($(this).parent().index()).val($(this).val());
					if (e.keyCode == 13 ) { //Enter key pressed
						$(this).blur();
					};
				});
				$leftTable.find('.misTableQuery input').blur(function(e){
					$leftTable.children('thead').find('.misTableQuery input').eq($(this).parent().index()).val($(this).val());
					$leftTable.children('tfoot').find('.misTableQuery input').eq($(this).parent().index()).val($(this).val());
					doMisQuery($leftTable);
				});
				//列點選效果同步
				$table.find('tbody:first>tr').click(function() {
					var $click=$leftTable.find('tbody:first>tr:eq('+$(this).index()+')');
					$click.parent().find('tr').not($click).removeClass('trSelected');
					$click.toggleClass('trSelected');
				});
				$leftTable.find('tbody:first>tr').click(function() {
					$(this).toggleClass('trSelected').parent().find( '.trSelected' ).not($(this)).removeClass('trSelected');
					var $click=$table.find('tbody:first').children('tr:eq('+$(this).index()+')');
					$click.toggleClass('trSelected').parent().find( '.trSelected' ).not($click).removeClass('trSelected');
					//$table.find('.data-detail').remove();
				});
				//列hover同步
				$table.find('tbody:first>tr').hover(
					function () {
						$leftTable.find('tbody:first>tr:eq('+$(this).index()+')').addClass("trHover");
					},   
					function () {    
						$leftTable.find('tbody:first>tr:eq('+$(this).index()+')').removeClass("trHover");
					}
				);	
				$leftTable.find('tbody:first>tr').hover(
					function () {
						$table.find('tbody:first>tr:eq('+$(this).index()+')').addClass("trHover");
					},   
					function () {    
						$table.find('tbody:first>tr:eq('+$(this).index()+')').removeClass("trHover");
					}
				);	
			};
			
			//****toggleDetail功能(點選觸發插入下一列顯示明細)當固定右邊欄位時停用此功能***********
			if(settings.toggleDetail.enabled=='true' && settings.fixTbHead.fixLeftColumns==null) {
				$table.find('tbody:first').children('tr').children('td').not(settings.toggleDetail.notToggleColumn).not('.misUpdate').css('cursor','pointer');
				$table.find('tbody:first').children('tr').children('td').not(settings.toggleDetail.notToggleColumn).not('.misUpdate').click(function(){
					if(tgDetail=='true' && ($table.find('.misUpdateStatus').html()=='' || $table.find('.misUpdateStatus').html()==null)){//編輯中不可toggleDetail
						var columnCnt=$(this).parent().find('td').size();
						var firstTime='true';
						if(settings.tdSelect=='true') {
							if($(this).parent().hasClass('detail') && $(this).hasClass('tdSelected')) firstTime='false';	
						} else {
							if($(this).parent().hasClass('detail')) firstTime='false';
						}
						$(this).parent().parent().find('.detail').removeClass('detail');
						if(firstTime=='true') $(this).parent().addClass('detail');
						$table.find('.data-detail').remove();
						if($(this).parent().hasClass('detail')){
							if(settings.fixTbHead.tbScroll_x=='true') { //若設定右邊欄位固定 ，要設定toggleDetail>>display:block
								var htmlStr='<tr class="data-detail" style="display:block;"><td colspan="'+columnCnt+'" class="data-detail-td" style="display:block;"><div class="detailTd"></div></td></tr>';
							} else {
								var htmlStr='<tr class="data-detail"><td colspan="'+columnCnt+'" class="data-detail-td"><div class="detailTd"></div></td></tr>';
							}
							$(htmlStr).insertAfter($(this).parent());
							settings.toggleDetail.showDetail($table.find('.detailTd'),$(this));
							$table.find('.data-detail').show();
						};
					};
				});
			}
			
			//*****排序功能******************************
			//設定點選表頭後觸發排序事件
			if(settings.sort.enabled=='true') {
				$('body').remove('.misSetTimeOut').append('<div class="misSetTimeOut"></div>');
				$table.find('thead:first>tr:eq('+settings.sort.sortHeadLineNo+')>th').not(settings.sort.notSortColumn).not('.misUpdate').click(function() {
					settings.sort.beforeSort($(this),settings.toggleDetail.enabled);
					misTableSort($table,$(this),$(this).index(),settings.sort.ascDesc,settings.evenClass,settings.oddClass);
					if(settings.fixTbHead.fixLeftColumns!=null) { //若左邊欄位固定，點右邊時要同步左邊排序
						var $leftTable=$('#'+leftTableID);
						misTableSort($leftTable,$leftTable.find('thead:first>tr:eq('+settings.sort.sortHeadLineNo+')>th:eq('+$(this).index()+')'),$(this).index(),settings.sort.ascDesc,settings.evenClass,settings.oddClass);
					}
					settings.sort.afterSort($(this));
				});
				if(settings.fixTbHead.fixLeftColumns!=null) { //若左邊欄位固定，點左邊時要同步右邊排序
					var $leftTable=$('#'+leftTableID);
					$leftTable.find('thead:first>tr:eq('+settings.sort.sortHeadLineNo+')>th').not(settings.sort.notSortColumn).click(function() {
						settings.sort.beforeSort($(this),settings.toggleDetail.enabled);
						misTableSort($leftTable,$(this),$(this).index(),settings.sort.ascDesc,settings.evenClass,settings.oddClass);
						//同步右邊排序
						misTableSort($table,$table.find('thead:first>tr:eq('+settings.sort.sortHeadLineNo+')>th:eq('+$(this).index()+')'),$(this).index(),settings.sort.ascDesc,settings.evenClass,settings.oddClass);
						settings.sort.afterSort($(this));
					});
				}
				$table.find('thead:first>tr:eq('+settings.sort.sortHeadLineNo+')>th').not(settings.sort.notSortColumn).css('cursor','pointer');
				//第一次設定時執行排序
				if(settings.sort.sortFirstTime=='true'){
					misTableSort($table,$table.find('thead:first>tr:eq('+settings.sort.sortHeadLineNo+')>th:eq('+settings.sort.sortColumn+')'),settings.sort.sortColumn,settings.sort.ascDesc,settings.evenClass,settings.oddClass);
					if(settings.fixTbHead.fixLeftColumns!=null) { //若左邊欄位固定，要同步左邊排序
						var $leftTable=$('#'+leftTableID);
						misTableSort($leftTable,$table.find('thead:first>tr:eq('+settings.sort.sortHeadLineNo+')>th:eq('+settings.sort.sortColumn+')'),settings.sort.sortColumn,settings.sort.ascDesc,settings.evenClass,settings.oddClass);
					}
				} else {
					$table.find('thead:first>tr:eq('+settings.sort.sortHeadLineNo+')>th:eq('+settings.sort.sortColumn+')').removeClass('sorting').addClass(settings.sort.ascDesc);
				}
			};
			
			//執行排序
			function misTableSort($table,$thisObj,sortColumn,ascDesc,evenClass,oddClass) {
				//顯示排序圖示
				if ($thisObj.hasClass('asc')) {
					ascDesc='desc';
				} else if ($thisObj.hasClass('desc')){
					ascDesc='asc';
				} else if($thisObj.parent().find('th').not($thisObj).hasClass('asc')){//前次點選欄位為Desc則維持Desc
					ascDesc='asc';
				} else if($thisObj.parent().find('th').not($thisObj).hasClass('desc')){//前次點選欄位為Desc則維持Desc
					ascDesc='desc';
				};
				$thisObj.parent().find('th').removeClass('asc desc');
				$thisObj.addClass('sorting');
				if(settings.sort.ajax.enabled=='true') {
					settings.sort.ajax.doAjax(sortColumn,ascDesc);
				} else {
					$('.misSetTimeOut').toggle(10,function(){
						//開始排序
						var $tbody = $table.find('tbody:first'),$tbodytr = $tbody.children('tr');
						//判斷是否為int,decimail,money,%
						var money='true';
						$tbodytr.find('td:eq('+sortColumn+')').each(function(i) { 
							if(!isMoney($(this).html().replace('%','').replace(/^-/g,'')) && $(this).html()!='') money='false';
						}); 
						$tbodytr.sort(function(a,b){
							if(ascDesc=='asc'){
								var an = $(a).find('td:eq('+sortColumn+')').html(),
									bn = $(b).find('td:eq('+sortColumn+')').html();
							} else {
								var bn = $(a).find('td:eq('+sortColumn+')').html(),
									an = $(b).find('td:eq('+sortColumn+')').html();
							}
							if( money=='true') {
								an=an.replace(/,/g,'').replace('%','')*1;
								bn=bn.replace(/,/g,'').replace('%','')*1;
							}
							if(an > bn) return 1;
							if(an < bn) return -1;
							return 0;
						});
						$tbodytr.detach().appendTo($tbody);
						//已分頁
						if(settings.pager.enabled=='true') {
							$table.children('tfoot').find('.misPage').val(1);
							$table.children('tfoot').children('.misTablePager').find('.misCurrentPage').html(1);
							changePage(1);
						}
						$table.find('tbody:first>.misQueryShow:first>td').each(function(i){
							$(this).outerWidth($table.find('thead:first>tr:first>th:eq('+i+')').outerWidth());
						})
						//單雙數行套格式
						zebra($table);
						$thisObj.removeClass('sorting').addClass(ascDesc);
						if(settings.fixTbHead.fixLeftColumns!=null) { //若左邊欄位固定，要同步排序
							var $leftTable=$('#'+leftTableID);
							zebra($leftTable);
						}
					});
				}
			}
			//****表格列點選效果****************
			if(settings.trSelect=='true' && settings.tdSelect=='false') {
				$table.find('tbody:first>tr>td').not(settings.toggleDetail.notToggleColumn).click(function() {
					var $selTr=$(this).parent();
					//不在編輯中，或編輯中點選的是編輯按鈕才執行點選效果
					if(!(settings.update.enabled=='true' && ($table.find('.misUpdateStatus').html()!='' && $table.find('.misUpdateStatus').html()!=null))) {
						if(!$selTr.hasClass('data-detail') && !$selTr.hasClass('noSelect')) $selTr.toggleClass('trSelected').parent().find( '.trSelected' ).not($selTr).removeClass('trSelected');
					}
					if(settings.highlightColumns.length>0) {//for highlightColumn
						var columns=settings.highlightColumns.split(",");
						if($selTr.hasClass('trSelected')){
							for (i = 0; i < columns.length; i++) { 
								$selTr.find('td:eq('+columns[i]+')').addClass('trSelected');
							}
						}
					}
				});
			}
			
			//****表格欄點選效果****************
			if(settings.tdSelect=='true') {
				$table.find('tbody:first>tr>td').not(settings.toggleDetail.notToggleColumn).click(function() {
					var $selTr=$(this).parent();
					if(!$selTr.hasClass('data-detail') && !$selTr.hasClass('noSelect') ) {
						if($selTr.hasClass('trSelected')) {//點選同一列,
							if($(this).hasClass('tdSelected')) {//同一欄
								$selTr.parent().find( '.trSelected' ).removeClass('trSelected'); //取消列選取
							} 
						} else {//點選不同列
							$selTr.toggleClass('trSelected').parent().find( '.trSelected' ).not($selTr).removeClass('trSelected');
						}
					}
					if(!$(this).hasClass('data-detail') && !$(this).hasClass('noSelect')) {
						$(this).toggleClass('tdSelected').parent().parent().find( '.tdSelected' ).not(this).removeClass('tdSelected');
					}
					if(settings.highlightColumns.length>0) {//for highlightColumn
						var columns=settings.highlightColumns.split(",");
						if($selTr.hasClass('trSelected')){
							for (i = 0; i < columns.length; i++) { 
								$selTr.find('td:eq('+columns[i]+')').addClass('trSelected');
							}
						}
					}
				});
			}
			
			//*****分頁功能***********************
			var pagerChanged='false';
			if(settings.pager.enabled=='true') {
				var pageOptionStr='';
				var pageRowsListArray=settings.pager.pageRowsList.split(",");
				var totalRows=$table.find('tbody:first>tr').size();
				if(settings.pager.ajax.enabled=='true') {
					totalRows=$table.find('tbody').attr('data_pageSize');
				}
				var totalPages=Math.ceil(totalRows/settings.pager.pageRowsDefault);
				var pageStr='';
				for(i=1;i<=totalPages;i++) {
					pageStr=pageStr+'<option value="'+i+'">'+i+'</option>';
				}
				for(key in pageRowsListArray) {
					pageOptionStr=pageOptionStr+'<option value="'+pageRowsListArray[key]+'">'+pageRowsListArray[key]+'</opton>';
				}
				var pagerStr='<tr class="misTablePager '+settings.pager.pagerClass+'"><td colspan="'+$table.find('thead>tr:first>th').size()+'"><table style="width:100%;"><tr>'+
								'<td style="width:35%;text-align:left;border:0px;">'+lang.misTable10+'<select class="misPageRowsList">'+pageOptionStr+'</select>'+lang.misTable12+'/'+lang.misTable11+' <span class="misTotalRows">'+totalRows+'</span> '+lang.misTable12+'</td>'+
								'<td style="width:30%;text-align:center;border:0px;">'+
									'<img class="misFirstPage misPageIcon" src="images/firstPage.png" style="cursor:pointer;" title="'+lang.misTable13+'">'+
									'<img class="misPreviousPage misPageIcon" src="images/previousPage.png" style="cursor:pointer;" title="'+lang.misTable14+'">'+
									'<span class="misCurrentPage misPageIcon">1</span>'+
									'<img class="misNextPage misPageIcon" src="images/nextPage.png" style="cursor:pointer;"  title="'+lang.misTable15+'">'+
									'<img class="misLastPage misPageIcon" src="images/lastPage.png" style="cursor:pointer;" title="'+lang.misTable16+'">'+
								'</td>'+
								'<td style="width:35%;text-align:right;border:0px;">'+lang.misTable17+'<select class="misPage">'+pageStr+'</select>'+lang.misTable18+'/'+lang.misTable11+' <span class="misTotalPages">'+totalPages+'</span> '+lang.misTable18+'</td>'+
							'</tr></table></td></tr>';
				if($table.find('tfoot').length==0) {//tfoot not found
					$table.append('<tfoot>'+pagerStr+'</tfoot>');
				} else {
					$table.find('tfoot:first').append(pagerStr);
				}
				if(settings.fixTbHead.fixLeftColumns==null) {
					$('.misTablePager table tr:first>td').each(function(i){
						$(this).width($(this).width());
					});
				} else {
					$('.misTablePager').parent().css('display','block');
					$('.misTablePager').css('display','block');
					$('.misTablePager>td').css('display','block');
					$('.misTablePager').css('width','100%');
					$('.misTablePager table tr:first td:eq(0)').css('width','40%');
					$('.misTablePager table tr:first td:eq(1)').css('width','20%');
					$('.misTablePager table tr:first td:eq(2)').css('width','40%');
				}
				$table.children('tfoot').children('.misTablePager').find('.misPageRowsList').val(settings.pager.pageRowsDefault);
				$table.children('tfoot').children('.misTablePager').find('.misFirstPage').click(function(){
					var pageNum=$table.children('tfoot').find('.misPage').val()*1;
					if(pageNum==1) return;
					changePage(1);
				});
				$table.children('tfoot').children('.misTablePager').find('.misPreviousPage').click(function(){
					var pageNum=$table.children('tfoot').find('.misPage').val()*1;
					if(pageNum==1) return;
					pageNum--;
					if(settings.pager.ajax.enabled=='true') {
						pageNum=$table.find('tbody').attr('data_pageNumber')*1-1;
					}
					if(pageNum<1) pageNum=1;
					changePage(pageNum);
				});
				$table.children('tfoot').children('.misTablePager').find('.misNextPage').click(function(){
					var pageNum=$table.children('tfoot').find('.misPage').val()*1;
					var totalPages=$table.children('tfoot').children('.misTablePager').find('.misTotalPages').html();
					if(pageNum==totalPages || totalPages<=1) return;
					pageNum++;
					if(settings.pager.ajax.enabled=='true') {
						pageNum=$table.find('tbody').attr('data_pageNumber')*1+1;
					}
					var totalPages=$table.children('tfoot').children('.misTablePager').find('.misTotalPages').html();
					if(pageNum>totalPages) pageNum=totalPages;
					changePage(pageNum);
				});
				$table.children('tfoot').children('.misTablePager').find('.misLastPage').click(function(){
					var pageNum=$table.children('tfoot').find('.misPage').val()*1;
					var totalPages=$table.children('tfoot').children('.misTablePager').find('.misTotalPages').html();
					if(pageNum==totalPages || totalPages<=1) return;
					changePage(totalPages);
				});
				$table.children('tfoot').children('.misTablePager').find('.misPageRowsList,.misPage').change(function(){
					var totalRows=$table.children('tbody').children('tr').not('.misQueryHide').size();
					if($(this).attr('class')=='misPageRowsList') {
						$table.children('tfoot').find('.misPage').val(1);
						$table.children('tfoot').children('.misTablePager').find('.misCurrentPage').html(1);
						if($table.children('tfoot').children('.misTablePager').find('.misPageRowsList').val()=='All') {
							var totalPages=1;
						} else {
							var totalPages=Math.ceil(totalRows/$table.children('tfoot').children('.misTablePager').find('.misPageRowsList').val());
						}
						$table.children('tfoot').children('.misTablePager').find('.misTotalPages').html(totalPages);
						var pageStr='';
						for(i=1;i<=totalPages;i++) {
							pageStr=pageStr+'<option value="'+i+'">'+i+'</option>';
						}
						$table.children('tfoot').find('.misPage').html(pageStr);
					}
					changePage($table.children('tfoot').find('.misPage').val())
				});
				setTimeout(function() { //避免直接執行造成thead與tbody可能對不齊的錯誤。
					changePage(1);
				}, 1);
			};
			function changePage(page) {
				if(settings.toggleDetail.enabled=='true' && settings.fixTbHead.fixLeftColumns==null) {
					$table.children('tbody').find('.data-detail').remove();//分頁前先關閉toggleDetail
				}
				var rows=$table.children('tfoot').children('.misTablePager').find('.misPageRowsList').val();
				if(rows=='All') rows=$table.children('tbody:first').children('tr').size();
				if(settings.pager.ajax.enabled=='true' && pagerChanged=='true') {
					settings.pager.ajax.doAjax(page,$table.children('tfoot').children('.misTablePager').find('.misPageRowsList').val());
				} else {
					$table.children('tbody').children('.misQueryShow').removeClass('misPagerHide').removeClass('misPagerShow').hide();
					$table.children('tbody').children('.misQueryShow').each(function(i){
						if(i>=(page-1)*rows && i<page*rows) $(this).addClass('misPagerShow').show();
					});
					$table.children('tbody').children('.misPagerShow').not('.misQueryHide').find('td').each(function(i){
						$(this).outerWidth($table.children('thead').children('tr:first').find('th:eq('+i+')').outerWidth());
					})
					//若左邊欄位固定
					if(settings.fixTbHead.fixLeftColumns!=null) { 
						$('#'+leftTableID).children('tbody').children('.misQueryShow').removeClass('misPagerHide').removeClass('misPagerShow').hide();
						$('#'+leftTableID).children('tbody').children('.misQueryShow').each(function(i){
							if(i>=(page-1)*rows && i<page*rows) $(this).addClass('misPagerShow').show();
						});
						$('#'+leftTableID).children('tbody').children('.misPagerShow').not('.misQueryHide').find('td').each(function(i){
							$(this).outerWidth($('#'+leftTableID).children('thead').children('tr:first').find('th:eq('+i+')').outerWidth());
						})
					}
				}
				var pageNum=page;
				if(settings.pager.ajax.enabled=='true') {
					pageNum=$table.find('tbody').attr('data_pageNumber');
				}
				$table.children('tfoot').children('.misTablePager').find('.misCurrentPage').html(pageNum);
				$table.children('tfoot').find('.misPage').val(pageNum);
				if(pageNum==1) {
					$table.children('tfoot').find('.misFirstPage').attr('src','images/firstPage.png').css('cursor','default');
					$table.children('tfoot').find('.misPreviousPage').attr('src','images/previousPage.png').css('cursor','default');
				} else {
					$table.children('tfoot').find('.misFirstPage').attr('src','images/firstPage_blue.png').css('cursor','pointer');
					$table.children('tfoot').find('.misPreviousPage').attr('src','images/previousPage_blue.png').css('cursor','pointer');
				}
				var totalPages=$table.children('tfoot').children('.misTablePager').find('.misTotalPages').html();
				if(pageNum==totalPages || totalPages<=1) {
					$table.children('tfoot').find('.misLastPage').attr('src','images/lastPage.png').css('cursor','default');
					$table.children('tfoot').find('.misNextPage').attr('src','images/nextPage.png').css('cursor','default');
				} else {
					$table.children('tfoot').find('.misLastPage').attr('src','images/lastPage_blue.png').css('cursor','pointer');
					$table.children('tfoot').find('.misNextPage').attr('src','images/nextPage_blue.png').css('cursor','pointer');
				}
				$table.children('tbody').scrollTop(0);
				pagerChanged='true';
			}
			if(settings.query!='true') {
				$table.find('.misTableQuery').hide();
			}
			
			//****rowspanColumn****************
			if(settings.rowspan.column != null && settings.sort.enabled!='true' && settings.update.enabled!='true'){
				rowspan($table)
			}
			function rowspan($table) {
				var rowspanColumn=settings.rowspan.column;
				var rsc=new Array(rowspanColumn);
				var lastrsc=new Array(rowspanColumn);
				var isSame,rowspan,evenOdd,$thisRow,$preRow,$lastRow;
				$table.children('tbody').find('.misQueryShow').each(function(i){
					isSame='true';
					$thisRow=$(this);
					for(j=0;j<=rowspanColumn;j++) {
						rsc[j]=$(this).find('td:eq('+j+')').html();
						if(rsc[j]!=lastrsc[j]) isSame='false';
					}
					if(isSame=='false'){//記錄不同列
						$lastRow=$(this);
						$lastRow.addClass('misRowspan');
						rowspan=1;
						evenOdd=(evenOdd=='misRowspanOdd') ? 'misRowspanEven':'misRowspanOdd';
						$lastRow.addClass(evenOdd);
						for(j=0;j<=rowspanColumn;j++) {
							lastrsc[j]=rsc[j];
							$lastRow.find('td:eq('+j+')').addClass('misRowspanTd');
							if(settings.rowspan.border=='true') $lastRow.find('td:eq('+j+')').addClass('misBorderBottom');
							if(j==rowspanColumn && settings.rowspan.border=='true') {
								$lastRow.find('td:eq('+j+')').addClass('misBorderRight'); 
							}
						}
						if($preRow!=undefined && settings.rowspan.border=='true') $preRow.children('td').removeClass('misBorderBottom').addClass('misBorderBottom');
					} else {//合併列
						rowspan++;
						$thisRow.addClass(evenOdd);
						if(settings.rowspan.zebraMode==2 && rowspan % 2 == 0) $thisRow.addClass('zebraOdd');
						for(j=0;j<=rowspanColumn;j++) {
							$lastRow.find('td:eq('+j+')').attr('rowspan',rowspan);
							$thisRow.find('td:eq(0)').remove();//因為前面的已經被remove所以每次都是移除第一個
						}
					}
					$preRow=$thisRow;
					if(i+1==$table.children('tbody').find('.misQueryShow').size() && settings.rowspan.border=='true') $thisRow.children('td').removeClass('misBorderBottom').addClass('misBorderBottom');//最後一列
				})
				//zebraMode
				if(settings.rowspan.zebraMode==0){
					$table.children('tbody').find('.misQueryShow').removeClass(settings.evenClass).removeClass(settings.oddClass);
					$table.children('tbody').find('.misRowspanEven').addClass(settings.evenClass);
					$table.children('tbody').find('.misRowspanOdd').addClass(settings.oddClass);
				}
				if(settings.rowspan.zebraMode==1){
					$table.children('tbody').find('.misRowspan:odd>.misRowspanTd').addClass(settings.evenClass);
					$table.children('tbody').find('.misRowspan:even>.misRowspanTd').addClass(settings.oddClass);
				}
				if(settings.rowspan.zebraMode==2){
					$table.children('tbody').find('.misRowspanEven').addClass(settings.evenClass);
					$table.children('tbody').find('.misRowspanOdd').addClass(settings.rowspan.zebraClass);
					$table.children('tbody').find('.zebraOdd').removeClass(settings.evenClass).removeClass(settings.rowspan.zebraClass).addClass(settings.oddClass);
				}
			}
			if(settings.fixTbHead.enabled=='true' && $table.find('thead:first .misTableQuery').css('display')=='none' && browser.type=='Firefox') {
				$table.find('thead:first>tr>th').height($table.children('thead').height()-4);//解決firfox的bug
			}
		});
	};
})(jQuery);
  
function fomatMoney(money){
	if(/[^0-9\.]/.test(money)) return money;
	money=money+'.';
	money=money.replace(/^(\d*)$/,"$1.");
	money=(money+"00").replace(/(\d*\.\d\d)\d*/,"$1");
	money=money.replace(".",",");
	var re=/(\d)(\d{3},)/;
	while(re.test(money)){
	  money=money.replace(re,"$1,$2");
	}
	money=money.replace(/,(\d\d)$/,".$1").replace('.00','');
	return money.replace(/^\./,"0.")
}

function showSaving($thisRow) {
	$thisRow.find('.misUpdate').addClass('saving').children().hide();
}
function hideSaving($thisRow) {
	$thisRow.find('.misUpdate').removeClass('saving').children().show();
}
//----------------------------

