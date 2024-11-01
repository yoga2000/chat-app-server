function formatChatTimestamp(input) {
  // Define a regex to match the expected time format (e.g., "hh:mm AM/PM")
  const timeFormatRegex = /^(0?[1-9]|1[0-2]):([0-5][0-9]) [APM]{2}$/;

  // Check if the input matches the time format
  if (typeof input === "string" && timeFormatRegex.test(input)) {
    return input; // Return the formatted message directly
  }

  // If it's not formatted, assume it's a timestamp
  const date = new Date(input);
  
  // Check for invalid date
  if (isNaN(date.getTime())) {
    return "Invalid date"; // Handle invalid date
  }

  const options = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // Set to `false` for 24-hour format
  };

  return date.toLocaleTimeString(undefined, options);
}

export default formatChatTimestamp;
