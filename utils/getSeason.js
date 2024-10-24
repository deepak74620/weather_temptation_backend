export default getSeason=(temp,precip)=> {
    if (precip > 2) {
      return 'rainy';
    } else if (temp > 30) {
      return 'summer';
    } else if (temp > 20 && temp <= 30) {
      return 'spring';
    } else if (temp > 15 && temp <= 20) {
      return 'fall';
    } else {
      return 'winter';
    }
  }