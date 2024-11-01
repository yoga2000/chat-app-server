const roomIdCreationName = (empIds) => {
  const sortedIds = empIds.sort((a, b) => {
    const numA = parseInt(a.slice(3), 10); // Extract numeric part
    const numB = parseInt(b.slice(3), 10);
    return numA - numB; // Sort in ascending order
  });
  const joinedString = sortedIds.join("_");
  console.log(joinedString);
  return joinedString;
};

module.exports = roomIdCreationName;
