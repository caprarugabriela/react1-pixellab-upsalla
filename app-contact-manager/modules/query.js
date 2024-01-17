import contacts from './data.js';

// needle ->cauti acul in carul cu fan
// este folosit pt a cauta searchterm
export const findContact = (needle = 'query') => {
  const results = contacts.filter((contact) => {
    // [1, 'Carol', 'Carolson', '073', ... , []]
    const values = Object.values(contact).filter((part) => {
      return typeof part === 'number' || typeof part === 'string';
    });

    needle = needle.toLowerCase();

    if (values.join('').toLowerCase().includes(needle)) {
      return true;
    }

    return false;
  });

  return results;
};

export const deleteContact = (contactId) => {
  contactId = parseInt(contactId);
  if (!contactId || isNaN(contactId)) {
    return;
  }

  const contactIndex = contacts.findIndex((contact) => {
    const { id } = contact;

    return contactId === id;
  });

  if (contactIndex >= 0) {
    // splice mutates
    // manipulare genetica prin mutatii
    contacts.splice(contactIndex, 1);
  }
};

// add contact
export const addContact = (contact) => {
  // push mutates
  contacts.push(contact);
};

// get contact (by id)
export const getContact = (contactId) => {
  // extra-sanity check
  contactId = Number(contactId);

  return contacts.find((contact) => {
    const { id } = contact;

    return id === contactId;
  });
};

// editContact
export const editContact = (contact) => {
  const existingContact = getContact(contact.id);

  // suprascriem proprietatile existente cu cele noi
  const contactProperties = Object.keys(existingContact);

  for (let i = 0; i < contactProperties.length; i++) {
    const propertyName = contactProperties[i];

    // in cazul in care modificam numele ne asiguram ca noul nume pastreaza
    // toate informatiile vechi (existente deja)
    existingContact[propertyName] =
      contact[propertyName] || existingContact[propertyName];
  }
};

// addPet
export const addPet = (contactId, pet) => {
  const contact = getContact(contactId);
  contact.pets = contact.pets || [];

  // push mutates
  contact.pets.push(pet);
};

// delete pet
export const deletePet = (contactId, petId) => {
  petId = parseInt(petId);
  const contact = getContact(contactId);

  if (!contact.pets) {
    return;
  }

  const petIndex = contact.pets.findIndex((pet) => {
    const { id } = pet;

    return petId === id;
  });

  if (petIndex >= 0) {
    contact.pets.splice(petIndex, 1);
  }
};

// get pet
export const getPet = (contactId, petId) => {
  petId = Number(petId);

  const contact = getContact(contactId);

  return contact.pets.find((pet) => {
    const { id } = pet;

    return id === petId;
  });
};

export const editPet = (contactId, pet) => {
  const petId = pet.id;
  const existingPet = getPet(contactId, petId);

  const petProperties = Object.keys(existingPet);

  for (let i = 0; i < petProperties.length; i++) {
    const propertyName = petProperties[i];

    existingPet[propertyName] = pet[propertyName] || existingPet[propertyName];
  }
};
