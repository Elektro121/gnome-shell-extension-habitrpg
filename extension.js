const St = imports.gi.St;
const Main = imports.ui.main;
const Soup = imports.gi.Soup; // for http requests

// Soup session (see https://bugzilla.gnome.org/show_bug.cgi?id=661323#c64) (like in the weather extension)
const _httpSession = new Soup.SessionAsync();
Soup.Session.prototype.add_feature.call(_httpSession, new Soup.ProxyResolverDefault());
Soup.Session.prototype.add_feature.call(_httpSession, new Soup.ContentDecoder()); // to add the compression functionality

let user = {
	id : "",
	apiToken : "",
	isLoaded : false,
	
	dataObject : null,
	health : 0,
	maxHealth : 0,
	
	getData : function() {
		let self = this;
		
		// We create a new GET request
		//let message = Soup.Message.new('GET', "https://habitrpg.com/api/v1/user"); // URL to use in the future
		let message = Soup.Message.new('GET', "https://habitrpg.com/api/v1/status");
		
		// We append headers to tell the server the user data
		//message.request_headers.append("Content-Type", "application/json");
		//message.request_headers.append("x-api-user", this.id);
		//message.request_headers.append("x-api-key", this.apiToken);
        
        // We queue the message to get the response
        _httpSession.queue_message(message, function(session, message) { 
            if (message.status_code !== 200) { // Constant instead of number please !
            	Main.notify("Loading error... " + message.status_code + " : " + message.reason_phrase);
				return;
			}
			var userDataJSON = message.response_body.data;
			self.dataObject = JSON.parse(userDataJSON);
			self.isLoaded = true;
			Main.notify("Data loaded");
			//self.setProperties(); // use it in the future
        });
	},
	
	setProperties : function() {
		if(!isLoaded) {
			// write some loading messages ?
			return;
		}
		
		this.health = 0; //this.dataObject.status;
		this.maxHealth = 0; //this.dataObject.status;
	}
};

let label, button;

function init() {
	user.id = "";
	user.apiToken = "";
	
	user.getData();
	
	// Testing values to delete later
	user.health = user.maxHealth = 50;
	
    button = new St.Bin({ style_class: 'panel-button',
                          reactive: true,
                          can_focus: true,
                          x_fill: true,
                          y_fill: false,
                          track_hover: true });
    label = new St.Label({ text: "HabitRPG" });
/* Our icon there ?
    let icon = new St.Icon({ icon_name: 'system-run-symbolic',
                             style_class: 'system-status-icon' });

*/
    button.set_child(label);
    button.connect('button-press-event', changeText);
}

function changeText() {	
	if (user.health > 0) {
		user.health -= 5;
	}
    label.text = "HP : " + user.health + "/" + user.maxHealth;
}

function enable() {
    Main.panel._rightBox.insert_child_at_index(button, 0);
}

function disable() {
    Main.panel._rightBox.remove_child(button);
}
