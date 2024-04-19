const admin = require('firebase-admin');

const bucket = admin.storage().bucket();

async function uploadImageToStorage(file, fileName) {
  const fileUpload = bucket.file(fileName);

  const stream = fileUpload.createWriteStream({
    metadata: {
      contentType: file.mimetype
    }
  });

  return new Promise((resolve, reject) => {
    stream.on('error', (error) => {
      reject(error);
    });

    stream.on('finish', () => {
      const url = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
      resolve(url);
    });

    stream.end(file.buffer);
  });
}

module.exports = {
  uploadImageToStorage
};
