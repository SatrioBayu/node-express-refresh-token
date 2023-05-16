const noFileUploaded = () => {
  return {
    errors: [
      {
        code: "E-021",
        message: "File yang akan diupload tidak disediakan",
      },
    ],
  };
};

const onlyImageAllowed = () => {
  return {
    errors: [
      {
        code: "E-022",
        message: "Tipe file yang diperbolehkan hanya gambar",
      },
    ],
  };
};

module.exports = {
  noFileUploaded,
  onlyImageAllowed,
};
