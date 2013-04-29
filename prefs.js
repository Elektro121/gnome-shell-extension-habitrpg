// Merci à alexonrails pour le gros coup de main
// http://www.alexonrails.net/gnome-3-extension-development-hints-6-extension-preferences/
// Allez voir ! Cela pourrait vous être utile si vous avez besoin d'aide sur les extensions gnome3


/*Constantes*/
const Local = imports.misc.extensionUtils.getCurrentExtension();
const _ = imports.gettext.domain(Local.metadata['habitrpg-status']).gettext;

/*Import des librairies*/
const Lang = imports.lang;
const Gtk = imports.gi.Gtk;
const Convenience = Local.imports.convenience;
const Settings = Local.imports.settings;
const Params = imports.misc.params;

/*Objets GTK uniquement utilisés dans ce fichier*/
let userAPI_box = null;
let userAPI_label = null;
let userAPI_input = null;

let tokenAPI_box = null;
let tokenAPI_label = null;
let tokenAPI_input = null;

let saveSettings_box = null;
let saveSettings_spacer = null;
let saveSettings_button = null;

let frame = null;

function init() {
} // Inutiiiiile


function widget_initialize() {
// On fait initialiser les widgets avec leurs propriétés !

	//Boite de départ, appellé frame, est ce que l'on va devoir rendre par la fonction buildPrefsWidget()


	// Formulaire API Utilisateur
	userAPI_box = new Gtk.Box({	orientation: Gtk.Orientation.HORIZONTAL});

	userAPI_label = new Gtk.Label({		label: "User API :",
											xalign: 0,
											margin_right: 30 });

	userAPI_input = new Gtk.Entry({		hexpand: true,
										text: "" });

	// Formulaire Token API
	tokenAPI_box = new Gtk.Box({orientation: Gtk.Orientation.HORIZONTAL});

	tokenAPI_label = new Gtk.Label({		label: "Token API :",
											xalign: 0,
											margin_right: 30 });

	tokenAPI_input = new Gtk.Entry({		hexpand: true,
											text: "" });

	// Bouton pour sauvegarder les préférences
	saveSettings_box = new Gtk.Box({orientation: Gtk.Orientation.VERTICAL });

	saveSettings_spacer = new Gtk.Box({	orientation: Gtk.Orientation.VERTICAL,
										vexpand: true,
										hexpand: true });

    saveSettings_button = new Gtk.Button({label: "Sauvegarder les paramêtres" });

}

function widget_packaging() {
//On package les widgets dans les _box, pour mettre de l'ordre dessus ^^

    // Formulaire API Utilisateur
    userAPI_box.pack_start(userAPI_label, false, false, 15);
    userAPI_box.pack_start(userAPI_input, true, true, 15);

    // Formulaire Token API
    tokenAPI_box.pack_start(tokenAPI_label, false, false, 15);
    tokenAPI_box.pack_start(tokenAPI_input, true, true, 15);

	// Bouton pour sauvegarder les préférences

	saveSettings_box.pack_start(saveSettings_spacer, true, true, 15);
	saveSettings_box.pack_start(saveSettings_button, false, false, 15);

	frame.add(userAPI_box);
	frame.add(tokenAPI_box);
	frame.add(saveSettings_box);
}

function widget_connect() {
// On fait les liens entre les éléments, ici le clic de bouton vers la fonction.
	saveSettings_button.connect('clicked', Lang.bind(this, saveSettings_button_callback));
}


//function saveSettings_button_callback
{
// Ce que le clic de bouton va faire


    // On récupère les paramêtres
    settings = Convenience.getSettings();
    settings_data = Settings.getSettings(settings);

    // Puis on met a jour les valeurs !
    settings_data.userAPI = userAPI_input.get_text();
    settings_data.tokenAPI = tokenAPI_input.get_value();
    settings.set_string("settings-json", JSON.stringify(settings_data));
}


function widget_init_values() {
// Initialisateur de valeurs de paramêtres

    // On récupère les informations
    settings = Convenience.getSettings();
    settings_data = Settings.getSettings(settings);
 
    // Initialisation du userAPI
    userAPI_input.set_text(settings_data.userAPI);
 
    // Initialisation du tokenAPI
    editor_input.set_text(settings_data.tokenAPI);
}

function buildPrefsWidget(){
//La fonction appellé par gnome-extensions-prefs

    // On balance les fonctions préparées
    widget_initialize();
    widget_packaging();
    widget_connect();
    widget_init_values();
    // On affiche tout
    frame.show_all();
    return frame;
}
