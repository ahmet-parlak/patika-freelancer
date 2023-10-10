/**
 * Generates a random image name by appending a random string to a given base name.
 * The random string consists of alphanumeric characters and underscores.
 *
 * @param {string} name - The base name for the image.
 * @returns {string} A randomly generated image name in the format "randomString_name".
 */
const generateRandomImageName = (name) => {
  return (Math.random() + 1).toString(36).substring(7) + '_' + name;
};

module.exports = { generateRandomImageName };
