/*
13 Octobre 2014: added check for already logged user
*/

var	root="lib/mylogin/";
var MyLoginWidget = {
	username:"",
	loggedin:0,
	subscribers:new Array(),
	init: function() {
		var	me=this;
		var def=$.Deferred();
		
		//$(document.body).append("<div id='login'></div>");
		
//		$("div#login").load(root+"login.html",function() {
		$.get(root+"login.html", function(html) {
			$.get(root+"login.php",{"action":"check"},function(data){
				console.log(data);
				try {
					var msg=JSON.parse(data);
				} catch(e) {
					$("div#login").html(html);
					me.displayLoginLink();
					return;
				}
			
				if(msg.response=="Yes")
				{
					$("div#login").html(html);
					me.username=msg.username;
					me.loggedin=1;
					me.displayLoggedinLink();
				}
				else
				{
					$("div#login").html(html);
					me.displayLoginLink();
					me.displayLoginForm();
				}
				if(me.subscribers[0])
					me.subscribers[0](); // inform subscribers of login change
				
				def.resolve();
			});
		});
		
		return def.promise();
	},
	displayLoginLink: function() {
		$("div#login >").addClass("hidden");
		$("div#login a#loginLink").removeClass("hidden");
		$("div#login #warning").removeClass("hidden");
	},
	displayLoginForm: function() {
		$("div#login >").addClass("hidden");
		$("div#login #username").attr("placeholder","Nombre o email");
		$("div#login > #pleaseLogIn, #username, #password, #sendLogin, #cancel, #registerLink, #remind,#warning").removeClass("hidden");
		$("div#login").addClass("loginbox");
	},
	displayLoggedinLink: function() {
		$("div#login >").addClass("hidden");
		$("div#login span#loggedinLink").removeClass("hidden");
		$("div#login #warning").removeClass("hidden");
		$("div#login a#user").html(this.username);
		$("div#login a#user").attr("href","/user/"+this.username);
	},
	displayRegisterForm: function() {
		$("div#login >").addClass("hidden");
		$("div#login #username").attr("placeholder","Name");
		$("div#login > #pleaseLogIn, #username, #e-mail, #password, #repassword, #cancel, #register,#warning").removeClass("hidden");
	},
	sendLogin: function() {
		var	me=this;
		$.get(root+"login.php",{"action":"login","username":$("#username").val(),"password":$("#password").val()},function(data){
			try {
				var msg=JSON.parse(data);
			} catch(e) {
				console.log("Error: cannot parse logout response json",data);
				return;
			}

			if(msg.response=="Yes")
			{
				me.username=$("#username").val();
				me.loggedin=1;
				me.displayLoggedinLink();
				$("div#login #warning").html("Bienvenid@ " + me.username).fadeIn();
				setTimeout(function() {
					$("div#login #warning").fadeOut(500,function() {
						$("div#login").removeClass("loginbox");
					});
				},2000);
				if(me.subscribers[0])
					me.subscribers[0](); // inform subscribers of login change
			}
			else
			{
				me.loggedin=0;
				$("div#login #warning").html("Incorrecto, inténtalo de nuevo por favor.").fadeIn();
				setTimeout(function(){$("div#login #warning").fadeOut()},2000);
			}
		});
		$("#password").val("");
	},
	cancel: function() {
		this.displayLoginLink();
		$("div#login").removeClass("loginbox");
	},
	logout: function() {
		var me=this;
		$.get(root+"login.php",{"action":"logout"},function(data){
			try {
				var msg=JSON.parse(data);
			} catch(e) {
				console.log("Error: cannot parse logout response json",data);
				return;
			}

			if(msg.response=="Yes")
			{
				me.username="";
				me.loggedin=0;
				me.displayLoginLink();
				me.displayLoginForm();
				$("div#login #warning").html("Sesión cerrada con éxito").fadeIn();
				setTimeout(function(){$("div#login #warning").fadeOut()},2000);
				if(me.subscribers[0])
					me.subscribers[0](); // inform subscribers of login change
			}
			else
			{
				$("div#login #warning").html("Error al cerrar la sesión, por favor, inténtalo de nuevo").fadeIn();
				setTimeout(function(){$("div#login #warning").fadeOut()},2000);
			}
		});
	},
	sendRegister: function () {
		var	me=this;
		var	reg_username=$("div#login #username").val();
		var	reg_email=$("div#login #e-mail").val();
		var	reg_password=$("div#login #password").val();
		var	reg_repassword=$("div#login #repassword").val();

		if(reg_username=="" || reg_email=="" || reg_password=="" || reg_repassword=="")
		{
			$("div#login #warning").html("Todos los campos son obligatorios").fadeIn();
			setTimeout(function(){$("div#login #warning").fadeOut()},2000);
			return;
		}

		if(reg_password!=reg_repassword)
		{
			$("div#login #warning").html("Las contraseñas no coinciden").fadeIn();
			setTimeout(function(){$("div#login #warning").fadeOut()},2000);
			return;
		}

		$.get(root+"login.php",{"action":"register","username":reg_username,"email":reg_email,"password":reg_password},function(data){
			try {
				var msg=JSON.parse(data);
			} catch(e) {
				console.log("Error: cannot parse register response json",data);
				return;
			}

			if(msg.response=="Yes")
			{
				me.username=reg_username;
				me.loggedin=1;
				me.displayLoggedinLink();
				$("div#login #warning").html("Registrado con éxito").fadeIn();
				if(me.subscribers[0])
					me.subscribers[0](); // inform subscribers of login change
				//setTimeout(function(){$("div#login #warning").fadeOut()},2000);
				setTimeout(function() {
					$("div#login #warning").fadeOut(500,function() {
						$("div#login").removeClass("loginbox");
					});
				},2000);
			}
			else
			if(msg.response=="Exists")
			{
				$("div#login #warning").html("El usuario ya está en uso. Por favor, elige otro.").fadeIn();
				setTimeout(function(){$("div#login #warning").fadeOut()},2000);
			}
			else
			{
				$("div#login #warning").html("El registro ha fallado. Por favor, inténtalo de nuevo más tarde.").fadeIn();
				setTimeout(function(){$("div#login #warning").fadeOut()},2000);
			}
		});
		$("#password").val("");
		$("#repassword").val("");
	},
	remind: function () {
		var	me=this;
		var	reg_username=$("div#login #username").val();
		
		if(!reg_username && !reg_email)
		{
			$("div#login #warning").html("Introduce un nombre o email").fadeIn();
			setTimeout(function(){$("div#login #warning").fadeOut()},2000);
			return;
		}
		$.get(root+"login.php",{"action":"remind","email+name":reg_username},function(data){
			try {
				var msg=JSON.parse(data);
			} catch(e) {
				console.log("Error: cannot parse remind response json",data);
				return;
			}

			if(msg.response=="Yes")
			{
				$("div#login #warning").html("Pronto recibirás una nueva contraseña al email introducido").fadeIn();
				setTimeout(function(){$("div#login #warning").fadeOut()},2000);
			}
			else
			if(msg.response=="Unavailable")
			{
				$("div#login #warning").html("No existe ninguna cuenta con ese email").fadeIn();
				setTimeout(function(){$("div#login #warning").fadeOut()},2000);
			}
			else
			{
				$("div#login #warning").html("No es posible recordar la contraseña. Por favor, inténtalo más tarde").fadeIn();
				setTimeout(function(){$("div#login #warning").fadeOut()},2000);
			}
		});
	},
	subscribe: function(sub) {
		var me=this;
		me.subscribers.push(sub);
	},
	unsubscribe: function(sub) {
		var me=this;
		me.subscribers.splice(me.subscribers.indexOf(sub),1);
	}
}