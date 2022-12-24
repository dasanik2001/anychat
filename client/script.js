import bot from './assets/bot.svg'
import user from './assets/user.svg'

const form = document.querySelector('form')
const chatCotainer = document.querySelector('#chat_container')

let loadInterval;

function loader(element) {
  element.textContent = ''

  loadInterval = setInterval(() => {
    element.textContent += '.';

    if (element.textContent === '....') {
      element.textContent = ''
    }
  }, 300)
}

function typeText(element, text) {
  let index = 0;
  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    }
    else {
      clearInterval(interval)
    }
  }, 20)
}

function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexaDecimalString = randomNumber.toString(16)

  return `id-${timestamp}-${hexaDecimalString}`;

}


function chatStripe(isAi, value, uniqueId) {
  return (
    `
    <div class="wrapper ${isAi && 'ai'}">
    <div class = "chat">
    <div class='profile'>
    
    <img src= "${isAi ? bot : user}" alt= "${isAi ? 'bot' : 'user'}"/>
    </div>  
    <div class='message' id=${uniqueId}>${value}</div>  
    </div>
    </div>
    `
  )
}

const handlSubmit = async (e) => {
  e.preventDefault();
  const data = new FormData(form);
  //generate the user stripe
  chatCotainer.innerHTML += chatStripe(false, data.get('prompt'));

  form.reset();

  const uniqueId = generateUniqueId();
  chatCotainer.innerHTML += chatStripe(true, " ", uniqueId)

  chatCotainer.scrollTop = chatCotainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);
  loader(messageDiv);

  const response = await fetch('https://anychat.onrender.com', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: data.get('prompt')
    })
  })
  clearInterval(loadInterval)
  messageDiv.innerHTML = '';

  if (response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim();
    typeText(messageDiv, parsedData)

  }
  else {
    const err = await response.text();
    messageDiv.innerHTML = "Something is wrong!!"

    alert(err)
  }
}


form.addEventListener('submit', handlSubmit)
form.addEventListener('keyup', (e) => {
  if (e.keyCode === 13)
    handlSubmit(e)
})