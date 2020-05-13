module.exports.splitLocation = function (location) {
  const split = location.split(":");

  if (!split[0] || !split[1]) {
    return;
  }

  const col = +split[0].replace(/[A-z]/, "");
  const row = +split[1].replace(/[A-z]/, "");

  return {
    col,
    row,
  };
};
