/**
 * Official Indian District Census Population Dataset (Census of India / NITI Aayog).
 * Keyed by normalized canonical District name or State-District identifier.
 */
export const DISTRICT_CENSUS_POPULATION: Record<string, number> = {
  'Thane': 11060148,
  'North 24 Parganas': 10009781,
  'Bengaluru Urban': 9621551,
  'Pune': 9429408,
  'Mumbai Suburban': 9356962,
  'South 24 Parganas': 8161961,
  'Barddhaman': 7717563,
  'Ahmedabad': 7214225,
  'Murshidabad': 7103807,
  'Jaipur': 6626178,
  'Nashik': 6107187,
  'Surat': 6081322,
  'Paschim Medinipur': 5913457,
  'Patna': 5838465,
  'Allahabad': 5954391,
  'Prayagraj': 5954391,
  'Kancheepuram': 3998252,
  'Vellore': 3936331,
  'Tiruvallur': 3728104,
  'Salem': 3482056,
  'Viluppuram': 3458873,
  'Coimbatore': 3458045,
  'Tirunelveli': 3077233,
  'Madurai': 3038252,
  'Tiruchirappalli': 2722290,
  'Cuddalore': 2605914,
  'Tiruppur': 2479052,
  'Tiruvannamalai': 2464875,
  'Thanjavur': 2405890,
  'Erode': 2251744,
  'Dindigul': 2159775,
  'Virudhunagar': 1942288,
  'Krishnagiri': 1879809,
  'Kanniyakumari': 1870374,
  'Thoothukkudi': 1750176,
  'Namakkal': 1726601,
  'Pudukkottai': 1618345,
  'Nagapattinam': 1616450,
  'Dharmapuri': 1506843,
  'Ramanathapuram': 1353445,
  'Sivaganga': 1339101,
  'Thiruvarur': 1264282,
  'Theni': 1245899,
  'Karur': 1064493,
  'Ariyalur': 754894,
  'The Nilgiris': 735394,
  'Perambalur': 565223,
  'Chennai': 4646732,
  'Nagpur': 4653570,
  'Lucknow': 4589838,
  'Kanpur Nagar': 4581268,
  'Agra': 4418797,
  'Varanasi': 3676841,
  'Hyderabad': 3943323,
  'Guntur': 4887813,
  'Krishna': 4517398,
  'East Godavari': 5154296,
  'West Godavari': 3936966,
  'Visakhapatnam': 4290589,
  'Kurnool': 4053463,
  'Ananthapuramu': 4081148,
  'Chittoor': 4174064,
  'Bhopal': 2371061,
  'Indore': 3276697,
  'Gwalior': 2032036,
  'Jabalpur': 2463289,
  'Gaya': 4391418,
  'Muzaffarpur': 4801062,
  'Ranchi': 2914253,
  'Dhanbad': 2684487,
  'East Singhbhum': 2293919,
  'Kolkata': 4496694,
  'Howrah': 4850029,
  'Hooghly': 5519145,
  'Ludhiana': 3498739,
  'Amritsar': 2490656,
  'Jalandhar': 2193590,
  'Gurugram': 1514432,
  'Faridabad': 1809733,
  'Karnal': 1505324,
  'Dehradun': 1696694,
  'Haridwar': 1890422,
  'Kamrup Metropolitan': 1253938,
  'Chandigarh': 1055450,
  'New Delhi': 142004,
  'South Delhi': 2731929,
  'North Delhi': 887978,
  'West Delhi': 2543243,
  'East Delhi': 1709346,
};

export function getDistrictPopulation(districtName: string): number | null {
  if (!districtName) return null;
  const cleanName = districtName.replace(/\s+district/i, '').trim();

  if (DISTRICT_CENSUS_POPULATION[cleanName]) {
    return DISTRICT_CENSUS_POPULATION[cleanName];
  }

  const lower = cleanName.toLowerCase();
  for (const [key, val] of Object.entries(DISTRICT_CENSUS_POPULATION)) {
    if (key.toLowerCase() === lower) {
      return val;
    }
  }

  return null;
}
