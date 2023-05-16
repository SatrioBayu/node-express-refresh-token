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

module.exports = {
  noFileUploaded,
};
