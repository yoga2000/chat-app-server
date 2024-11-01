async function convertISOTo12Hour(isoString) {
  if (!isoString) {
    return null;
  }
  const date = new Date(isoString);
  const options = { hour: "numeric", minute: "numeric", hour12: true };
  return date.toLocaleString("en-US", options);
}

module.exports = convertISOTo12Hour;
