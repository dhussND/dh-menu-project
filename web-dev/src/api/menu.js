import Parse from 'parse';

export const getAvailableDiningHalls = async () => {
  try {
    const today = new Date();
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'America/New_York',
    };
    const formattedDate = today.toLocaleDateString('en-US', options);
    
    const query = new Parse.Query('Menu');
    query.equalTo('date', formattedDate);
    // Use the distinct query to get unique dining halls directly
    const diningHalls = await query.distinct('diningHall');
    return diningHalls;
  } catch (error) {
    console.error('Error fetching available dining halls:', error);
    return [];
  }
}; 
