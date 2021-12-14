const wsUri = 'wss://echo-ws-service.herokuapp.com';
const submit = document.querySelector('#submit');
const geolocation = document.querySelector('#geolocation');
const chat = document.querySelector('.chat-panel');
let websocket;
open();

function open() {
  websocket = new WebSocket(wsUri);
  websocket.onmessage = function(event) {
    display(event.data, ['message', 'received']);
  };
};

submit.addEventListener('click', () => {
  let message = document.getElementById('message-input').value;
  sendMessage(message);
});

geolocation.addEventListener('click', () => {
  let message = 'Гео-локация'
  sendMessage(message);
});

function sendMessage(message) {
  if (!message) {
    return;
  }
  chat.classList.add('visible');
  websocket.send(message);
  display(message, ['message', 'sent']);
}

async function display(message, classes) {
  let div = document.createElement('div');
  div.classList.add(...classes);
  message = await getLocationMessage(message, classes);
  div.innerHTML = message;
  chat.appendChild(div);
};

async function getLocationMessage(message, classes) {
  if (message == 'Гео-локация' && classes.includes('received')) {
    if (navigator.geolocation) {
      try {
	    const { coords } = await getPosition();
        return `<a href="https://www.openstreetmap.org/#map=18/${coords.latitude}/${coords.longitude}">Карта</a>`;
      } catch(error) {
        return 'Разрешение на доступ к местоположению отклонено';;
      }    
    } else {
      return 'Невозможно получить ваше местоположение';
    }
  }
  return message;
};

function getPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });    
};