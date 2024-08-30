import express from 'express';
const expressApp = express();
const port = 2500;

expressApp.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

export default expressApp;
