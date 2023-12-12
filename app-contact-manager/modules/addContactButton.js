// default export can be renamed
// we import here the form as it's being triggered when we click the Add contact btn
import { render } from './addContactForm.js';
import { clearMessages } from './notificationBar.js';
import tazz from './stage.js';
const addContactButton = document.querySelector('.add-contact-button');

addContactButton.addEventListener('click', () => {
  // golim/stergem mesajele din notificationBar
  clearMessages();
  tazz.innerHTML = '';
  tazz.append(render());
});

export default addContactButton;
