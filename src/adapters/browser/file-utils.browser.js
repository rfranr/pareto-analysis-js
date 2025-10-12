export async function readFilesAsText(fileList) {
  const readers = [...fileList].map(
    file => file.text().then(text => ({ name: file.name, text }))
  );
  return Promise.all(readers);
}