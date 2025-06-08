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
    // Fetch all records for the date to ensure all dining halls are accounted for
    // Parse's default limit of 100 results can exclude halls when one hall has
    // more than 100 menu items.
    query.limit(1000);
    // Only request the diningHall field to minimize data transfer
    query.select('diningHall');
    const results = await query.find();
    
    // Get unique dining halls
    const diningHalls = [...new Set(results.map(result => result.get('diningHall')))];
    return diningHalls;
  } catch (error) {
    console.error('Error fetching available dining halls:', error);
    return [];
  }
}; 
