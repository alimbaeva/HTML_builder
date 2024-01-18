// fs.stat -- https://www.geeksforgeeks.org/node-js-fs-stat-method/

const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error('Ошибка чтения каталога:', err);
    return;
  }

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);

    fs.stat(filePath, (statErr, stats) => {
      if (statErr) {
        console.error(`Ошибка получения информации о файле ${file}:`, statErr);
        return;
      }

      if (stats.isFile()) {
        const fileName = path.parse(file).name;
        const fileExtension = path.parse(file).ext.slice(1); // Убираем точку в начале расширения
        const fileSize = stats.size;

        console.log(`${fileName} - ${fileExtension} - ${fileSize} bytes`);
      }
    });
  });
});
