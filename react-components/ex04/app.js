const person = {
  name: 'Dragos',
  surname: 'Iordache',
  age: 32,
  petOwner: true,
  skills: {
    html: true,
    css: false,
    javaScript: true,
  },
  friends: {
    larry: {
      name: 'Larry',
      surname: 'Larryson',
      age: 30,
    },
    steven: {
      name: 'Steven',
      surname: 'Stevenson',
      age: 31,
    },
    carol: {
      name: 'Carol',
      age: 29,
      surname: 'Carolson',
    },
  },
};

console.warn(`
  Folosind Object.entries() pe proprietatea skills,
  afiseaza abilitatile persoanei daca acestea sunt true.
  Folosind propozitii de forma: “person.name cunoaste: html.”
  “person.name cunoaste: javaScript.”
`);

const entries1 = Object.entries(person.skills);
entries1.forEach((skillEntry) => {
  const [skillId, isKnown] = skillEntry;

  console.log(
    `${person.name} ${isKnown ? 'cunoaste' : 'nu cunoaste'} ${skillId}`,
  );
});

console.warn(`
  Prin aceeasi metoda, afiseaza o lista inversata cu
  numele complet inversat al prietenilor.
`);
const reversedFriendsList = Object.entries(person.friends).reverse();
reversedFriendsList.forEach((friendEntry) => {
  const [, friend] = friendEntry;
  const { surname, name } = friend;

  console.log(`${surname} ${name}`);
});

console.warn(`
  Afiseaza propozitia: “Prietenii mei sunt Larry, Steven si Carol.”
  folosind Object.entries()`);
console.log(
  Object.entries(person.friends).reduce(
    (message, friendEntry, index, friends) => {
      const length = friends.length;
      const [, { name }] = friendEntry;
      const punctuation =
        length - 1 === index ? '.' : length - 2 === index ? ' si ' : ', ';

      message += `${name}${punctuation}`;

      return message;
    },
    'Prietenii mei sunt ',
  ),
);

console.warn(`In mod similar afiseaza mai multe propozitii (cate una per console.log())
care sa afiseze: “Diferenta de varsta intre Larry si Dragos este de xxx ani.” etc…
`);
Object.entries(person.friends).forEach((friendEntry) => {
  const [, friend] = friendEntry;
  const { name, age } = friend;
  const ageDiff = Math.abs(person.age - age);

  console.log(
    `Diferenta de varsta intre ${name} si ${person.name} este de ${ageDiff} ani.`,
  );
});

console.warn(`Folosind Object.entries() pe proprietatea skills,
afiseaza toate abilitatile din obiectul skills.
`);
Object.entries(person.skills).forEach((skillEntry) => {
  const [skillId] = skillEntry;
  console.log(`${skillId}`);
});

console.warn(
  `Prin aceeasi metoda, afiseaza o lista cu numele complet al prietenilor. `,
);
const completeFriendsList = Object.entries(person.friends);
completeFriendsList.forEach((friendEntry) => {
  const [, friend] = friendEntry;
  const { surname, name } = friend;

  console.log(`${name} ${surname}`);
});

console.warn(`Afiseaza propozitia: “Prietenii mei sunt Larry Larryson,
Steven Stevenson si Carol Carolson.” folosind Object.entries()`);
const myFriends = Object.entries(person.friends).reduce(
  (myFriends, friend, index, friends) => {
    const [, myFriend] = friend;
    const { name, surname } = myFriend;
    let punctuation =
      index === friends.length - 1
        ? '.'
        : index === friends.length - 2
        ? ' si '
        : ', ';

    myFriends += `${name} ${surname}${punctuation}`;

    return myFriends;
  },
  'Prietenii mei sunt ',
);

console.log(myFriends);

console.warn(`In mod similar, afiseaza mai multe propozitii (cate una per console.log())
care sa afiseze: “Larry are xx ani. Steven are …”`);

Object.entries(person.friends).map(([, friend]) => {
  const { name, age } = friend;

  console.log(`${name} are ${age} ani.`);
});
