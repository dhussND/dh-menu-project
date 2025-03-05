export async function getMenuData() {
  const response = await fetch("/menu_data.json"); // Replace with actual path
  const textData = await response.text(); // Read as text first
  try {
    return JSON.parse(textData); // Convert to an object
  } catch (error) {
    console.error("Error parsing menu data:", error);
    return {}; // Return an empty object if JSON parsing fails
  }
}
