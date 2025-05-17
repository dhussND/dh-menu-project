import Parse from 'parse';

export const getAvailableDiningHalls = async () => {
  try {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = today.toLocaleDateString('en-US', options);
    
    const query = new Parse.Query('Menu');
    query.equalTo('date', formattedDate);
    const results = await query.find();
    
    // Get unique dining halls
    const diningHalls = [...new Set(results.map(result => result.get('diningHall')))];
    return diningHalls;
  } catch (error) {
    console.error('Error fetching available dining halls:', error);
    return [];
  }
}; 