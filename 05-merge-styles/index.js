const fs = require('fs/promises');
const path = require('path');

const bundle = path.join(__dirname, 'project-dist', 'bundle.css');
const folder = path.join(__dirname, 'styles');

async function write(folder) {
  try {
    // fs.mkdir строка является мерой предосторожности,
    // позволяющей убедиться в существовании целевого каталога перед работой с файлами,
    // что способствует созданию более надежного и устойчивого к ошибкам сценария.
    // { recursive: true }опция гарантирует, что если родительские каталоги не существуют, они также будут созданы.
    await fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true });

    try {
      await fs.access(bundle, fs.constants.F_OK); // метод проверки существования файла или каталога
      console.log(`${bundle} файл существует, будет удален, и собран занаво.`);
      await fs.unlink(bundle); // удаление файла
    } catch (accessErr) {
      if (accessErr.code !== 'ENOENT') {
        // ENOENT ошибки (нет такого файла или каталога) при проверке файла или доступе к нему.
        throw accessErr;
      }
    }

    const styleFolder = await fs.readdir(folder);
    for (let item of styleFolder) {
      const styleFile = path.join(folder, item);
      const stats = await fs.stat(styleFile);

      if (stats.isFile() && path.extname(item) === '.css') {
        const fileData = await fs.readFile(styleFile, 'utf-8');
        await fs.appendFile(bundle, fileData + '\n', 'utf-8'); // fs.promises.appendFileфункция позволяет открыть файл для добавления и записать в него
      } else if (stats.isDirectory()) {
        await write(styleFile);
      }
    }
  } catch (err) {
    console.error(err.message);
  }
}

write(folder);
