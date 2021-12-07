console.clear();
const readline = require('readline');

const UserRepository = require('./repositories/userRepository');
const UniversityRepository = require('./repositories/universityRepository');

const readlineInterface = readline.createInterface(
  process.stdin,
  process.stdout
);

const userRepository = new UserRepository('./data/users.json');
const universityRepository = new UniversityRepository(
  './data/universities.json'
);

function ask(questionText) {
  return new Promise(resolve => {
    readlineInterface.question(questionText, resolve);
  });
}

function isIsoDate(str) {
  // example: 2000-10-31T00:00:00.000Z

  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
  const d = new Date(str);
  return d.toISOString() === str;
}

onInput();

async function onInput() {
  while (true) {
    const text = await ask('\nEnter your command: ');
    const parts = text.split('/');

    const command = parts[0];
    const entity = parts[1];
    const entityUuid = parts[2];

    if (command === 'get') {
      if (entity === 'user') {
        if (entityUuid) {
          const user = userRepository.getUserByUuid(entityUuid);
          if (user) console.log(user);
        } else {
          const users = userRepository.getUsers();
          users.forEach(user => {
            console.log(`--------------------
            UUID: ${user.uuid}
            name: ${user.login}`);
          });
          console.log(`--------------------`);
        }
      } else if (entity === 'university') {
        if (entityUuid) {
          const university =
            universityRepository.getUniversityByUuid(entityUuid);
          if (university) console.log(university);
        } else {
          const universities = universityRepository.getUniversities();
          universities.forEach(university => {
            console.log(`--------------------
			UUID: ${university.uuid}
			name: ${university.name}
			country: ${university.country}`);
          });
          console.log(`--------------------`);
        }
      } else if (!entity) {
        console.log(`You haven't selected an entity`);
      } else {
        console.log(`This entity doesn't exist`);
      }
    } else if (command === 'delete') {
      if (entity === 'university') {
        if (entityUuid) {
          const items = universityRepository.getUniversities();
          const requiredUuid = items.findIndex(
            item => item.uuid === entityUuid
          );
          if (requiredUuid === -1) console.log('This index is missing');
          else {
            universityRepository.deleteUniversity(requiredUuid);
          }
        } else console.log(`You haven't selected an index`);
      } else if (!entity) {
        console.log(`You haven't selected an entity`);
      } else {
        console.log(`This entity doesn't exist`);
      }
    } else if (command === 'update') {
      if (entity === 'university') {
        if (entityUuid) {
          const items = universityRepository.getUniversities();
          const requiredUuid = items.findIndex(
            item => item.uuid === entityUuid
          );
          if (requiredUuid === -1) console.log('This index is missing');
          else {
            console.log(
              `Input new value(or press 'ENTER' to keep the original)`
            );
            items[requiredUuid].name =
              (await ask(`name: `)) || items[requiredUuid].name;
            items[requiredUuid].country =
              (await ask(`country: `)) || items[requiredUuid].country;

            let numOfStudents;
            do {
              numOfStudents = +(
                (await ask(`num of students: `)) ||
                items[requiredUuid].numOfStudents
              );
            } while (!numOfStudents);
            items[requiredUuid].numOfStudents = numOfStudents;

            let campus;
            do {
              campus = +((await ask(`campus: `)) || items[requiredUuid].campus);
            } while (!campus);
            items[requiredUuid].campus = campus;

            let foundationDate;
            do {
              foundationDate =
                (await ask(`foundation date: `)) ||
                items[requiredUuid].foundationDate;
            } while (!isIsoDate(foundationDate));
            items[requiredUuid].foundationDate = foundationDate;
            universityRepository.updateUniversity(items);
          }
        } else console.log(`You haven't selected an index`);
      } else if (!entity) {
        console.log(`You haven't selected an entity`);
      } else {
        console.log(`This entity doesn't exist`);
      }
    } else if (command === 'post') {
      if (entity === 'university') {
        const items = universityRepository.getUniversities();
        const item = {};
        console.log(`Fill in the fields for the new university`);

        item.uuid = uuidv4();
        do {
          item.name = await ask(`name: `);
        } while (!item.name);
        do {
          item.country = await ask(`country: `);
        } while (!item.country);
        do {
          item.numOfStudents = +(await ask(`num of students: `));
        } while (!item.numOfStudents);
        do {
          item.campus = +(await ask(`campus: `));
        } while (!item.campus);
        do {
          item.foundationDate = await ask(`foundation date: `);
        } while (!isIsoDate(item.foundationDate));

        items.push(item);
        universityRepository.addUniversity(items);
      } else console.log(`You haven't selected an index`);
    } else if (command === 'exit') {
      process.exit(0);
    } else {
      console.log(`Not supported command: '${command}'`);
    }
  }
}
