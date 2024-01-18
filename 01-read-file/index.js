const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'text.txt');
const readStream = fs.ReadStream(filePath, { encoding: 'utf8' });

//  обрабатывает каждый кусок данных (chunk) и выводит его в консоль без добавления новой строки.
readStream.on('data', (chunk) => {
  console.log(chunk);
});

// сообщает о завершении чтения файла.
readStream.on('end', () => {
  console.log('File reading completed.');
});

// обрабатывает ошибку при чтении файла.
readStream.on('error', (err) => {
  console.error('Error reading the file:', err);
});
