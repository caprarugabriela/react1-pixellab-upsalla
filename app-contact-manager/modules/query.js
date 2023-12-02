import contacts from './data.js';

// needle ->cauti acul in carul cu fan
// este folosit pt a cauta searchterm
export const findContact = (needle = 'query') => {
  const results = contacts.filter((contact) => {
    // [1, 'Carol', 'Carolson', '073', ... , []]
    const values = Object.values(contact).filter((part) => {
      return typeof part === 'number' || typeof part === 'string';
    });

    if (values.join('').includes(needle)) {
      return true;
    }

    return false;
  });

  return results;
};
