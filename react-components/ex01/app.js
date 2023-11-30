const person = {
  name: 'Dragos',
  surname: 'Iordache',
  age: 32,
  petOwner: false,
  skills: [
    'html',
    'javascript',
    'css',
    'java',
    'c++',
    'node',
    'jquery',
    'node.js',
  ],
  friends: [
    {
      name: 'Larry',
      surname: 'Larryson',
      age: 30,
    },
    {
      name: 'Steven',
      surname: 'Stevenson',
      age: 31,
    },
    {
      name: 'Carol',
      surname: 'Carolson',
      age: 29,
    },
  ],
};

console.warn(`
  Folosind metoda map pe arrayul skills, returneaza
  si afiseaza in consola un array in care fiecare
  consoana este scrisa cu litera mare (vocalele nu)
`);
const vowels = ['a', 'e', 'i', 'o', 'u'];
const arrVowels = person.skills.map((skill) => {
  const letters = skill.split('');
  const upperCaseVowels = letters.map((letter) => {
    if (vowels.includes(letter)) {
      return letter.toUpperCase();
    }
    return letter;
  });
  return upperCaseVowels.join('');
});

console.log(arrVowels);

console.warn(`
  Folosind map pe arrayul friends, returneaza un array
  in care fiecare pozitie contine propozitia
  “Ma numesc {name} {surname} si am {age} ani.  ”
`);
const sentences = person.friends.map((friend) => {
  // destructurare
  const { name, surname, age } = friend;
  return `Ma numesc ${name} ${surname} si am ${age} ani. `;
});

console.log(sentences);

console.warn(`Folosind map pe arrayul friends, returneaza un array in care fiecare pozitie contine propozitia
“Diferenta de varsta dintre {friendName} si {personName} este {diff}”`);
const ageDiff = person.friends.map((friend) => {
  const { name, age } = friend;
  const diff = person.age - age;
  return `Diferenta de varsta dintre ${name} si ${person.name} este ${diff} ani.`;
});

console.log(ageDiff);

console.warn(`Returneaza si afiseaza un array in care fiecare pozitie contine diferenta dintre varsta persoanei si
lungimea cuvantului de pe arrayul skill `);
const skillDiff = person.skills.map((skill) => {
  const diff = person.age - skill.length;
  return diff;
});

console.log(skillDiff);

console.warn(`Folosind metoda map pe arrayul skills, returneaza un array care contine cuvintele cu
prima si ultima litera mari. `);
const newSkill = person.skills.map((skill) => {
  const letters = skill.split('');
  const firstLetter = letters[0].toUpperCase();
  const lastLetter = letters[letters.length - 1].toUpperCase();
  const newWord = firstLetter + skill.slice(1, -1) + lastLetter;
  return newWord;
});

console.log(newSkill);

console.warn(
  `Folosind metoda map pe arrayul skills, returneaza un array care contine cuvintele inversate (exemplu: lmth)`,
);
const reverseSkill = person.skills.map((skill) => {
  return skill.split('').reverse().join('');
});
console.log(reverseSkill);

console.warn(`Folosind metoda map pe arrayul friends, returneaza un array care sa contina propozitiile
“{friendName} are {age} ani.”`);
const friendDisplay = person.friends.map((friend) => {
  const { name, age } = friend;
  return `${name} are ${age} ani.`;
});
console.log(friendDisplay);

console.warn(`Folosind metoda map pe arrayul friends,
 returneaza un array care contine numele inversat al
 prietenilor pe fiecare pozitie (exemplu: Stevenson Steven)`);
const friendReverseName = person.friends.map((friend) => {
  const { name, surname } = friend;
  return `${surname} ${name}.`;
});
console.log(friendReverseName);

console.warn(`Folosind metoda map pe arrayul friends, returneaza
un array care contine pe fiecare pozitie diferenta dintre lungimea
 totala al numelui complet (fara spatii) si varsta prietenului de
 pe iteratie
`);
const friendNameLength = person.friends.map((friend) => {
  const { name, surname, age } = friend;
  const fullName = name + surname;
  return fullName.length - age;
});
console.log(friendNameLength);

console.warn(`Folosind metoda map pe arrayul skills returneaza un
array care contine diferenta dintre lungimea fiecarui skill
si varsta prietenului `);
const friendSkillLength = person.skills.map((skill, index) => {
  const friendIndex = index % person.friends.length;
  const age = person.friends[friendIndex].age;
  return skill.length - age;
});

console.log(friendSkillLength);
