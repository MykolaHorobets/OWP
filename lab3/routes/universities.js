const { Router } = require('express');
const router = Router();

const PORT = process.env.PORT || 3000;
const http = require('http');

const uuidv4 = require('uuid-v4');
const University = require('../models/university');

const MediaRepository = require('../repositories/mediaRepository');
const mediaRepository = new MediaRepository('data/media.json');

router.get('/', (req, res) => {
  const name = req.query.name;
  const currentPage = req.query.page || 1;
  http.get(
    `http://localhost:${PORT}/api/universities?page=${currentPage}&name=${
      name || ''
    }`,
    async apiRes => {
      apiRes.setEncoding('utf8');
      let rawData = '';
      await apiRes.on('data', chunk => {
        rawData += chunk;
      });
      const universities = JSON.parse(rawData);

      universities.page = [...Array(universities.numOfPages + 1).keys()].slice(
        1
      );

      // console.log(universities);
      res.render('universities', {
        title: 'Universities',
        isUniversities: true,
        universities,
        name,
        currentPage,
      });
    }
  );
});

router.get('/new', (req, res) => {
  res.render('newUniversity', {
    title: 'Create new university',
  });
});

router.post('/new', (req, res) => {
  const university = new University(
    uuidv4(),
    req.body['name'] || res.status(400).send(`name not entered`),
    req.body['country'] || res.status(400).send(`country not entered`),
    req.body['numOfStudents'],
    req.body['campus'],
    req.body['foundationDate']
  );
  if (req.files) university.unImage = `/api/media/${req.files['unImage'].md5}`;

  const apiReqToUniversity = http.request(
    {
      hostname: 'localhost',
      port: PORT,
      path: '/api/universities',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    },
    apiRes => {
      console.log(`statusCode: ${apiRes.statusCode}`);

      apiRes.on('data', d => {
        process.stdout.write(d);
      });
    }
  );
  apiReqToUniversity.on('error', error => {
    console.error(error);
  });

  apiReqToUniversity.write(JSON.stringify(university));
  apiReqToUniversity.end();

  if (req.files) {
    const image = {};
    image['id'] = req.files['unImage'].md5;
    image['path'] = `./uploads/${req.files['unImage'].name}`;

    const images = mediaRepository.getMedia();
    const isImage = images.find(img => img.id === image.id);

    if (!isImage) {
      req.files['unImage'].mv('./uploads/' + req.files['unImage'].name);
      images.push(image);
      mediaRepository.addMedia(images);
    }
  }

  res.status(201).redirect(`/universities/${university.uuid}`);
});

router.get('/:id', (req, res) => {
  http.get(
    `http://localhost:${PORT}/api/universities/${req.params.id}`,
    async apiRes => {
      if (apiRes.statusCode >= 400) {
        res.render('university', {
          title: 'Not found',
        });
        return;
      }

      apiRes.setEncoding('utf8');
      let rawData = '';
      await apiRes.on('data', chunk => {
        rawData += chunk;
      });
      const university = JSON.parse(rawData);

      // console.log(university);
      res.render('university', {
        title: university.name,
        university,
      });
    }
  );
});

router.post('/:id', (req, res) => {
  const apiReqToUniversity = http.request(
    {
      hostname: 'localhost',
      port: PORT,
      path: `/api/universities/${req.body.uuid}`,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    },
    apiRes => {
      console.log(`statusCode: ${apiRes.statusCode}`);

      apiRes.on('data', d => {
        process.stdout.write(d);
      });
    }
  );
  apiReqToUniversity.on('error', error => {
    console.error(error);
  });

  apiReqToUniversity.write(req.body.uuid);
  apiReqToUniversity.end();

  res.status(200).redirect('/universities');
});

module.exports = router;
