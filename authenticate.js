
/**
 * Settings
 */

var apiURL = 'https://www.getdone.pw/wp-json';

/**
 * DOM elements
 */

var form = document.getElementById('login_form');
var password = document.getElementById('password');
var username = document.getElementById('username');
var loginButton = document.getElementById('login_button');
var logoutButton = document.getElementById('logout_button');
var createTaskEl = document.getElementById('Task_create');
var body = document.getElementsByTagName('body')[0];

/**
 * Events
 */

loginButton.addEventListener('click', function(e){
	// stop form from submiting
	e.preventDefault();
	getToken(username.value, password.value);
	readTasks();
});

logoutButton.addEventListener('click', function(e){
	deleteToken();
});

jQuery(document).ready(function($){

	// hide login in user is already authenticated
	if(sessionStorage.auth_token){
		body.classList.add('authenticated');
	} else {
		body.classList.remove('authenticated');
	}
});


/**
 * functions
 */

function getToken(username, password){

	jQuery.ajax({
		url: apiURL + '/jwt-auth/v1/token', // get token from API
		method: 'POST',
		data: {
			'username': username,
			'password': password,
		}
	})
	.done(function(response){
		saveToken(response.token);		
	})
	.fail(function(response){
		console.error(response);
	})
}

function saveToken(token){
	sessionStorage.setItem('auth_token', token);
	body.classList.add('authenticated');
}

function deleteToken(){
	sessionStorage.removeItem('auth_token');
	body.classList.remove('authenticated');
}
