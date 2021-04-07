/**
 * Push Notification settings - uses FCM and associates Flow users with one
 * or more devices.
 *
 * Requires that the remoteHost value already set in localStorage:
 *		localStorage.remoteHost="https://www.flowmodulemanager.co.uk";
 *
 */

function PushNotifications(){
	var self = this;
  
	self.regURL = '/api/fcm/v1/devices/';
	self.unregURL = '/api/fcm/v1/devices/';
	self.setUserURL = '/api/v1/mobile/device_user/';
	// The senderID MUST match the value in google-services.json
	self.senderID = "291435943623";
	
}

PushNotifications.prototype.init = function() {
	var self = this;	
	self.remoteHost = localStorage.remoteHost;
	
	var push = PushNotification.init({
		"android": {
			"senderID": self.senderID,
			"icon": "push_notification_logo",
			"sound": true,
			"vibration": true
		},
		"browser": {},
		"ios": {
			"senderID": self.senderID,
			"sound": true,
			"vibration": true,
			"badge": true
		},
		"windows": {}
	});
	
	push.on('registration', function(data) {
		console.log("Push registration...");
		var oldRegId = localStorage.getItem('fcm_regId');
		
		if (oldRegId !== data.registrationId) {
			var newRegId = data.registrationId;
			// Post registrationId to your app server as the value has changed
			console.log("POST to: " + self.remoteHost + self.regURL);
			$.ajax({
				url:self.remoteHost + self.regURL,
				data: {"reg_id": newRegId, "dev_id": device.uuid, "name": device.model + '_' + device.version},
				error: function(jqXHR, textStatus, errorThrown) {
					var error_message = i18next.t("Unable to register for push notifications") ;
					navigator.notification.alert(
						error_message, 
						null, 
						"Error");
					console.log("Error from push registration");
					console.log(JSON.stringify(jqXHR, null, 4));
				},
				success: function(data, textStatus, jqXHR) {
					// Save new registration ID
					localStorage.setItem('fcm_regId', newRegId);
					if (localStorage.accessCode) {
						self.updateDeviceOwner(device.uuid, localStorage.accessCode);	
					}
				},
				type: 'POST'
			});
		} else {
			console.log("No change in reg id!");
		}
	});

	push.on('error', function(e) {
		console.log("push error = " + e.message);
	});

	push.on('notification', function(data) {
		var msg = data.message;
		$(document).trigger("pushNotification", [ msg ]);
		return true;
   });
    
   $( document ).on( "postLogin", function( event, accesscode ) {
		// Update the device registration to match the current user
		self.updateDeviceOwner(device.uuid, accesscode);
	});
   
   	$(document).on("settingsChange", function(event) { self.init(); });
}

PushNotifications.prototype.setHeaders = function(xhr) {
	xhr.setRequestHeader('X-ACCESS-CODE', localStorage.accessCode);
    token = localStorage.token;
    if ((typeof(token) != 'undefined')) {
        xhr.setRequestHeader('Authorization', 'Token ' + token);
    }
}

PushNotifications.prototype.updateDeviceOwner = function(device_id, access_code) {
	var self = this;
	$.ajax({
		url:self.remoteHost + self.setUserURL,
		data: { "dev_id": device_id },
		error: function(jqXHR, textStatus, errorThrown) {
			console.log("Error from push update owner");
			console.log(JSON.stringify(jqXHR, null, 4));
			var unable_to_register = i18next.t("Unable to register device for push notifications");
			navigator.notification.alert(
				unable_to_register, 
				null, 
				"Error");
		},
		success: function(data) {
			//console.log("Success sending updateDeviceOwner!");
		},
		beforeSend: self.setHeaders,
		type: 'POST'
	});
}