import { addMessage, clearMessages } from './notificationBar.js';
import {
  addContact,
  addPet,
  deleteContact,
  deletePet,
  editContact,
  editPet,
  getContact,
  getPet,
} from './query.js';
import renderMessage from './message.js';
import { render as renderEditContact } from './editContactForm.js';
import { render as renderAppForm } from './addPetForm.js';
import { render as renderEditPetForm } from './editPetForm.js';

const stage = document.querySelector('.stage');
let currentContactId;

// reset stage on logo click
// aici trebuia sa scoatem si notificarea?
const resetLogo = document.querySelector('.reset-logo');
resetLogo.addEventListener('click', () => {
  stage.innerHTML = '';
});

// delete contact
stage.addEventListener('click', (event) => {
  const { target } = event;

  if (
    target.nodeName !== 'BUTTON' ||
    !target.classList.contains('delete-friend')
  ) {
    return;
  }

  // ask user to confirm deletion
  const confirmDelete = window.confirm(
    'Are you sure you want to delete this contact?',
  );
  if (confirmDelete) {
    const button = target;
    const parent = button.parentElement;
    const contactId = parent.dataset.contactId;

    deleteContact(contactId);
    parent.remove();
    addMessage(renderMessage('Contact removed', 'danger'));
  } else {
    return;
  }
});

// add contact form
stage.addEventListener('submit', (event) => {
  event.preventDefault();
  const { target } = event;

  if (target.nodeName !== 'FORM' || !target.classList.contains('add-contact')) {
    return;
  }

  const form = target;
  // input elements:
  const { name, surname, phone, email } = form;
  const contact = {
    name: name.value,
    surname: surname.value,
    phone: phone.value,
    email: email.value,
    // hack:
    id: Number(Date.now().toString().slice(-6)),
  };

  // implement create contact
  addContact(contact);

  addMessage(
    renderMessage(`Contact ${name.value} ${surname.value} created.`, 'success'),
  );
  stage.innerHTML = '';
});

// cancel button
// will be used for pets and others (if applicable)
stage.addEventListener('click', (event) => {
  const { target } = event;
  // early return
  if (
    target.nodeName !== 'BUTTON' ||
    !target.classList.contains('cancel-button')
  ) {
    return;
  }
  // clear
  stage.innerHTML = '';
});

// edit contact button click
// subscribe
stage.addEventListener('click', (event) => {
  const { target } = event;

  if (
    target.nodeName !== 'BUTTON' ||
    !target.classList.contains('edit-friend')
  ) {
    return;
  }

  const button = target;
  const parent = button.parentElement;
  const contactId = parent.dataset.contactId;

  const contact = getContact(contactId);

  if (contact === undefined) {
    return;
  }

  clearMessages();
  stage.innerHTML = '';
  stage.append(renderEditContact(contact));
});

// edit contact form submit
stage.addEventListener('submit', (event) => {
  event.preventDefault();
  const { target } = event;

  if (
    target.nodeName !== 'FORM' ||
    !target.classList.contains('edit-contact')
  ) {
    return;
  }

  const form = target;
  // DOM elements
  const { name, surname, phone, email, id } = form;
  const contact = {
    name: name.value,
    surname: surname.value,
    phone: phone.value,
    email: email.value,
    id: Number(id.value),
  };

  editContact(contact);

  stage.innerHTML = '';
  addMessage(
    renderMessage(`Contact ${name.value} ${surname.value} saved.`, 'success'),
  );
});

// add pet button
stage.addEventListener('click', (event) => {
  const { target } = event;

  if (
    target.nodeName !== 'BUTTON' ||
    !target.classList.contains('add-pet-button')
  ) {
    return;
  }

  const addPetButton = target;
  const ownerContainer = addPetButton.closest('.contact');
  const contactId = ownerContainer.dataset.contactId;

  clearMessages();
  stage.innerHTML = '';

  // adaugam formularul pt Add pet
  stage.append(renderAppForm(contactId));
});

//add pet submit
stage.addEventListener('submit', (event) => {
  const { target } = event;

  if (
    target.nodeName !== 'FORM' ||
    !target.classList.contains('add-pet-form')
  ) {
    return;
  }

  event.preventDefault();
  const form = target;
  // dom elements:
  const { age, name, species, contactId } = form;
  const pet = {
    age: age.value,
    name: name.value,
    species: species.value,
    // hack
    id: Number(Date.now().toString().slice(-6)),
  };

  // addPet functionality
  addPet(contactId.value, pet);
  const { name: contactName, surname: contactSurname } = getContact(
    contactId.value,
  );

  stage.innerHTML = '';
  addMessage(
    renderMessage(
      `Pet ${name.value} added to contact ${contactName} ${contactSurname}.`,
      'success',
    ),
  );
});

// delete pet
stage.addEventListener('click', (event) => {
  const { target } = event;

  if (
    target.nodeName !== 'BUTTON' ||
    !target.classList.contains('delete-pet-button')
  ) {
    return;
  }
  // ask user to confirm deletion
  const confirmDelete = window.confirm(
    'Are you sure you want to delete this pet?',
  );
  if (confirmDelete) {
    const button = target;
    const container = button.closest('.pet');
    const petId = Number(container.dataset.petId);
    const contactContainer = button.closest('.contact');
    const contactId = contactContainer.dataset.contactId;

    deletePet(contactId, petId);
    addMessage(renderMessage(`Pet was removed from list.`, 'danger'));

    container.remove();
  }
});

// edit  pet
stage.addEventListener('click', (event) => {
  const { target } = event;

  if (
    target.nodeName !== 'BUTTON' ||
    !target.classList.contains('edit-pet-button')
  ) {
    return;
  }

  const editPetButton = target;
  const petContainer = editPetButton.closest('.pet');
  const petId = petContainer.dataset.petId;
  const ownerContainer = editPetButton.closest('.contact');
  const contactId = ownerContainer.dataset.contactId;
  currentContactId = contactId;

  const pet = getPet(contactId, petId);

  if (pet === undefined) {
    return;
  }

  clearMessages();
  stage.innerHTML = '';
  stage.append(renderEditPetForm(pet));
});

// save edit pet form
stage.addEventListener('submit', (event) => {
  const { target } = event;

  if (target.nodeName !== 'FORM' || !target.classList.contains('edit-pet')) {
    return;
  }

  event.preventDefault();

  const form = target;

  const { name: petName, age, species, id } = form;

  const pet = {
    name: petName.value,
    age: age.value,
    species: species.value,
    id: Number(id.value),
  };

  editPet(currentContactId, pet);

  stage.innerHTML = '';
  addMessage(renderMessage(`Pet ${petName.value} saved.`, 'success'));
});

export default stage;
