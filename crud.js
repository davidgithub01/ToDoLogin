/**
 * DOM elemnts
 */

var tasksUl = document.getElementById('Tasks');

/**
 * events
 */

jQuery(document).ready(function($){
	if(sessionStorage.auth_token){
		readTasks();	
	}
});

document.addEventListener('click', function(e){
	var clicked = e.target;
	if(clicked.matches('.Task_delete')){
		deleteTask(clicked.parentNode);
	}
});

document.addEventListener('change', function(e){
	var changed = e.target;

	if(changed.matches('.Task_edit')){

		updateTask(changed.parentNode);
	}

	if(changed.matches('.Task_create') && changed.value != ''){
		createTask(changed.value);
	}

}, true);

/**
 * functions
 */

function createTask(taskTitle){
	jQuery.ajax({
		url: apiURL + '/wp/v2/task', // get token from API
		method: 'POST',
		beforeSend: function(xhr){
			xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem('auth_token'));
		},
		data: {
			title: taskTitle,
			status: 'publish'
		}
	})
	.done(function(response){
		readTasks();
		console.log(response);
	})
	.fail(function(response){
		console.error(response);
	})
}

function readTasks(){
	jQuery.ajax({
		url: apiURL + '/wp/v2/task', // get token from API
		method: 'GET'
	})
	.done(function(response){
		renderTasks(response);
		console.log(response);
	})
	.fail(function(response){
		console.error(response);
	})
}

function updateTask(task){

	var input = task.querySelector('input[type=text]');

	jQuery.ajax({
		url: apiURL + '/wp/v2/task/' + task.id,
		method: 'POST',
		beforeSend: function(xhr){
			xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem('auth_token'));
		},
		data: {
			'title': input.value
		}
	})
	.done(function(response){
		console.log(response);
		input.value = response.title.rendered;
	})
	.fail(function(response){
		console.error(response);
	});

}

function deleteTask(task){

	jQuery.ajax({
		url: apiURL + '/wp/v2/task/' + task.id,
		method: 'DELETE',
		beforeSend: function(xhr){
			xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem('auth_token'));
		}
	})
	.done(function(response){
		console.log(response);
		readTasks();
	})
	.fail(function(response){
		console.error(response);
	});
}

function renderTasks(tasks){
	
	// start fresh on every call
	tasksUl.innerHTML = '';

	for(var i = 0; i < tasks.length; i++){
		var task = tasks[i];
		var taskTemplate =  `
			<li class="Task" id="${task.id}">
				<input class="Task_edit" type="text"value="${task.title.rendered}"/>
				<button class="Task_delete" >&#x2714;</button>
			</li>
		`;
		tasksUl.innerHTML += taskTemplate;
	}

}