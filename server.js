const express = require('express');
const app = express();
const path = require('path');

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Palette Picker';

app
  .use(express.static(path.join(__dirname, 'public')))
  .listen(app.get('port'), () => {
    console.log(`${app.localts.title} is running on ${app.get('port')}.`);
  });
