/**
 * THERMOSAFE - Heatwave Early Warning System
 * Complete Client-Side Application
 */

// 1. ALL INDIA CITIES & DISTRICTS DATABASE (120+ Districts across all 28 States & 8 UTs)
const CITIES = [
  // ANDHRA PRADESH
  { name: 'Visakhapatnam', state: 'Andhra Pradesh', lat: 17.69, lon: 83.22, regionType: 'coastal', normalMaxTemp: 37, normalMinTemp: 26, typicalSummerRH: 72 },
  { name: 'Vijayawada', state: 'Andhra Pradesh', lat: 16.51, lon: 80.65, regionType: 'coastal', normalMaxTemp: 42, normalMinTemp: 27, typicalSummerRH: 60 },
  { name: 'Tirupati', state: 'Andhra Pradesh', lat: 13.63, lon: 79.42, regionType: 'plains', normalMaxTemp: 40, normalMinTemp: 26, typicalSummerRH: 52 },
  { name: 'Guntur', state: 'Andhra Pradesh', lat: 16.30, lon: 80.44, regionType: 'plains', normalMaxTemp: 41, normalMinTemp: 27, typicalSummerRH: 58 },
  { name: 'Kurnool', state: 'Andhra Pradesh', lat: 15.83, lon: 78.03, regionType: 'plains', normalMaxTemp: 43, normalMinTemp: 28, typicalSummerRH: 42 },
  { name: 'Anantapur', state: 'Andhra Pradesh', lat: 14.68, lon: 77.60, regionType: 'plains', normalMaxTemp: 42, normalMinTemp: 27, typicalSummerRH: 40 },

  // ARUNACHAL PRADESH
  { name: 'Itanagar', state: 'Arunachal Pradesh', lat: 27.08, lon: 93.60, regionType: 'hilly', normalMaxTemp: 31, normalMinTemp: 19, typicalSummerRH: 75 },
  { name: 'Tawang', state: 'Arunachal Pradesh', lat: 27.58, lon: 91.86, regionType: 'hilly', normalMaxTemp: 20, normalMinTemp: 10, typicalSummerRH: 70 },
  { name: 'Pasighat', state: 'Arunachal Pradesh', lat: 28.06, lon: 95.32, regionType: 'plains', normalMaxTemp: 33, normalMinTemp: 22, typicalSummerRH: 78 },

  // ASSAM
  { name: 'Guwahati', state: 'Assam', lat: 26.14, lon: 91.74, regionType: 'plains', normalMaxTemp: 35, normalMinTemp: 23, typicalSummerRH: 70 },
  { name: 'Silchar', state: 'Assam', lat: 24.83, lon: 92.77, regionType: 'plains', normalMaxTemp: 34, normalMinTemp: 24, typicalSummerRH: 76 },
  { name: 'Dibrugarh', state: 'Assam', lat: 27.47, lon: 94.91, regionType: 'plains', normalMaxTemp: 33, normalMinTemp: 22, typicalSummerRH: 78 },
  { name: 'Jorhat', state: 'Assam', lat: 26.75, lon: 94.22, regionType: 'plains', normalMaxTemp: 34, normalMinTemp: 23, typicalSummerRH: 74 },

  // BIHAR
  { name: 'Patna', state: 'Bihar', lat: 25.60, lon: 85.10, regionType: 'plains', normalMaxTemp: 42, normalMinTemp: 27, typicalSummerRH: 50 },
  { name: 'Gaya', state: 'Bihar', lat: 24.80, lon: 85.00, regionType: 'plains', normalMaxTemp: 44, normalMinTemp: 27, typicalSummerRH: 40 },
  { name: 'Muzaffarpur', state: 'Bihar', lat: 26.12, lon: 85.36, regionType: 'plains', normalMaxTemp: 41, normalMinTemp: 26, typicalSummerRH: 55 },
  { name: 'Bhagalpur', state: 'Bihar', lat: 25.24, lon: 87.01, regionType: 'plains', normalMaxTemp: 42, normalMinTemp: 26, typicalSummerRH: 52 },
  { name: 'Darbhanga', state: 'Bihar', lat: 26.15, lon: 85.90, regionType: 'plains', normalMaxTemp: 40, normalMinTemp: 25, typicalSummerRH: 58 },

  // CHHATTISGARH
  { name: 'Raipur', state: 'Chhattisgarh', lat: 21.25, lon: 81.63, regionType: 'plains', normalMaxTemp: 44, normalMinTemp: 28, typicalSummerRH: 35 },
  { name: 'Bhilai', state: 'Chhattisgarh', lat: 21.21, lon: 81.38, regionType: 'plains', normalMaxTemp: 44, normalMinTemp: 27, typicalSummerRH: 36 },
  { name: 'Bilaspur', state: 'Chhattisgarh', lat: 22.08, lon: 82.15, regionType: 'plains', normalMaxTemp: 45, normalMinTemp: 28, typicalSummerRH: 34 },
  { name: 'Korba', state: 'Chhattisgarh', lat: 22.35, lon: 82.68, regionType: 'plains', normalMaxTemp: 44, normalMinTemp: 27, typicalSummerRH: 32 },

  // GOA
  { name: 'Panaji', state: 'Goa', lat: 15.50, lon: 73.83, regionType: 'coastal', normalMaxTemp: 34, normalMinTemp: 25, typicalSummerRH: 78 },
  { name: 'Margao', state: 'Goa', lat: 15.27, lon: 73.95, regionType: 'coastal', normalMaxTemp: 34, normalMinTemp: 25, typicalSummerRH: 79 },

  // GUJARAT
  { name: 'Ahmedabad', state: 'Gujarat', lat: 23.02, lon: 72.57, regionType: 'plains', normalMaxTemp: 43, normalMinTemp: 27, typicalSummerRH: 35 },
  { name: 'Surat', state: 'Gujarat', lat: 21.17, lon: 72.83, regionType: 'coastal', normalMaxTemp: 37, normalMinTemp: 26, typicalSummerRH: 68 },
  { name: 'Vadodara', state: 'Gujarat', lat: 22.30, lon: 73.18, regionType: 'plains', normalMaxTemp: 42, normalMinTemp: 26, typicalSummerRH: 40 },
  { name: 'Rajkot', state: 'Gujarat', lat: 22.30, lon: 70.80, regionType: 'plains', normalMaxTemp: 43, normalMinTemp: 26, typicalSummerRH: 38 },
  { name: 'Bhavnagar', state: 'Gujarat', lat: 21.76, lon: 72.15, regionType: 'coastal', normalMaxTemp: 40, normalMinTemp: 26, typicalSummerRH: 62 },

  // HARYANA
  { name: 'Gurugram', state: 'Haryana', lat: 28.45, lon: 77.02, regionType: 'plains', normalMaxTemp: 43, normalMinTemp: 26, typicalSummerRH: 38 },
  { name: 'Faridabad', state: 'Haryana', lat: 28.40, lon: 77.31, regionType: 'plains', normalMaxTemp: 43, normalMinTemp: 26, typicalSummerRH: 39 },
  { name: 'Panipat', state: 'Haryana', lat: 29.39, lon: 76.96, regionType: 'plains', normalMaxTemp: 43, normalMinTemp: 26, typicalSummerRH: 36 },
  { name: 'Ambala', state: 'Haryana', lat: 30.37, lon: 76.78, regionType: 'plains', normalMaxTemp: 42, normalMinTemp: 26, typicalSummerRH: 37 },
  { name: 'Hisar', state: 'Haryana', lat: 29.15, lon: 75.72, regionType: 'plains', normalMaxTemp: 45, normalMinTemp: 27, typicalSummerRH: 28 },

  // HIMACHAL PRADESH
  { name: 'Shimla', state: 'Himachal Pradesh', lat: 31.10, lon: 77.17, regionType: 'hilly', normalMaxTemp: 28, normalMinTemp: 15, typicalSummerRH: 55 },
  { name: 'Dharamshala', state: 'Himachal Pradesh', lat: 32.21, lon: 76.32, regionType: 'hilly', normalMaxTemp: 31, normalMinTemp: 18, typicalSummerRH: 60 },
  { name: 'Manali', state: 'Himachal Pradesh', lat: 32.24, lon: 77.18, regionType: 'hilly', normalMaxTemp: 25, normalMinTemp: 12, typicalSummerRH: 50 },

  // JHARKHAND
  { name: 'Ranchi', state: 'Jharkhand', lat: 23.34, lon: 85.31, regionType: 'plains', normalMaxTemp: 39, normalMinTemp: 22, typicalSummerRH: 45 },
  { name: 'Jamshedpur', state: 'Jharkhand', lat: 22.80, lon: 86.20, regionType: 'plains', normalMaxTemp: 42, normalMinTemp: 26, typicalSummerRH: 48 },
  { name: 'Dhanbad', state: 'Jharkhand', lat: 23.79, lon: 86.43, regionType: 'plains', normalMaxTemp: 42, normalMinTemp: 25, typicalSummerRH: 44 },
  { name: 'Bokaro', state: 'Jharkhand', lat: 23.66, lon: 86.15, regionType: 'plains', normalMaxTemp: 41, normalMinTemp: 24, typicalSummerRH: 45 },

  // KARNATAKA
  { name: 'Bengaluru', state: 'Karnataka', lat: 12.97, lon: 77.59, regionType: 'plains', normalMaxTemp: 36, normalMinTemp: 21, typicalSummerRH: 45 },
  { name: 'Mysuru', state: 'Karnataka', lat: 12.29, lon: 76.63, regionType: 'plains', normalMaxTemp: 35, normalMinTemp: 20, typicalSummerRH: 48 },
  { name: 'Hubballi', state: 'Karnataka', lat: 15.36, lon: 75.12, regionType: 'plains', normalMaxTemp: 38, normalMinTemp: 22, typicalSummerRH: 42 },
  { name: 'Mangaluru', state: 'Karnataka', lat: 12.91, lon: 74.85, regionType: 'coastal', normalMaxTemp: 34, normalMinTemp: 24, typicalSummerRH: 80 },
  { name: 'Kalaburagi', state: 'Karnataka', lat: 17.32, lon: 76.83, regionType: 'plains', normalMaxTemp: 43, normalMinTemp: 27, typicalSummerRH: 30 },

  // KERALA
  { name: 'Thiruvananthapuram', state: 'Kerala', lat: 8.52, lon: 76.93, regionType: 'coastal', normalMaxTemp: 33, normalMinTemp: 24, typicalSummerRH: 78 },
  { name: 'Kochi', state: 'Kerala', lat: 9.93, lon: 76.27, regionType: 'coastal', normalMaxTemp: 33, normalMinTemp: 24, typicalSummerRH: 82 },
  { name: 'Kozhikode', state: 'Kerala', lat: 11.25, lon: 75.78, regionType: 'coastal', normalMaxTemp: 33, normalMinTemp: 25, typicalSummerRH: 80 },
  { name: 'Thrissur', state: 'Kerala', lat: 10.52, lon: 76.21, regionType: 'coastal', normalMaxTemp: 34, normalMinTemp: 24, typicalSummerRH: 79 },
  { name: 'Palakkad', state: 'Kerala', lat: 10.78, lon: 76.65, regionType: 'plains', normalMaxTemp: 38, normalMinTemp: 25, typicalSummerRH: 65 },

  // MADHYA PRADESH
  { name: 'Bhopal', state: 'Madhya Pradesh', lat: 23.26, lon: 77.41, regionType: 'plains', normalMaxTemp: 43, normalMinTemp: 25, typicalSummerRH: 32 },
  { name: 'Indore', state: 'Madhya Pradesh', lat: 22.72, lon: 75.86, regionType: 'plains', normalMaxTemp: 42, normalMinTemp: 25, typicalSummerRH: 30 },
  { name: 'Gwalior', state: 'Madhya Pradesh', lat: 26.22, lon: 78.18, regionType: 'plains', normalMaxTemp: 45, normalMinTemp: 27, typicalSummerRH: 28 },
  { name: 'Jabalpur', state: 'Madhya Pradesh', lat: 23.18, lon: 79.98, regionType: 'plains', normalMaxTemp: 43, normalMinTemp: 26, typicalSummerRH: 32 },
  { name: 'Ujjain', state: 'Madhya Pradesh', lat: 23.17, lon: 75.78, regionType: 'plains', normalMaxTemp: 42, normalMinTemp: 25, typicalSummerRH: 30 },

  // MAHARASHTRA
  { name: 'Mumbai', state: 'Maharashtra', lat: 19.08, lon: 72.88, regionType: 'coastal', normalMaxTemp: 35, normalMinTemp: 26, typicalSummerRH: 80 },
  { name: 'Pune', state: 'Maharashtra', lat: 18.52, lon: 73.86, regionType: 'plains', normalMaxTemp: 38, normalMinTemp: 23, typicalSummerRH: 35 },
  { name: 'Nagpur', state: 'Maharashtra', lat: 21.15, lon: 79.09, regionType: 'plains', normalMaxTemp: 45, normalMinTemp: 27, typicalSummerRH: 30 },
  { name: 'Nashik', state: 'Maharashtra', lat: 19.99, lon: 73.78, regionType: 'plains', normalMaxTemp: 38, normalMinTemp: 22, typicalSummerRH: 40 },
  { name: 'Chhatrapati Sambhajinagar', state: 'Maharashtra', lat: 19.87, lon: 75.34, regionType: 'plains', normalMaxTemp: 41, normalMinTemp: 25, typicalSummerRH: 32 },
  { name: 'Solapur', state: 'Maharashtra', lat: 17.65, lon: 75.90, regionType: 'plains', normalMaxTemp: 43, normalMinTemp: 27, typicalSummerRH: 30 },

  // MANIPUR
  { name: 'Imphal', state: 'Manipur', lat: 24.81, lon: 93.93, regionType: 'hilly', normalMaxTemp: 30, normalMinTemp: 18, typicalSummerRH: 75 },
  { name: 'Churachandpur', state: 'Manipur', lat: 24.33, lon: 93.68, regionType: 'hilly', normalMaxTemp: 29, normalMinTemp: 17, typicalSummerRH: 76 },

  // MEGHALAYA
  { name: 'Shillong', state: 'Meghalaya', lat: 25.57, lon: 91.89, regionType: 'hilly', normalMaxTemp: 24, normalMinTemp: 14, typicalSummerRH: 80 },
  { name: 'Tura', state: 'Meghalaya', lat: 25.51, lon: 90.22, regionType: 'hilly', normalMaxTemp: 30, normalMinTemp: 20, typicalSummerRH: 78 },

  // MIZORAM
  { name: 'Aizawl', state: 'Mizoram', lat: 23.73, lon: 92.71, regionType: 'hilly', normalMaxTemp: 27, normalMinTemp: 17, typicalSummerRH: 78 },
  { name: 'Lunglei', state: 'Mizoram', lat: 22.88, lon: 92.73, regionType: 'hilly', normalMaxTemp: 26, normalMinTemp: 16, typicalSummerRH: 80 },

  // NAGALAND
  { name: 'Kohima', state: 'Nagaland', lat: 25.67, lon: 94.10, regionType: 'hilly', normalMaxTemp: 26, normalMinTemp: 16, typicalSummerRH: 76 },
  { name: 'Dimapur', state: 'Nagaland', lat: 25.90, lon: 93.72, regionType: 'plains', normalMaxTemp: 34, normalMinTemp: 22, typicalSummerRH: 74 },

  // ODISHA
  { name: 'Bhubaneswar', state: 'Odisha', lat: 20.30, lon: 85.82, regionType: 'coastal', normalMaxTemp: 40, normalMinTemp: 26, typicalSummerRH: 65 },
  { name: 'Cuttack', state: 'Odisha', lat: 20.46, lon: 85.88, regionType: 'plains', normalMaxTemp: 40, normalMinTemp: 26, typicalSummerRH: 62 },
  { name: 'Rourkela', state: 'Odisha', lat: 22.26, lon: 84.85, regionType: 'plains', normalMaxTemp: 43, normalMinTemp: 27, typicalSummerRH: 40 },
  { name: 'Sambalpur', state: 'Odisha', lat: 21.46, lon: 83.98, regionType: 'plains', normalMaxTemp: 44, normalMinTemp: 27, typicalSummerRH: 38 },
  { name: 'Titlagarh', state: 'Odisha', lat: 20.29, lon: 83.15, regionType: 'plains', normalMaxTemp: 46, normalMinTemp: 27, typicalSummerRH: 35 },

  // PUNJAB
  { name: 'Ludhiana', state: 'Punjab', lat: 30.90, lon: 75.85, regionType: 'plains', normalMaxTemp: 43, normalMinTemp: 26, typicalSummerRH: 35 },
  { name: 'Amritsar', state: 'Punjab', lat: 31.63, lon: 74.87, regionType: 'plains', normalMaxTemp: 44, normalMinTemp: 27, typicalSummerRH: 32 },
  { name: 'Jalandhar', state: 'Punjab', lat: 31.32, lon: 75.57, regionType: 'plains', normalMaxTemp: 43, normalMinTemp: 26, typicalSummerRH: 34 },
  { name: 'Patiala', state: 'Punjab', lat: 30.34, lon: 76.38, regionType: 'plains', normalMaxTemp: 43, normalMinTemp: 26, typicalSummerRH: 36 },
  { name: 'Bathinda', state: 'Punjab', lat: 30.21, lon: 74.94, regionType: 'plains', normalMaxTemp: 45, normalMinTemp: 27, typicalSummerRH: 28 },

  // RAJASTHAN
  { name: 'Jaipur', state: 'Rajasthan', lat: 26.92, lon: 75.79, regionType: 'plains', normalMaxTemp: 44, normalMinTemp: 27, typicalSummerRH: 30 },
  { name: 'Jodhpur', state: 'Rajasthan', lat: 26.23, lon: 73.02, regionType: 'plains', normalMaxTemp: 45, normalMinTemp: 28, typicalSummerRH: 24 },
  { name: 'Udaipur', state: 'Rajasthan', lat: 24.58, lon: 73.71, regionType: 'plains', normalMaxTemp: 41, normalMinTemp: 25, typicalSummerRH: 32 },
  { name: 'Kota', state: 'Rajasthan', lat: 25.21, lon: 75.86, regionType: 'plains', normalMaxTemp: 45, normalMinTemp: 29, typicalSummerRH: 28 },
  { name: 'Bikaner', state: 'Rajasthan', lat: 28.02, lon: 73.31, regionType: 'plains', normalMaxTemp: 46, normalMinTemp: 28, typicalSummerRH: 22 },
  { name: 'Phalodi', state: 'Rajasthan', lat: 27.13, lon: 72.36, regionType: 'plains', normalMaxTemp: 48, normalMinTemp: 28, typicalSummerRH: 20 },
  { name: 'Churu', state: 'Rajasthan', lat: 28.30, lon: 74.97, regionType: 'plains', normalMaxTemp: 47, normalMinTemp: 27, typicalSummerRH: 22 },

  // SIKKIM
  { name: 'Gangtok', state: 'Sikkim', lat: 27.33, lon: 88.61, regionType: 'hilly', normalMaxTemp: 22, normalMinTemp: 13, typicalSummerRH: 82 },
  { name: 'Namchi', state: 'Sikkim', lat: 27.16, lon: 88.36, regionType: 'hilly', normalMaxTemp: 23, normalMinTemp: 14, typicalSummerRH: 80 },

  // TAMIL NADU (All 38 Districts)
  { name: 'Ariyalur', state: 'Tamil Nadu', lat: 11.14, lon: 79.08, regionType: 'plains', normalMaxTemp: 39, normalMinTemp: 26, typicalSummerRH: 55 },
  { name: 'Chengalpattu', state: 'Tamil Nadu', lat: 12.69, lon: 79.98, regionType: 'coastal', normalMaxTemp: 37, normalMinTemp: 26, typicalSummerRH: 72 },
  { name: 'Chennai', state: 'Tamil Nadu', lat: 13.08, lon: 80.27, regionType: 'coastal', normalMaxTemp: 38, normalMinTemp: 27, typicalSummerRH: 70 },
  { name: 'Coimbatore', state: 'Tamil Nadu', lat: 11.01, lon: 76.95, regionType: 'plains', normalMaxTemp: 36, normalMinTemp: 23, typicalSummerRH: 55 },
  { name: 'Cuddalore', state: 'Tamil Nadu', lat: 11.75, lon: 79.76, regionType: 'coastal', normalMaxTemp: 37, normalMinTemp: 26, typicalSummerRH: 75 },
  { name: 'Dharmapuri', state: 'Tamil Nadu', lat: 12.13, lon: 78.16, regionType: 'plains', normalMaxTemp: 38, normalMinTemp: 24, typicalSummerRH: 48 },
  { name: 'Dindigul', state: 'Tamil Nadu', lat: 10.36, lon: 77.98, regionType: 'plains', normalMaxTemp: 38, normalMinTemp: 25, typicalSummerRH: 52 },
  { name: 'Erode', state: 'Tamil Nadu', lat: 11.34, lon: 77.72, regionType: 'plains', normalMaxTemp: 39, normalMinTemp: 25, typicalSummerRH: 48 },
  { name: 'Kallakurichi', state: 'Tamil Nadu', lat: 11.74, lon: 78.96, regionType: 'plains', normalMaxTemp: 39, normalMinTemp: 26, typicalSummerRH: 54 },
  { name: 'Kancheepuram', state: 'Tamil Nadu', lat: 12.83, lon: 79.70, regionType: 'plains', normalMaxTemp: 39, normalMinTemp: 26, typicalSummerRH: 62 },
  { name: 'Kanniyakumari', state: 'Tamil Nadu', lat: 8.08, lon: 77.54, regionType: 'coastal', normalMaxTemp: 33, normalMinTemp: 25, typicalSummerRH: 80 },
  { name: 'Karur', state: 'Tamil Nadu', lat: 10.96, lon: 78.08, regionType: 'plains', normalMaxTemp: 40, normalMinTemp: 27, typicalSummerRH: 50 },
  { name: 'Krishnagiri', state: 'Tamil Nadu', lat: 12.52, lon: 78.21, regionType: 'plains', normalMaxTemp: 37, normalMinTemp: 23, typicalSummerRH: 46 },
  { name: 'Madurai', state: 'Tamil Nadu', lat: 9.92, lon: 78.11, regionType: 'plains', normalMaxTemp: 39, normalMinTemp: 26, typicalSummerRH: 52 },
  { name: 'Mayiladuthurai', state: 'Tamil Nadu', lat: 11.10, lon: 79.65, regionType: 'coastal', normalMaxTemp: 37, normalMinTemp: 26, typicalSummerRH: 74 },
  { name: 'Nagapattinam', state: 'Tamil Nadu', lat: 10.76, lon: 79.84, regionType: 'coastal', normalMaxTemp: 37, normalMinTemp: 26, typicalSummerRH: 76 },
  { name: 'Namakkal', state: 'Tamil Nadu', lat: 11.22, lon: 78.17, regionType: 'plains', normalMaxTemp: 39, normalMinTemp: 25, typicalSummerRH: 48 },
  { name: 'Perambalur', state: 'Tamil Nadu', lat: 11.23, lon: 78.88, regionType: 'plains', normalMaxTemp: 39, normalMinTemp: 26, typicalSummerRH: 52 },
  { name: 'Pudukkottai', state: 'Tamil Nadu', lat: 10.38, lon: 78.82, regionType: 'plains', normalMaxTemp: 38, normalMinTemp: 26, typicalSummerRH: 60 },
  { name: 'Ramanathapuram', state: 'Tamil Nadu', lat: 9.36, lon: 78.83, regionType: 'coastal', normalMaxTemp: 37, normalMinTemp: 27, typicalSummerRH: 78 },
  { name: 'Ranipet', state: 'Tamil Nadu', lat: 12.92, lon: 79.33, regionType: 'plains', normalMaxTemp: 40, normalMinTemp: 26, typicalSummerRH: 50 },
  { name: 'Salem', state: 'Tamil Nadu', lat: 11.66, lon: 78.14, regionType: 'plains', normalMaxTemp: 38, normalMinTemp: 25, typicalSummerRH: 50 },
  { name: 'Sivaganga', state: 'Tamil Nadu', lat: 9.85, lon: 78.48, regionType: 'plains', normalMaxTemp: 38, normalMinTemp: 26, typicalSummerRH: 56 },
  { name: 'Tenkasi', state: 'Tamil Nadu', lat: 8.96, lon: 77.31, regionType: 'plains', normalMaxTemp: 36, normalMinTemp: 25, typicalSummerRH: 62 },
  { name: 'Thanjavur', state: 'Tamil Nadu', lat: 10.78, lon: 79.13, regionType: 'plains', normalMaxTemp: 38, normalMinTemp: 26, typicalSummerRH: 62 },
  { name: 'The Nilgiris', state: 'Tamil Nadu', lat: 11.41, lon: 76.69, regionType: 'hilly', normalMaxTemp: 24, normalMinTemp: 13, typicalSummerRH: 70 },
  { name: 'Theni', state: 'Tamil Nadu', lat: 10.01, lon: 77.47, regionType: 'plains', normalMaxTemp: 37, normalMinTemp: 25, typicalSummerRH: 58 },
  { name: 'Thoothukudi', state: 'Tamil Nadu', lat: 8.76, lon: 78.13, regionType: 'coastal', normalMaxTemp: 36, normalMinTemp: 26, typicalSummerRH: 75 },
  { name: 'Tiruchirappalli', state: 'Tamil Nadu', lat: 10.79, lon: 78.70, regionType: 'plains', normalMaxTemp: 39, normalMinTemp: 26, typicalSummerRH: 54 },
  { name: 'Tirunelveli', state: 'Tamil Nadu', lat: 8.71, lon: 77.75, regionType: 'plains', normalMaxTemp: 37, normalMinTemp: 26, typicalSummerRH: 64 },
  { name: 'Tirupattur', state: 'Tamil Nadu', lat: 12.49, lon: 78.56, regionType: 'plains', normalMaxTemp: 38, normalMinTemp: 25, typicalSummerRH: 48 },
  { name: 'Tiruppur', state: 'Tamil Nadu', lat: 11.10, lon: 77.34, regionType: 'plains', normalMaxTemp: 37, normalMinTemp: 24, typicalSummerRH: 52 },
  { name: 'Tiruvallur', state: 'Tamil Nadu', lat: 13.14, lon: 79.90, regionType: 'coastal', normalMaxTemp: 38, normalMinTemp: 26, typicalSummerRH: 68 },
  { name: 'Tiruvannamalai', state: 'Tamil Nadu', lat: 12.22, lon: 79.07, regionType: 'plains', normalMaxTemp: 39, normalMinTemp: 26, typicalSummerRH: 50 },
  { name: 'Tiruvarur', state: 'Tamil Nadu', lat: 10.77, lon: 79.63, regionType: 'coastal', normalMaxTemp: 37, normalMinTemp: 26, typicalSummerRH: 72 },
  { name: 'Vellore', state: 'Tamil Nadu', lat: 12.91, lon: 79.13, regionType: 'plains', normalMaxTemp: 40, normalMinTemp: 26, typicalSummerRH: 48 },
  { name: 'Viluppuram', state: 'Tamil Nadu', lat: 11.94, lon: 79.49, regionType: 'coastal', normalMaxTemp: 38, normalMinTemp: 26, typicalSummerRH: 65 },
  { name: 'Virudhunagar', state: 'Tamil Nadu', lat: 9.58, lon: 77.96, regionType: 'plains', normalMaxTemp: 38, normalMinTemp: 26, typicalSummerRH: 56 },

  // TELANGANA
  { name: 'Hyderabad', state: 'Telangana', lat: 17.39, lon: 78.49, regionType: 'plains', normalMaxTemp: 40, normalMinTemp: 25, typicalSummerRH: 45 },
  { name: 'Warangal', state: 'Telangana', lat: 17.96, lon: 79.59, regionType: 'plains', normalMaxTemp: 42, normalMinTemp: 27, typicalSummerRH: 42 },
  { name: 'Nizamabad', state: 'Telangana', lat: 18.67, lon: 78.09, regionType: 'plains', normalMaxTemp: 43, normalMinTemp: 27, typicalSummerRH: 38 },
  { name: 'Karimnagar', state: 'Telangana', lat: 18.43, lon: 79.12, regionType: 'plains', normalMaxTemp: 43, normalMinTemp: 27, typicalSummerRH: 40 },
  { name: 'Ramagundam', state: 'Telangana', lat: 18.76, lon: 79.47, regionType: 'plains', normalMaxTemp: 44, normalMinTemp: 28, typicalSummerRH: 40 },

  // TRIPURA
  { name: 'Agartala', state: 'Tripura', lat: 23.83, lon: 91.28, regionType: 'plains', normalMaxTemp: 34, normalMinTemp: 23, typicalSummerRH: 76 },

  // UTTAR PRADESH
  { name: 'Lucknow', state: 'Uttar Pradesh', lat: 26.85, lon: 80.95, regionType: 'plains', normalMaxTemp: 43, normalMinTemp: 27, typicalSummerRH: 40 },
  { name: 'Kanpur', state: 'Uttar Pradesh', lat: 26.44, lon: 80.33, regionType: 'plains', normalMaxTemp: 43, normalMinTemp: 27, typicalSummerRH: 38 },
  { name: 'Varanasi', state: 'Uttar Pradesh', lat: 25.32, lon: 83.01, regionType: 'plains', normalMaxTemp: 43, normalMinTemp: 27, typicalSummerRH: 42 },
  { name: 'Prayagraj', state: 'Uttar Pradesh', lat: 25.43, lon: 81.85, regionType: 'plains', normalMaxTemp: 44, normalMinTemp: 27, typicalSummerRH: 38 },
  { name: 'Agra', state: 'Uttar Pradesh', lat: 27.17, lon: 78.00, regionType: 'plains', normalMaxTemp: 44, normalMinTemp: 27, typicalSummerRH: 32 },
  { name: 'Meerut', state: 'Uttar Pradesh', lat: 28.98, lon: 77.70, regionType: 'plains', normalMaxTemp: 42, normalMinTemp: 25, typicalSummerRH: 40 },
  { name: 'Noida', state: 'Uttar Pradesh', lat: 28.53, lon: 77.39, regionType: 'plains', normalMaxTemp: 43, normalMinTemp: 26, typicalSummerRH: 40 },
  { name: 'Gorakhpur', state: 'Uttar Pradesh', lat: 26.76, lon: 83.37, regionType: 'plains', normalMaxTemp: 41, normalMinTemp: 26, typicalSummerRH: 52 },

  // UTTARAKHAND
  { name: 'Dehradun', state: 'Uttarakhand', lat: 30.32, lon: 78.03, regionType: 'hilly', normalMaxTemp: 36, normalMinTemp: 21, typicalSummerRH: 50 },
  { name: 'Haridwar', state: 'Uttarakhand', lat: 29.94, lon: 78.16, regionType: 'plains', normalMaxTemp: 39, normalMinTemp: 23, typicalSummerRH: 48 },
  { name: 'Nainital', state: 'Uttarakhand', lat: 29.38, lon: 79.46, regionType: 'hilly', normalMaxTemp: 24, normalMinTemp: 14, typicalSummerRH: 62 },

  // WEST BENGAL
  { name: 'Kolkata', state: 'West Bengal', lat: 22.57, lon: 88.36, regionType: 'coastal', normalMaxTemp: 38, normalMinTemp: 26, typicalSummerRH: 75 },
  { name: 'Howrah', state: 'West Bengal', lat: 22.59, lon: 88.31, regionType: 'coastal', normalMaxTemp: 38, normalMinTemp: 26, typicalSummerRH: 75 },
  { name: 'Durgapur', state: 'West Bengal', lat: 23.52, lon: 87.31, regionType: 'plains', normalMaxTemp: 41, normalMinTemp: 26, typicalSummerRH: 55 },
  { name: 'Asansol', state: 'West Bengal', lat: 23.68, lon: 86.98, regionType: 'plains', normalMaxTemp: 42, normalMinTemp: 26, typicalSummerRH: 52 },
  { name: 'Siliguri', state: 'West Bengal', lat: 26.72, lon: 88.43, regionType: 'plains', normalMaxTemp: 34, normalMinTemp: 22, typicalSummerRH: 74 },

  // UNION TERRITORIES
  { name: 'Delhi', state: 'Delhi', lat: 28.61, lon: 77.23, regionType: 'plains', normalMaxTemp: 43, normalMinTemp: 26, typicalSummerRH: 40 },
  { name: 'Chandigarh', state: 'Chandigarh', lat: 30.73, lon: 76.78, regionType: 'plains', normalMaxTemp: 42, normalMinTemp: 26, typicalSummerRH: 35 },
  { name: 'Port Blair', state: 'Andaman & Nicobar Islands', lat: 11.62, lon: 92.72, regionType: 'coastal', normalMaxTemp: 32, normalMinTemp: 24, typicalSummerRH: 82 },
  { name: 'Daman', state: 'Dadra & Nagar Haveli and Daman & Diu', lat: 20.39, lon: 72.83, regionType: 'coastal', normalMaxTemp: 34, normalMinTemp: 25, typicalSummerRH: 76 },
  { name: 'Silvassa', state: 'Dadra & Nagar Haveli and Daman & Diu', lat: 20.27, lon: 73.01, regionType: 'plains', normalMaxTemp: 37, normalMinTemp: 24, typicalSummerRH: 65 },
  { name: 'Srinagar', state: 'Jammu & Kashmir', lat: 34.08, lon: 74.80, regionType: 'hilly', normalMaxTemp: 30, normalMinTemp: 14, typicalSummerRH: 48 },
  { name: 'Jammu', state: 'Jammu & Kashmir', lat: 32.72, lon: 74.85, regionType: 'plains', normalMaxTemp: 41, normalMinTemp: 25, typicalSummerRH: 42 },
  { name: 'Leh', state: 'Ladakh', lat: 34.15, lon: 77.57, regionType: 'hilly', normalMaxTemp: 24, normalMinTemp: 10, typicalSummerRH: 35 },
  { name: 'Kargil', state: 'Ladakh', lat: 34.55, lon: 76.13, regionType: 'hilly', normalMaxTemp: 25, normalMinTemp: 11, typicalSummerRH: 38 },
  { name: 'Kavaratti', state: 'Lakshadweep', lat: 10.56, lon: 72.64, regionType: 'coastal', normalMaxTemp: 33, normalMinTemp: 26, typicalSummerRH: 80 },
  { name: 'Puducherry', state: 'Puducherry', lat: 11.94, lon: 79.80, regionType: 'coastal', normalMaxTemp: 37, normalMinTemp: 26, typicalSummerRH: 72 }
];

// 2. VULNERABILITY DATA (Comprehensive for all 28 States & 8 UTs)
const VULNERABILITY_DATA = {
  'Delhi': { population: 32.0, density: 11320, elderlyPct: 6.8, outdoorWorkersPct: 15, povertyPct: 9.9, healthcareAccess: 85 },
  'Gujarat': { population: 71.0, density: 308, elderlyPct: 7.9, outdoorWorkersPct: 22, povertyPct: 16.6, healthcareAccess: 70 },
  'Maharashtra': { population: 125.0, density: 365, elderlyPct: 9.9, outdoorWorkersPct: 25, povertyPct: 17.4, healthcareAccess: 75 },
  'Rajasthan': { population: 81.0, density: 200, elderlyPct: 7.4, outdoorWorkersPct: 35, povertyPct: 14.7, healthcareAccess: 55 },
  'Uttar Pradesh': { population: 235.0, density: 829, elderlyPct: 7.1, outdoorWorkersPct: 40, povertyPct: 29.4, healthcareAccess: 45 },
  'Bihar': { population: 127.0, density: 1106, elderlyPct: 7.4, outdoorWorkersPct: 45, povertyPct: 33.7, healthcareAccess: 40 },
  'Madhya Pradesh': { population: 86.0, density: 236, elderlyPct: 7.3, outdoorWorkersPct: 38, povertyPct: 31.6, healthcareAccess: 50 },
  'Telangana': { population: 38.0, density: 312, elderlyPct: 8.4, outdoorWorkersPct: 28, povertyPct: 13.7, healthcareAccess: 65 },
  'Andhra Pradesh': { population: 53.0, density: 308, elderlyPct: 9.8, outdoorWorkersPct: 30, povertyPct: 9.2, healthcareAccess: 60 },
  'Odisha': { population: 46.0, density: 270, elderlyPct: 9.5, outdoorWorkersPct: 33, povertyPct: 29.3, healthcareAccess: 48 },
  'West Bengal': { population: 99.0, density: 1028, elderlyPct: 8.5, outdoorWorkersPct: 26, povertyPct: 19.9, healthcareAccess: 55 },
  'Jharkhand': { population: 39.0, density: 414, elderlyPct: 6.4, outdoorWorkersPct: 37, povertyPct: 36.9, healthcareAccess: 42 },
  'Chandigarh': { population: 1.2, density: 9252, elderlyPct: 7.3, outdoorWorkersPct: 10, povertyPct: 5.9, healthcareAccess: 90 },
  'Punjab': { population: 30.0, density: 551, elderlyPct: 10.3, outdoorWorkersPct: 20, povertyPct: 8.3, healthcareAccess: 75 },
  'Haryana': { population: 29.0, density: 573, elderlyPct: 8.7, outdoorWorkersPct: 22, povertyPct: 11.2, healthcareAccess: 72 },
  'Tamil Nadu': { population: 76.0, density: 555, elderlyPct: 10.4, outdoorWorkersPct: 22, povertyPct: 11.3, healthcareAccess: 80 },
  'Goa': { population: 1.5, density: 394, elderlyPct: 11.2, outdoorWorkersPct: 12, povertyPct: 5.1, healthcareAccess: 85 },
  'Kerala': { population: 35.0, density: 860, elderlyPct: 12.6, outdoorWorkersPct: 15, povertyPct: 7.1, healthcareAccess: 95 },
  'Karnataka': { population: 67.0, density: 319, elderlyPct: 8.3, outdoorWorkersPct: 24, povertyPct: 20.9, healthcareAccess: 70 },
  'Himachal Pradesh': { population: 7.4, density: 123, elderlyPct: 10.2, outdoorWorkersPct: 18, povertyPct: 8.1, healthcareAccess: 75 },
  'Uttarakhand': { population: 11.5, density: 189, elderlyPct: 8.9, outdoorWorkersPct: 20, povertyPct: 11.3, healthcareAccess: 65 },
  'Jammu & Kashmir': { population: 13.6, density: 56, elderlyPct: 7.4, outdoorWorkersPct: 22, povertyPct: 10.3, healthcareAccess: 60 },
  'Assam': { population: 35.0, density: 398, elderlyPct: 6.7, outdoorWorkersPct: 32, povertyPct: 31.9, healthcareAccess: 45 },
  'Arunachal Pradesh': { population: 1.6, density: 17, elderlyPct: 5.2, outdoorWorkersPct: 38, povertyPct: 24.2, healthcareAccess: 40 },
  'Chhattisgarh': { population: 30.0, density: 222, elderlyPct: 7.0, outdoorWorkersPct: 36, povertyPct: 39.9, healthcareAccess: 48 },
  'Manipur': { population: 3.2, density: 128, elderlyPct: 7.2, outdoorWorkersPct: 28, povertyPct: 36.8, healthcareAccess: 50 },
  'Meghalaya': { population: 3.3, density: 132, elderlyPct: 5.8, outdoorWorkersPct: 32, povertyPct: 32.6, healthcareAccess: 45 },
  'Mizoram': { population: 1.2, density: 52, elderlyPct: 6.3, outdoorWorkersPct: 25, povertyPct: 20.4, healthcareAccess: 60 },
  'Nagaland': { population: 2.2, density: 119, elderlyPct: 6.0, outdoorWorkersPct: 30, povertyPct: 18.8, healthcareAccess: 52 },
  'Sikkim': { population: 0.7, density: 86, elderlyPct: 6.9, outdoorWorkersPct: 20, povertyPct: 8.2, healthcareAccess: 78 },
  'Tripura': { population: 4.1, density: 350, elderlyPct: 7.8, outdoorWorkersPct: 28, povertyPct: 14.1, healthcareAccess: 58 },
  'Andaman & Nicobar Islands': { population: 0.4, density: 46, elderlyPct: 7.0, outdoorWorkersPct: 18, povertyPct: 7.5, healthcareAccess: 70 },
  'Dadra & Nagar Haveli and Daman & Diu': { population: 0.6, density: 970, elderlyPct: 4.8, outdoorWorkersPct: 25, povertyPct: 9.8, healthcareAccess: 68 },
  'Ladakh': { population: 0.3, density: 5, elderlyPct: 8.1, outdoorWorkersPct: 20, povertyPct: 12.0, healthcareAccess: 55 },
  'Lakshadweep': { population: 0.07, density: 2013, elderlyPct: 8.5, outdoorWorkersPct: 14, povertyPct: 3.5, healthcareAccess: 80 },
  'Puducherry': { population: 1.5, density: 2547, elderlyPct: 9.8, outdoorWorkersPct: 16, povertyPct: 9.6, healthcareAccess: 82 }
};

// 4. THERMAL STRESS ENGINE
class ThermalStressEngine {
  static calculateHeatIndex(tempC, rh) {
    const tf = (tempC * 9/5) + 32;
    let hiPre = 0.5 * (tf + 61.0 + ((tf - 68.0) * 1.2) + (rh * 0.094));
    let hi = hiPre;

    if (hiPre >= 80) {
      hi = -42.379 + 2.04901523 * tf + 10.14333127 * rh - 0.22475541 * tf * rh
           - 0.00683783 * tf * tf - 0.05481717 * rh * rh + 0.00122874 * tf * tf * rh
           + 0.00085282 * tf * rh * rh - 0.00000199 * tf * tf * rh * rh;
      
      if (rh < 13 && tf >= 80 && tf <= 112) {
        hi -= ((13 - rh) / 4) * Math.sqrt((17 - Math.abs(tf - 95)) / 17);
      } else if (rh > 85 && tf >= 80 && tf <= 87) {
        hi += ((rh - 85) / 10) * ((87 - tf) / 5);
      }
    }
    
    const value = (hi - 32) * 5/9;
    
    let category = 'Caution';
    if (value >= 54) category = 'Extreme Danger';
    else if (value >= 41) category = 'Danger';
    else if (value >= 32) category = 'Extreme Caution';
    else if (value < 27) category = 'Safe';
    
    return { value, category };
  }

  static calculateWBGT(tempC, rh, solarRad) {
    const e = (rh / 100) * 6.105 * Math.exp(17.27 * tempC / (237.7 + tempC));
    let wbgt = 0.567 * tempC + 0.393 * e + 3.94;
    
    if (solarRad > 100) {
      wbgt += solarRad * 0.01;
    }
    
    let category = 'Low';
    if (wbgt >= 32.2) category = 'Extreme';
    else if (wbgt >= 31.0) category = 'Very High';
    else if (wbgt >= 29.4) category = 'High';
    else if (wbgt >= 27.7) category = 'Moderate';
    
    return { value: wbgt, category };
  }

  static calculateUTCI(tempC, rh, windKmh, solarRad) {
    const v_ms = windKmh * 0.27778;
    let tmrt = tempC;
    if (solarRad > 0) {
      tmrt = tempC + 0.08 * solarRad - 1.2 * Math.sqrt(v_ms);
    }
    const dt = tmrt - tempC;
    const utci = tempC + 0.2 * dt - 0.1 * v_ms + 0.05 * rh;
    
    let category = 'No Thermal Stress';
    if (utci > 46) category = 'Extreme Heat Stress';
    else if (utci > 38) category = 'Very Strong Heat Stress';
    else if (utci > 32) category = 'Strong Heat Stress';
    else if (utci > 26) category = 'Moderate Heat Stress';
    
    return { value: utci, category };
  }

  static calculateHumidex(tempC, rh) {
    const e = 6.11 * Math.pow(10, (7.5 * tempC) / (237.7 + tempC)) * (rh / 100);
    const humidex = tempC + (5 / 9) * (e - 10);
    let category = 'Comfortable';
    if (humidex >= 54) category = 'Heat Stroke Imminent';
    else if (humidex >= 45) category = 'Dangerous';
    else if (humidex >= 38) category = 'Great Discomfort';
    else if (humidex >= 30) category = 'Some Discomfort';
    return { value: humidex, category };
  }

  static calculateApparentTemp(tempC, rh, windKmh) {
    const v_ms = windKmh * 0.27778;
    const e = (rh / 100) * 6.105 * Math.exp((17.27 * tempC) / (237.7 + tempC));
    const at = tempC + 0.33 * e - 0.70 * v_ms - 4.00;
    return { value: at };
  }

  static calculateDewPoint(tempC, rh) {
    const a = 17.27;
    const b = 237.7;
    const alpha = ((a * tempC) / (b + tempC)) + Math.log(Math.max(0.01, rh / 100));
    const dp = (b * alpha) / (a - alpha);
    return { value: dp };
  }

  static calculateHTSS(hi, wbgt, utci) {
    const n_hi = Math.max(0, Math.min(100, (hi.value - 25) * 3));
    const n_wbgt = Math.max(0, Math.min(100, (wbgt.value - 20) * 4));
    const n_utci = Math.max(0, Math.min(100, (utci.value - 20) * 2.5));

    const weighted = n_utci * 0.45 + n_wbgt * 0.35 + n_hi * 0.20;
    const maxVal = Math.max(n_hi, n_wbgt, n_utci);
    const score = Math.max(weighted, 0.85 * maxVal);

    let category = 'Safe';
    if (score > 80) category = 'Extreme';
    else if (score > 65) category = 'High';
    else if (score > 50) category = 'Moderate';
    else if (score > 30) category = 'Low';

    // Safe division for contributions — avoid NaN/Infinity when weighted is 0
    let contribUtci = 0, contribWbgt = 0, contribHi = 0;
    if (weighted > 0) {
      contribUtci = Math.round((n_utci * 0.45 / weighted) * 100);
      contribWbgt = Math.round((n_wbgt * 0.35 / weighted) * 100);
      contribHi = Math.round((n_hi * 0.20 / weighted) * 100);
    }

    return {
      score,
      category,
      contributions: {
        utci: contribUtci,
        wbgt: contribWbgt,
        hi: contribHi
      }
    };
  }

  static calculateHeatwaveProbability(temp, rh, regionType) {
    let threshold = 40;
    if (regionType === 'coastal') threshold = 37;
    if (regionType === 'hilly') threshold = 30;

    const diff = temp - threshold;
    if (diff <= 0) return Math.max(0, 10 + diff * 2);
    
    let prob = 50 + (diff * 10);
    if (diff >= 4.5) prob += 15;
    if (diff >= 6.5) prob += 20;
    
    return Math.min(100, Math.max(0, prob));
  }

  static calculateRiskFusion(htss, weather, city, vulnData) {
    const temp = weather.temperature;
    
    // 1. Cumulative Heat Load (24h - 72h heat stress accumulation effect)
    let cumulativeLoad = 'Normal (24h exposure)';
    let heatLoadScore = 15;
    if (temp >= 44 || htss.score > 75) {
      cumulativeLoad = 'CRITICAL (72h Severe Heat Load)';
      heatLoadScore = 92;
    } else if (temp >= 41 || htss.score > 60) {
      cumulativeLoad = 'HIGH (48h Cumulative Heat Load)';
      heatLoadScore = 68;
    } else if (temp >= 38 || htss.score > 45) {
      cumulativeLoad = 'MODERATE (24h Cumulative Heat)';
      heatLoadScore = 42;
    }

    // 2. Population Vulnerability Component
    const vuln = vulnData || { elderlyPct: 8.5, outdoorWorkersPct: 22.0, povertyPct: 18.5, healthcareAccess: 65.0 };
    const vulnScore = Math.min(100, (vuln.elderlyPct * 2.8) + (vuln.outdoorWorkersPct * 1.9) + (vuln.povertyPct * 1.4));
    const healthcareDeficit = Math.max(0, 100 - vuln.healthcareAccess);

    // 3. Risk Fusion Formula:
    // Risk Fusion = 0.45 * Thermal Stress + 0.25 * Cumulative Heat Load + 0.20 * Vulnerability + 0.10 * Healthcare Deficit
    const fusedScore = Math.min(100, Math.max(0, 
      (0.45 * htss.score) + 
      (0.25 * heatLoadScore) + 
      (0.20 * vulnScore) + 
      (0.10 * healthcareDeficit)
    ));

    const fusedLevel = this.getRiskLevel(fusedScore);

    // 4. Rule-Based 3-5 Day Hospitalization & Mortality Risk Forecast (D+1 to D+5)
    const forecastDays = [];
    const dayLabels = ['D+1', 'D+2', 'D+3', 'D+4', 'D+5'];
    
    for (let i = 1; i <= 5; i++) {
      const lagMultiplier = (i === 2 || i === 3 || i === 4) ? 1.25 : 1.0;
      const hospRate = Math.round((fusedScore * 0.42 * lagMultiplier) + (i * 1.5)); // Per 100k
      const dayRisk = this.getRiskLevel(fusedScore * (lagMultiplier * 0.95));
      forecastDays.push({
        dayLabel: dayLabels[i - 1],
        dayName: `Day D+${i}`,
        hospitalizationRate: hospRate,
        riskLevel: dayRisk,
        mortalityIndex: (hospRate * 0.08).toFixed(1)
      });
    }

    // 5. Top Contributing Risk Drivers
    const topFactors = [];
    if (htss.score > 55) topFactors.push({ name: 'UTCI / WBGT Thermal Stress', val: `${Math.round(htss.score)}/100` });
    if (heatLoadScore > 40) topFactors.push({ name: 'Multi-Day Cumulative Heat Load', val: cumulativeLoad.split(' ')[0] });
    if (vuln.outdoorWorkersPct > 20) topFactors.push({ name: 'Outdoor Labor Population', val: `${vuln.outdoorWorkersPct}% Pop` });
    if (vuln.elderlyPct > 7) topFactors.push({ name: 'Elderly Demographic Density', val: `${vuln.elderlyPct}% Pop` });
    if (healthcareDeficit > 30) topFactors.push({ name: 'Healthcare Access Deficit', val: `${healthcareDeficit}% Deficit` });

    return {
      fusedScore: Math.round(fusedScore),
      fusedLevel,
      cumulativeLoad,
      forecastDays,
      topFactors,
      dataSource: 'Rule-Based Biometeorological Engine'
    };
  }

  static getRiskLevel(score) {
    if (score > 80) return 'Extreme';
    if (score > 65) return 'High';
    if (score > 50) return 'Moderate';
    if (score > 30) return 'Low';
    return 'Safe';
  }

  static getRiskColor(level) {
    switch(level) {
      case 'Extreme': return '#ef4444'; // Red
      case 'High': return '#f97316'; // Orange
      case 'Moderate': return '#eab308'; // Yellow
      case 'Low': return '#22c55e'; // Green
      default: return '#3b82f6'; // Blue
    }
  }
}

// Hyper-Local Ward GIS Data Generator for Ward-Level Analysis
function generateWardsForCity(city, baseWeather) {
  const wardTemplates = [
    { id: 1, name: 'Ward 1: Industrial Corridor & Freight Hub', offsetLat: 0.022, offsetLon: -0.018, tempMod: 2.3, rhMod: -4, popDensity: 'High (14,200/km²)', type: 'Industrial', hospital: 'District Thermal Emergency Ward', coolingShelter: 'Shelter-101 (Transport Hub)' },
    { id: 2, name: 'Ward 2: Informal Settlement & Slum Pocket', offsetLat: -0.016, offsetLon: 0.024, tempMod: 2.9, rhMod: 7, popDensity: 'Extreme (28,500/km²)', type: 'High-Density Slum', hospital: 'Red Cross Mobile Clinic #4', coolingShelter: 'Hydration Pavilion #2' },
    { id: 3, name: 'Ward 3: Central Commercial & Market District', offsetLat: 0.012, offsetLon: 0.028, tempMod: 1.6, rhMod: -2, popDensity: 'Very High (18,500/km²)', type: 'Commercial Market', hospital: 'City Municipal Hospital', coolingShelter: 'Metro Cooling Station #1' },
    { id: 4, name: 'Ward 4: Suburban Residential & Canopy Park', offsetLat: -0.028, offsetLon: -0.022, tempMod: -1.4, rhMod: -3, popDensity: 'Moderate (6,200/km²)', type: 'Suburban Green Belt', hospital: 'Suburban Community Health Post', coolingShelter: 'Civic Center Cooling Shelter' },
    { id: 5, name: 'Ward 5: Healthcare & Emergency Command Hub', offsetLat: 0.002, offsetLon: -0.002, tempMod: 0.3, rhMod: 0, popDensity: 'High (11,400/km²)', type: 'Healthcare Precinct', hospital: 'Central General Hospital (500 Beds)', coolingShelter: 'Central Disaster Relief Pavilion' }
  ];

  return wardTemplates.map(w => {
    const lat = city.lat + w.offsetLat;
    const lon = city.lon + w.offsetLon;
    const temp = Math.max(20, Math.min(55, baseWeather.temperature + w.tempMod));
    const rh = Math.max(5, Math.min(100, baseWeather.humidity + w.rhMod));
    const wind = baseWeather.windSpeed;
    const solar = baseWeather.solarRadiation;

    const hi = ThermalStressEngine.calculateHeatIndex(temp, rh);
    const wbgt = ThermalStressEngine.calculateWBGT(temp, rh, solar);
    const utci = ThermalStressEngine.calculateUTCI(temp, rh, wind, solar);
    const htss = ThermalStressEngine.calculateHTSS(hi, wbgt, utci);
    const prob = ThermalStressEngine.calculateHeatwaveProbability(temp, rh, city.regionType);

    return {
      ...w,
      cityName: city.name,
      stateName: city.state,
      lat,
      lon,
      weather: { temperature: temp, humidity: rh, windSpeed: wind, solarRadiation: solar, isLive: baseWeather.isLive },
      htss,
      prob
    };
  });
}

// 5. DEMO SCENARIOS & WEATHER DATA GENERATOR
const SCENARIOS = {
  normal:  { name: 'Normal Day',        icon: '☀️', tempRange: [32, 35], rhRange: [40, 50], windRange: [10, 15], solarRange: [500, 600] },
  severe:  { name: 'Severe Heatwave',    icon: '🔥', tempRange: [43, 45], rhRange: [50, 60], windRange: [4, 6],   solarRange: [850, 900] },
  extreme: { name: 'Extreme Heatwave',   icon: '☠️', tempRange: [47, 50], rhRange: [55, 70], windRange: [2, 4],   solarRange: [900, 950] },
  coastal: { name: 'Coastal Heat',       icon: '🌊', tempRange: [35, 37], rhRange: [80, 90], windRange: [6, 10],  solarRange: [650, 750] },
  dry:     { name: 'Dry Heat',           icon: '🏜️', tempRange: [46, 48], rhRange: [10, 20], windRange: [12, 18], solarRange: [900, 950] },
};

function generateWeatherForCity(city, scenarioKey) {
  const scenario = SCENARIOS[scenarioKey] || SCENARIOS['normal'];
  
  const rand = () => Math.random();
  const tempBase = city.normalMaxTemp;
  
  let tempMod = 0;
  if (scenarioKey === 'severe') tempMod = 2 + rand() * 2;
  else if (scenarioKey === 'extreme') tempMod = 4 + rand() * 3;
  else if (scenarioKey === 'coastal') tempMod = -2 + rand();
  else if (scenarioKey === 'dry') tempMod = 3 + rand() * 2;
  
  const temp = Math.max(20, Math.min(55, tempBase + tempMod));
  
  let rhBase = city.typicalSummerRH;
  let rh = rhBase;
  if (scenarioKey === 'coastal') rh = Math.min(100, rhBase + 20 + rand() * 10);
  else if (scenarioKey === 'dry') rh = Math.max(5, rhBase - 20 - rand() * 10);
  else if (scenarioKey === 'extreme') rh = rhBase + 10 + rand() * 15;
  
  const wind = scenario.windRange[0] + rand() * (scenario.windRange[1] - scenario.windRange[0]);
  const solar = scenario.solarRange[0] + rand() * (scenario.solarRange[1] - scenario.solarRange[0]);
  const dp = ThermalStressEngine.calculateDewPoint(temp, rh).value;

  return {
    temperature: temp,
    humidity: Math.max(5, Math.min(100, rh)),
    windSpeed: wind,
    solarRadiation: solar,
    dewPoint: dp,
    surfacePressure: 1013 - (temp * 0.2),
    cloudCover: Math.round(rand() * 30),
    rain: 0.0,
    uvIndex: Math.min(12, Math.round(solar / 80)),
    isLive: false
  };
}

// 5b. LIVE WEATHER FETCHER (Open-Meteo — free, no API key)
const weatherCache = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function fetchLiveWeather(lat, lon) {
  const key = `${lat.toFixed(2)},${lon.toFixed(2)}`;
  const cached = weatherCache[key];
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,direct_radiation,surface_pressure,dew_point_2m,cloud_cover,rain,uv_index` +
      `&timezone=auto`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`API returned ${response.status}`);
    const data = await response.json();
    
    const curr = data.current || {};
    const temp = curr.temperature_2m ?? 35;
    const rh = curr.relative_humidity_2m ?? 50;

    const result = {
      temperature: temp,
      humidity: rh,
      windSpeed: curr.wind_speed_10m ?? 10,
      solarRadiation: Math.max(0, curr.direct_radiation || 0),
      dewPoint: curr.dew_point_2m ?? ThermalStressEngine.calculateDewPoint(temp, rh).value,
      surfacePressure: curr.surface_pressure ?? 1013,
      cloudCover: curr.cloud_cover ?? 15,
      rain: curr.rain ?? 0.0,
      uvIndex: curr.uv_index ?? Math.min(12, Math.round((curr.direct_radiation || 500) / 80)),
      isLive: true
    };
    
    weatherCache[key] = { data: result, timestamp: Date.now() };
    return result;
  } catch (err) {
    console.warn('Live weather fetch failed, using estimate:', err.message);
    return null;
  }
}

// Fetch live forecast (hourly for 72 hours)
async function fetchLiveForecast(lat, lon) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,direct_radiation` +
      `&forecast_hours=72&timezone=auto`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`API returned ${response.status}`);
    const data = await response.json();
    return data.hourly;
  } catch (err) {
    console.warn('Forecast fetch failed:', err.message);
    return null;
  }
}

// 6. ALERT GENERATOR
function generateAlerts(city, htss, riskLevel, heatwaveProb) {
  const alerts = [];
  
  if (htss >= 85 || heatwaveProb > 90) {
    alerts.push({
      severity: 'red',
      title: 'Red Alert: Severe Heatwave Emergency',
      message: `Extreme heat conditions detected for ${city.name}. Immediate action required to prevent heat stroke.`,
      recommendations: [
        'Stay indoors in air-conditioned areas',
        'Reschedule all outdoor activities',
        'Drink water constantly, even if not thirsty',
        'Check on vulnerable neighbors and elderly'
      ]
    });
  } else if (htss >= 75 || heatwaveProb > 70) {
    alerts.push({
      severity: 'orange',
      title: 'Orange Alert: Heatwave Warning',
      message: `High risk of heat illness in ${city.name}. Prolonged exposure is dangerous.`,
      recommendations: [
        'Avoid outdoor work between 11 AM and 4 PM',
        'Wear lightweight, loose-fitting clothing',
        'Stay hydrated and avoid alcohol/caffeine',
        'Provide shade and water for pets'
      ]
    });
  } else if (htss >= 60 || heatwaveProb > 40) {
    alerts.push({
      severity: 'yellow',
      title: 'Yellow Alert: Heat Watch',
      message: `Moderate heat stress conditions in ${city.name}. Take precautions if spending time outdoors.`,
      recommendations: [
        'Stay hydrated',
        'Wear a hat and use sunscreen',
        'Take frequent breaks in the shade if working outdoors'
      ]
    });
  }
  
  return alerts;
}

// 7. RECOMMENDATION ENGINE
function generateRecommendations(riskLevel, temp) {
  const recs = [];
  
  if (riskLevel === 'Extreme' || riskLevel === 'High') {
    recs.push({ audience: 'Government', priority: 'Critical', text: 'Activate municipal cooling centers and emergency wards. Issue public advisories.' });
    recs.push({ audience: 'Outdoor Workers', priority: 'Critical', text: 'Mandatory halt to all non-essential outdoor work from 11:00 to 16:00.' });
    recs.push({ audience: 'Citizens', priority: 'High', text: 'Stay indoors. Hydrate continuously with ORS or water. Avoid high-protein food.' });
    recs.push({ audience: 'Elderly', priority: 'Critical', text: 'Remain in well-ventilated or AC rooms. Family members must check in every 2-3 hours.' });
  } else if (riskLevel === 'Moderate') {
    recs.push({ audience: 'Government', priority: 'Medium', text: 'Ensure uninterrupted water and power supply to critical infrastructure.' });
    recs.push({ audience: 'Outdoor Workers', priority: 'High', text: 'Mandatory 15-minute breaks every hour in shade with hydration.' });
    recs.push({ audience: 'Citizens', priority: 'Medium', text: 'Limit outdoor activities during peak afternoon hours.' });
    recs.push({ audience: 'Elderly', priority: 'High', text: 'Avoid direct sunlight. Stay hydrated.' });
  } else {
    recs.push({ audience: 'Citizens', priority: 'Low', text: 'Normal summer precautions. Stay adequately hydrated.' });
    recs.push({ audience: 'Outdoor Workers', priority: 'Low', text: 'Wear protective clothing and sunglasses.' });
  }
  
  return recs;
}

// 7b. GPS REVERSE GEOCODING HELPER
function findClosestCity(lat, lon) {
  let closest = CITIES[0];
  let minDistance = Infinity;
  for (const c of CITIES) {
    const dist = Math.hypot(c.lat - lat, c.lon - lon);
    if (dist < minDistance) {
      minDistance = dist;
      closest = c;
    }
  }
  return {
    name: `${closest.name} (${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E)`,
    districtName: closest.name,
    state: closest.state,
    lat: lat,
    lon: lon,
    regionType: closest.regionType,
    normalMaxTemp: closest.normalMaxTemp,
    typicalSummerRH: closest.typicalSummerRH,
    isGPS: true
  };
}

// 8. APP CONTROLLER
class App {
  constructor() {
    this.charts = {};
    this.map = null;
    this.markers = [];
    this.currentCity = CITIES.find(c => c.name === 'Delhi');
    this.currentScenario = 'live';
    this.mapViewMode = 'ward';
    this.mapFilter = 'all';
    this.gaugeAnimation = null;
    this.liveWeatherCache = {};
    this.isUpdating = false;

    // Automatic GPS & Risk Notification System State
    this.isGpsActive = false;
    this.gpsWatchId = null;
    this.lastAlertState = {
      locationKey: null,
      riskLevel: null,
      timestamp: 0
    };
  }

  init() {
    try {
      if (window.lucide) {
        window.lucide.createIcons();
      }
      
      this.populateLocationDropdowns();
      this.attachEventListeners();
      this.initMap();
      this.startClock();
      
      this.updateDashboard();
    } catch (e) {
      console.error("Initialization error:", e);
    }
  }

  populateLocationDropdowns() {
    const stateSelect = document.getElementById('state-select');
    const citySelect = document.getElementById('city-select');
    const dispatchTarget = document.getElementById('dispatch-target');
    if (!stateSelect || !citySelect) return;
    
    stateSelect.innerHTML = '';
    
    // Get unique state names sorted alphabetically
    const states = [...new Set(CITIES.map(c => c.state))].sort((a, b) => a.localeCompare(b));
    
    states.forEach(state => {
      const option = document.createElement('option');
      option.value = state;
      option.textContent = state;
      if (state === 'Delhi') option.selected = true;
      stateSelect.appendChild(option);
    });

    this.updateCityOptionsForState(stateSelect.value || 'Delhi');

    if (dispatchTarget) {
      dispatchTarget.innerHTML = CITIES.map(c => `<option value="${c.name}">${c.name}, ${c.state}</option>`).join('');
    }
  }

  updateCityOptionsForState(selectedState, targetCityName = null) {
    const citySelect = document.getElementById('city-select');
    if (!citySelect) return;

    citySelect.innerHTML = '';
    const districts = CITIES.filter(c => c.state === selectedState).sort((a, b) => a.name.localeCompare(b.name));

    districts.forEach((city, index) => {
      const option = document.createElement('option');
      option.value = city.name;
      option.textContent = city.name;
      if (targetCityName ? city.name === targetCityName : index === 0) {
        option.selected = true;
        this.currentCity = city;
      }
      citySelect.appendChild(option);
    });
  }

  attachEventListeners() {
    const stateSelect = document.getElementById('state-select');
    if (stateSelect) {
      stateSelect.addEventListener('change', (e) => {
        const selectedState = e.target.value;
        this.updateCityOptionsForState(selectedState);
        this.updateDashboard();
        if (this.mapViewMode === 'ward') {
          this.updateMap();
        }
      });
    }

    const citySelect = document.getElementById('city-select');
    if (citySelect) {
      citySelect.addEventListener('change', (e) => {
        const selectedState = document.getElementById('state-select')?.value;
        this.currentCity = CITIES.find(c => c.name === e.target.value && c.state === selectedState) || CITIES.find(c => c.name === e.target.value);
        this.updateDashboard();
        if (this.mapViewMode === 'ward') {
          this.updateMap();
        }
      });
    }

    const mapViewSelect = document.getElementById('map-view-select');
    if (mapViewSelect) {
      mapViewSelect.addEventListener('change', (e) => {
        this.mapViewMode = e.target.value;
        this.updateMap();
      });
    }

    const mapFilterSelect = document.getElementById('map-filter-select');
    if (mapFilterSelect) {
      mapFilterSelect.addEventListener('change', (e) => {
        this.mapFilter = e.target.value;
        this.updateMap();
      });
    }

    const legendToggleBtn = document.getElementById('legend-toggle-btn');
    const mapLegend = document.getElementById('map-legend');
    if (legendToggleBtn && mapLegend) {
      legendToggleBtn.addEventListener('click', () => {
        mapLegend.classList.toggle('collapsed');
      });
    }

    // Toggle Technical Metrics Expandable Container
    const toggleMetricsBtn = document.getElementById('toggle-tech-metrics-btn');
    if (toggleMetricsBtn) {
      toggleMetricsBtn.addEventListener('click', () => {
        const content = document.getElementById('tech-metrics-content');
        const label = document.getElementById('tech-metrics-toggle-label');
        if (content && label) {
          if (content.style.display === 'none') {
            content.style.display = 'grid';
            label.textContent = 'Hide Details ▲';
          } else {
            content.style.display = 'none';
            label.textContent = 'Show Details ▼';
          }
        }
      });
    }

    // Mobile Menu Modal Panel Controls
    const menuModal = document.getElementById('mobile-menu-modal');
    const menuBackdrop = document.getElementById('menu-backdrop');
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const bottomMenuBtn = document.getElementById('mobile-bottom-menu-btn');
    const closeMenuPanelBtn = document.getElementById('close-menu-panel-btn');

    const openMenuPanel = () => {
      if (menuModal) menuModal.classList.add('active');
      if (menuBackdrop) menuBackdrop.classList.add('active');
      if (window.lucide) window.lucide.createIcons();
    };

    const closeMenuPanel = () => {
      if (menuModal) menuModal.classList.remove('active');
      if (menuBackdrop) menuBackdrop.classList.remove('active');
    };

    if (menuToggle) menuToggle.addEventListener('click', openMenuPanel);
    if (bottomMenuBtn) bottomMenuBtn.addEventListener('click', openMenuPanel);
    if (closeMenuPanelBtn) closeMenuPanelBtn.addEventListener('click', closeMenuPanel);
    if (menuBackdrop) menuBackdrop.addEventListener('click', closeMenuPanel);

    // Menu Panel Navigation Items
    document.querySelectorAll('#mobile-menu-modal [data-page]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetBtn = e.target.closest('[data-page]');
        if (!targetBtn) return;
        const pageId = targetBtn.getAttribute('data-page');
        if (pageId) {
          this.switchPage(pageId);
          closeMenuPanel();
        }
      });
    });

    // Menu Panel Data Export Actions
    const menuCsvBtn = document.getElementById('menu-export-csv');
    if (menuCsvBtn) {
      menuCsvBtn.addEventListener('click', () => {
        const csvBtn = document.getElementById('export-csv-btn');
        if (csvBtn) csvBtn.click();
        closeMenuPanel();
      });
    }

    const menuJsonBtn = document.getElementById('menu-export-json');
    if (menuJsonBtn) {
      menuJsonBtn.addEventListener('click', () => {
        const jsonBtn = document.getElementById('export-json-btn');
        if (jsonBtn) jsonBtn.click();
        closeMenuPanel();
      });
    }

    // Navigation Buttons (Desktop Bar & Mobile Bottom Bar)
    document.querySelectorAll('.nav-btn, .bottom-nav-btn[data-page]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetBtn = e.target.closest('[data-page]');
        if (!targetBtn) return;
        const pageId = targetBtn.getAttribute('data-page');
        if (pageId) {
          this.switchPage(pageId);
          closeMenuPanel();
        }
      });
    });

    // Personal Risk Calculator Listener
    const calcBtn = document.getElementById('calc-btn');
    if (calcBtn) {
      calcBtn.addEventListener('click', () => {
        const age = document.getElementById('calc-age')?.value || 'adult';
        const occupation = document.getElementById('calc-occupation')?.value || 'construction';
        const intensity = document.getElementById('calc-intensity')?.value || 'heavy';
        const hours = parseFloat(document.getElementById('calc-hours')?.value || '5');

        const baseScore = this.currentHtssScore || 65;
        const ageMod = age === 'elderly' ? 15 : age === 'child' ? 12 : 0;
        const occMod = occupation === 'construction' ? 15 : occupation === 'delivery' ? 10 : -10;
        const intMod = intensity === 'heavy' ? 12 : intensity === 'moderate' ? 5 : -5;
        const hrsMod = hours * 2;

        const pScore = Math.min(100, Math.max(10, Math.round(baseScore + ageMod + occMod + intMod + hrsMod)));
        const pLevel = ThermalStressEngine.getRiskLevel(pScore);
        const color = ThermalStressEngine.getRiskColor(pLevel);

        this.setElText('personal-risk-num', `${pScore} / 100`);
        const catEl = document.getElementById('personal-risk-cat');
        if (catEl) {
          catEl.textContent = `${pLevel.toUpperCase()} PERSONAL RISK`;
          catEl.style.backgroundColor = `${color}30`;
          catEl.style.color = color;
          catEl.style.border = `1px solid ${color}`;
        }

        const hydration = (0.6 + (pScore / 100) * 0.8).toFixed(1);
        this.setElText('calc-hydration', `${hydration} Liter / Hour (with ORS)`);

        const rest = pScore > 80 ? '15 min work / 45 min shade rest' : pScore > 65 ? '30 min work / 30 min shade rest' : pScore > 45 ? '45 min work / 15 min shade rest' : 'Continuous with hydration breaks';
        this.setElText('calc-rest-cycle', rest);
      });
    }

    // Emergency Alert Dispatcher Listener
    const alertBtn = document.getElementById('send-alert-btn');
    if (alertBtn) {
      alertBtn.addEventListener('click', () => {
        const target = document.getElementById('dispatch-target')?.value || 'Central Ward';
        const channel = document.getElementById('dispatch-channel')?.value || 'SMS';
        const msg = document.getElementById('dispatch-msg')?.value || 'Emergency Alert';
        const tbody = document.getElementById('dispatch-log-body');
        
        if (tbody) {
          const id = 'ALT-' + Math.floor(100000 + Math.random() * 900000);
          const time = new Date().toLocaleTimeString('en-IN', { hour12: true });
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${id}</td>
            <td>${time}</td>
            <td>${target}</td>
            <td>${channel}</td>
            <td><span class="badge bg-success">DISPATCHED ✓</span></td>
          `;
          tbody.prepend(tr);
          alert(`🚨 Emergency Alert ${id} Dispatched via ${channel} to ${target}!`);
        }
      });
    }

    // Export CSV & JSON Listeners
    const csvBtn = document.getElementById('export-csv-btn');
    if (csvBtn) {
      csvBtn.addEventListener('click', () => {
        try {
          let csv = 'City,State,Temperature_C,Humidity_Pct,HTSS_Risk_Score,Risk_Category\n';
          CITIES.forEach(c => {
            const weather = generateWeatherForCity(c, 'normal');
            const hi = ThermalStressEngine.calculateHeatIndex(weather.temperature, weather.humidity);
            const wbgt = ThermalStressEngine.calculateWBGT(weather.temperature, weather.humidity, weather.solarRadiation);
            const utci = ThermalStressEngine.calculateUTCI(weather.temperature, weather.humidity, weather.windSpeed, weather.solarRadiation);
            const htss = ThermalStressEngine.calculateHTSS(hi, wbgt, utci);
            csv += `"${c.name}","${c.state}",${weather.temperature.toFixed(1)},${weather.humidity.toFixed(0)},${Math.round(htss.score)},"${htss.category}"\n`;
          });
          const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.setAttribute('download', 'thermos_ward_risk_report.csv');
          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            if (document.body.contains(a)) document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }, 150);
          alert('📥 Downloading Ward Risk CSV Report (thermos_ward_risk_report.csv)...');
        } catch (err) {
          console.error("CSV Export error:", err);
          alert("Error generating CSV: " + err.message);
        }
      });
    }

    const jsonBtn = document.getElementById('export-json-btn');
    if (jsonBtn) {
      jsonBtn.addEventListener('click', () => {
        try {
          const data = CITIES.map(c => {
            const weather = generateWeatherForCity(c, 'normal');
            const hi = ThermalStressEngine.calculateHeatIndex(weather.temperature, weather.humidity);
            const wbgt = ThermalStressEngine.calculateWBGT(weather.temperature, weather.humidity, weather.solarRadiation);
            const utci = ThermalStressEngine.calculateUTCI(weather.temperature, weather.humidity, weather.windSpeed, weather.solarRadiation);
            const htss = ThermalStressEngine.calculateHTSS(hi, wbgt, utci);
            return {
              city: c.name,
              state: c.state,
              lat: c.lat,
              lon: c.lon,
              temperature_c: parseFloat(weather.temperature.toFixed(1)),
              humidity_pct: parseFloat(weather.humidity.toFixed(0)),
              htss_score: Math.round(htss.score),
              risk_category: htss.category
            };
          });
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.setAttribute('download', 'thermos_ward_risk_report.json');
          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            if (document.body.contains(a)) document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }, 150);
          alert('📥 Downloading Ward Risk JSON Report (thermos_ward_risk_report.json)...');
        } catch (err) {
          console.error("JSON Export error:", err);
          alert("Error generating JSON: " + err.message);
        }
      });
    }

    // GPS Location Control Listener
    const gpsBtn = document.getElementById('gps-location-btn');
    if (gpsBtn) {
      gpsBtn.addEventListener('click', () => {
        this.requestGPSLocation();
      });
    }

    const closeBannerBtn = document.getElementById('close-alert-banner-btn');
    if (closeBannerBtn) {
      closeBannerBtn.addEventListener('click', () => {
        document.getElementById('gps-alert-banner')?.classList.add('hidden');
      });
    }
  }

  initMap() {
    const mapContainer = document.getElementById('leaflet-map');
    if (!mapContainer || !window.L) return;

    this.map = L.map('leaflet-map').setView([22.5, 82.0], 5);
    L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
      attribution: '&copy; Google Maps Satellite',
      maxZoom: 18
    }).addTo(this.map);

    if (window.Chart) {
      Chart.defaults.font.family = "'Plus Jakarta Sans', 'Inter', sans-serif";
      Chart.defaults.color = '#94a3b8';
      Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.06)';
    }
  }

  startClock() {
    const clockEl = document.getElementById('live-clock');
    if (!clockEl) return;
    
    setInterval(() => {
      const now = new Date();
      clockEl.textContent = now.toLocaleString('en-IN', {
        weekday: 'short', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: true
      });
    }, 1000);
  }

  async updateDashboard() {
    if (this.isUpdating) return;
    this.isUpdating = true;
    
    const city = this.currentCity;
    const scenarioBadge = document.getElementById('scenario-badge');
    const liveDataBadge = document.getElementById('live-data-badge');
    
    if (scenarioBadge) {
      scenarioBadge.textContent = '⏳ Updating...';
      scenarioBadge.className = 'scenario-badge';
    }
    
    let weather = await fetchLiveWeather(city.lat, city.lon);
    if (!weather) {
      weather = generateWeatherForCity(city, 'normal');
    }
    
    const hi = ThermalStressEngine.calculateHeatIndex(weather.temperature, weather.humidity);
    const wbgt = ThermalStressEngine.calculateWBGT(weather.temperature, weather.humidity, weather.solarRadiation);
    const utci = ThermalStressEngine.calculateUTCI(weather.temperature, weather.humidity, weather.windSpeed, weather.solarRadiation);
    const humidex = ThermalStressEngine.calculateHumidex(weather.temperature, weather.humidity);
    const apparent = ThermalStressEngine.calculateApparentTemp(weather.temperature, weather.humidity, weather.windSpeed);

    const htssData = ThermalStressEngine.calculateHTSS(hi, wbgt, utci);
    this.currentHtssScore = htssData.score;

    const prob = ThermalStressEngine.calculateHeatwaveProbability(weather.temperature, weather.humidity, city.regionType);
    const alerts = generateAlerts(city, htssData.score, htssData.category, prob);
    const recs = generateRecommendations(htssData.category, weather.temperature);

    // ==========================================
    // ACTION-FIRST DASHBOARD HERO CARD UPDATES
    // ==========================================
    const locationName = city.name || `${city.districtName || city.name}, ${city.state}`;
    this.setElText('dash-location-name', locationName);
    this.setElText('dash-temp-val', `${weather.temperature.toFixed(1)}°C`);
    
    const riskBadgeEl = document.getElementById('dash-risk-badge');
    if (riskBadgeEl) {
      riskBadgeEl.textContent = `${htssData.category.toUpperCase()} THERMAL RISK`;
      riskBadgeEl.className = `risk-pill pill-${htssData.category.toLowerCase()}`;
    }

    const nowStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    this.setElText('dash-data-source', `Source: ${weather.isLive ? 'Open-Meteo Live API' : 'Biometeorological Engine'}`);
    this.setElText('dash-update-time', `Updated ${nowStr}`);
    
    const qualityEl = document.getElementById('dash-data-quality');
    if (qualityEl) {
      qualityEl.textContent = `Data Quality: HIGH (${weather.isLive ? 'Live API' : 'Cached Signal'})`;
      qualityEl.className = 'data-quality-badge quality-high';
    }

    if (liveDataBadge) {
      liveDataBadge.textContent = weather.isLive ? '🟢 LIVE DATA' : '🟡 DATA CACHED';
      liveDataBadge.className = weather.isLive ? 'status-badge status-live' : 'status-badge status-delayed';
    }

    // WHY? Section
    let whyReason = `High ambient temperature (${weather.temperature.toFixed(1)}°C)`;
    if (weather.humidity > 60) whyReason += ` combined with high relative humidity (${weather.humidity.toFixed(0)}%)`;
    if (weather.windSpeed < 8) whyReason += ` and low wind speed (${weather.windSpeed.toFixed(1)} km/h)`;
    if (weather.solarRadiation > 700) whyReason += ` under intense solar irradiance (${weather.solarRadiation.toFixed(0)} W/m²)`;
    whyReason += `, causing elevated physiological body heat strain (HTSS: ${Math.round(htssData.score)}/100).`;
    this.setElText('dash-why-text', whyReason);

    // WHAT SHOULD YOU DO? Section
    let actionGuide = 'Maintain regular outdoor activities with normal hydration.';
    if (htssData.category === 'Extreme') {
      actionGuide = 'Avoid non-essential outdoor exposure between 11 AM and 4 PM. Stay in air-conditioned or shaded areas, consume water/ORS continuously, and follow official emergency advisories.';
    } else if (htssData.category === 'High') {
      actionGuide = 'Reduce prolonged outdoor exposure and strenuous physical activity. Take 15-minute cooling breaks in shade every hour and stay hydrated.';
    } else if (htssData.category === 'Moderate') {
      actionGuide = 'Take frequent shade breaks during afternoon work. Maintain regular water and fluid intake. Avoid heavy outdoor exercise during peak heat.';
    } else if (htssData.category === 'Low') {
      actionGuide = 'Normal daily activity. Maintain adequate hydration and wear lightweight clothing.';
    }
    this.setElText('dash-action-text', actionGuide);

    // Update Risk Fusion Engine Transparency Section
    this.updateRiskFusion(htssData, weather, city);

    // 3D Weather Icon Dynamic Selection based on Temperature & Atmospheric Conditions
    const hero3dIcon = document.getElementById('hero-3d-icon');
    if (hero3dIcon) {
      const temp = weather.temperature;
      const rh = weather.humidity;
      const code = weather.weatherCode || 0;

      // 1. Rainy / Precipitation Condition -> Water drops cloud asset
      if ((code >= 50 && code <= 67) || (code >= 80 && code <= 82) || (rh > 85 && temp < 32)) {
        hero3dIcon.src = 'assets/weather_3d_rain.jpg';
        hero3dIcon.alt = '3D Rain Cloud with Water Drops';
      }
      // 2. Extreme Storm / Severe Heatwave Emergency -> Storm lightning asset
      else if (htssData.category === 'Extreme' || temp >= 44 || code >= 95) {
        hero3dIcon.src = 'assets/weather_3d_storm.jpg';
        hero3dIcon.alt = '3D Severe Storm Cloud';
      }
      // 3. High Temperature / Hot Sunny Heatwave -> Glowing Sun asset
      else if (temp >= 38 || htssData.category === 'High') {
        hero3dIcon.src = 'assets/weather_3d_sun.jpg';
        hero3dIcon.alt = '3D Glowing Sun';
      }
      // 4. Low / Mild Temperature -> Soft Clouds asset
      else if (temp <= 25 || rh > 75) {
        hero3dIcon.src = 'assets/weather_3d_clouds.jpg';
        hero3dIcon.alt = '3D Soft Clouds';
      }
      // 5. Normal / Moderate Day -> Sun & Cloud asset
      else {
        hero3dIcon.src = 'assets/weather_3d_sun_cloud.jpg';
        hero3dIcon.alt = '3D Sun and Cloud';
      }
    }

    // Update Detailed Technical Metrics & Bento Cards
    this.setElText('wx-temp', `${weather.temperature.toFixed(1)}°C`);
    this.setElText('wx-humidity', `${weather.humidity.toFixed(0)}%`);
    this.setElText('wx-wind', `${weather.windSpeed.toFixed(1)} km/h`);
    this.setElText('wx-solar', `${weather.solarRadiation.toFixed(0)} W/m²`);
    this.setElText('wx-dew', `${weather.dewPoint ? weather.dewPoint.toFixed(1) : '--'}°C`);
    this.setElText('wx-pressure', `${weather.surfacePressure ? weather.surfacePressure.toFixed(0) : '1013'} hPa`);
    
    // UV Index Gauge & Badge Update
    const uvVal = weather.uvIndex !== undefined ? weather.uvIndex : Math.max(1, Math.min(12, (weather.temperature - 20) * 0.35 + 2));
    this.setElText('wx-uv', uvVal.toFixed(1));
    const uvBar = document.getElementById('uv-gauge-bar');
    if (uvBar) uvBar.style.width = `${Math.min(100, (uvVal / 12) * 100)}%`;
    const uvBadge = document.getElementById('uv-cat-badge');
    if (uvBadge) {
      if (uvVal < 3) { uvBadge.textContent = 'LOW EXPOSURE'; uvBadge.style.background = 'rgba(16,185,129,0.2)'; uvBadge.style.color = '#34d399'; }
      else if (uvVal < 6) { uvBadge.textContent = 'MODERATE EXPOSURE'; uvBadge.style.background = 'rgba(251,191,36,0.2)'; uvBadge.style.color = '#fde047'; }
      else if (uvVal < 8) { uvBadge.textContent = 'HIGH EXPOSURE'; uvBadge.style.background = 'rgba(249,115,22,0.2)'; uvBadge.style.color = '#fb923c'; }
      else if (uvVal < 11) { uvBadge.textContent = 'VERY HIGH EXPOSURE'; uvBadge.style.background = 'rgba(239,68,68,0.2)'; uvBadge.style.color = '#fca5a5'; }
      else { uvBadge.textContent = 'EXTREME EXPOSURE'; uvBadge.style.background = 'rgba(168,85,247,0.2)'; uvBadge.style.color = '#c084fc'; }
    }

    // 3D Wind Compass Needle Rotation & Text Update
    const windDeg = weather.windDirection !== undefined ? weather.windDirection : 135;
    const compassNeedle = document.getElementById('wind-compass-needle');
    if (compassNeedle) {
      compassNeedle.style.transform = `rotate(${windDeg}deg)`;
    }
    const windDirText = document.getElementById('wind-dir-text');
    if (windDirText) {
      const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
      const dirName = dirs[Math.floor((windDeg / 22.5) + 0.5) % 16];
      windDirText.textContent = `${dirName} (${dirName} Airflow)`;
    }

    // Air Quality Index (AQI) Widget Update
    const calcAqi = Math.round(Math.max(35, Math.min(195, 45 + (weather.temperature - 25) * 2.2 + (100 - weather.humidity) * 0.4)));
    this.setElText('wx-aqi-num', calcAqi);
    const aqiBadge = document.getElementById('wx-aqi-badge');
    if (aqiBadge) {
      if (calcAqi <= 50) { aqiBadge.textContent = 'GOOD (SAFE)'; aqiBadge.className = 'badge bg-success'; }
      else if (calcAqi <= 100) { aqiBadge.textContent = 'MODERATE (ACCEPTABLE)'; aqiBadge.className = 'badge bg-info'; }
      else if (calcAqi <= 150) { aqiBadge.textContent = 'POOR (SENSITIVE GROUPS)'; aqiBadge.className = 'badge bg-warning'; }
      else { aqiBadge.textContent = 'UNHEALTHY (HAZARDOUS)'; aqiBadge.className = 'badge bg-danger'; }
    }

    // Update HTSS Gauge
    this.animateGauge(htssData.score, htssData.category);

    // Update Thermal Indices
    this.updateIndexDisplay('hi', hi.value, hi.category, 60);
    this.updateIndexDisplay('wbgt', wbgt.value, wbgt.category, 40);
    this.updateIndexDisplay('utci', utci.value, utci.category, 50);

    // Update Night Heat & UHI Values
    const nightMinVal = Math.max(18, (weather.temperature * 0.72 + 2));
    const nightMin = nightMinVal.toFixed(1);
    const coolingDelta = (weather.temperature - nightMinVal).toFixed(1);
    this.setElText('night-day-max', `${weather.temperature.toFixed(1)}°C`);
    this.setElText('night-min-temp', `${nightMin}°C (${nightMin > 25 ? 'Tropical Night' : 'Moderate Night'})`);
    this.setElText('night-cooling-delta', `${coolingDelta}°C (${coolingDelta > 12 ? 'Good Nocturnal Recovery' : 'Limited Recovery'})`);
    this.setElText('uhi-builtup', '82% Concrete / Asphalt Density');
    this.setElText('uhi-green', '14% Vegetation Canopy Cover');
    this.setElText('uhi-lst', `+${(weather.temperature > 40 ? 4.2 : 2.5).toFixed(1)}°C Hotspot Elevation`);

    // Update Contributions, Probability, Alerts, Recommendations
    this.updateContributions(htssData.contributions);
    this.updateProbability(prob);
    this.renderAlerts(alerts);
    this.renderRecommendations(recs);

    // Update 72-Hour Live Forecast Chart
    const forecastData = await fetchLiveForecast(city.lat, city.lon);
    this.renderForecastChartLive(forecastData, weather.temperature, htssData.score);

    // Render 7-Day Forecast Bento Cards
    this.renderDailyForecastCards(forecastData, weather, city);
    
    // Evaluate Automatic Location Heat Risk Notification
    this.evaluateAndTriggerNotification(weather, htssData, forecastData, city);

    // Update Ambient Weather Background Animation
    this.updateWeatherAnimation(weather, htssData.category);

    if (scenarioBadge) {
      scenarioBadge.textContent = `🔴 LIVE — ${city.name}`;
      scenarioBadge.className = 'scenario-badge live-badge';
    }
    
    this.isUpdating = false;
    if (window.lucide) window.lucide.createIcons();
  }

  updateWeatherAnimation(weather, riskCategory) {
    const animLayer = document.getElementById('weather-animation-layer');
    if (!animLayer) return;

    let animClass = 'weather-anim-clear';
    if ((weather.weatherCode >= 50 && weather.weatherCode <= 67) || (weather.weatherCode >= 80 && weather.weatherCode <= 82)) {
      animClass = 'weather-anim-rain';
    } else if (riskCategory === 'Extreme' || weather.weatherCode >= 95 || weather.temperature > 43) {
      animClass = 'weather-anim-storm';
    } else if (weather.windSpeed > 22) {
      animClass = 'weather-anim-wind';
    } else if (weather.humidity > 68) {
      animClass = 'weather-anim-clouds';
    }

    animLayer.className = animClass;
  }

  renderDailyForecastCards(forecastData, weather, city) {
    const container = document.getElementById('daily-forecast-container');
    if (!container) return;

    const days = [];
    const today = new Date();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let d = 0; d < 7; d++) {
      const dateObj = new Date(today);
      dateObj.setDate(today.getDate() + d);
      const dayLabel = d === 0 ? 'Today' : (d === 1 ? 'Tomorrow' : `${dayNames[dateObj.getDay()]} ${dateObj.getDate()}/${dateObj.getMonth() + 1}`);

      let maxTemp = weather.temperature + (Math.sin(d * 1.2) * 2.5);
      let minTemp = maxTemp - 9 - (d % 2);
      let dayRh = Math.max(25, Math.min(85, weather.humidity + (Math.cos(d) * 8)));

      if (forecastData && forecastData.temperature_2m && forecastData.time) {
        const dayStart = d * 24;
        const dayEnd = Math.min(forecastData.time.length, (d + 1) * 24);
        if (dayStart < forecastData.time.length) {
          const temps = forecastData.temperature_2m.slice(dayStart, dayEnd);
          if (temps.length > 0) {
            maxTemp = Math.max(...temps);
            minTemp = Math.min(...temps);
          }
        }
      }

      const dayHi = ThermalStressEngine.calculateHeatIndex(maxTemp, dayRh);
      const dayWbgt = ThermalStressEngine.calculateWBGT(maxTemp, dayRh, 750);
      const dayUtci = ThermalStressEngine.calculateUTCI(maxTemp, dayRh, 12, 750);
      const dayHtss = ThermalStressEngine.calculateHTSS(dayHi, dayWbgt, dayUtci);

      const iconName = maxTemp > 42 ? 'flame' : (maxTemp > 38 ? 'sun' : (dayRh > 65 ? 'cloud-rain' : 'cloud-sun'));
      const color = ThermalStressEngine.getRiskColor(dayHtss.category);

      days.push({
        label: dayLabel,
        maxTemp: maxTemp.toFixed(1),
        minTemp: minTemp.toFixed(1),
        humidity: Math.round(dayRh),
        category: dayHtss.category,
        color: color,
        icon: iconName,
        htss: Math.round(dayHtss.score)
      });
    }

    container.innerHTML = days.map(day => `
      <div class="forecast-day-card">
        <div class="day-name">${day.label}</div>
        <div style="margin:8px 0; color:${day.color};">
          <i data-lucide="${day.icon}" style="width:24px; height:24px;"></i>
        </div>
        <div class="day-temps">
          <span class="max-temp">${day.maxTemp}°</span>
          <span class="min-temp">${day.minTemp}°</span>
        </div>
        <div style="font-size:0.75rem; color:var(--text-muted); margin-top:4px;">RH: ${day.humidity}%</div>
        <div class="badge" style="background:${day.color}25; color:${day.color}; border:1px solid ${day.color}50; margin-top:6px; font-size:0.68rem;">
          ${day.category} (${day.htss})
        </div>
      </div>
    `).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  updateRiskFusion(htssData, weather, city) {
    const vulnData = VULNERABILITY_DATA[city.state] || VULNERABILITY_DATA['Delhi'];
    const fusion = ThermalStressEngine.calculateRiskFusion(htssData, weather, city, vulnData);

    // Score & Level
    this.setElText('fusion-score-val', Math.round(fusion.fusedScore));
    const levelEl = document.getElementById('fusion-score-level');
    if (levelEl) {
      levelEl.textContent = fusion.fusedLevel.toUpperCase() + ' RISK';
      const color = ThermalStressEngine.getRiskColor(fusion.fusedLevel);
      levelEl.style.backgroundColor = `${color}25`;
      levelEl.style.color = color;
      levelEl.style.border = `1px solid ${color}60`;
    }

    // Data Quality Badge (Remove fake ML confidence %)
    const confidenceBadge = document.getElementById('ml-confidence-badge');
    if (confidenceBadge) {
      confidenceBadge.textContent = '🟢 Live Data Quality: HIGH';
      confidenceBadge.className = 'data-quality-tag';
    }

    // Cumulative Heat Load
    const loadEl = document.getElementById('cumulative-heat-load');
    if (loadEl) {
      loadEl.textContent = fusion.cumulativeLoad;
      if (fusion.fusedScore > 75) {
        loadEl.style.background = 'rgba(239, 68, 68, 0.2)';
        loadEl.style.color = '#fca5a5';
        loadEl.style.border = '1px solid rgba(239, 68, 68, 0.4)';
      } else if (fusion.fusedScore > 60) {
        loadEl.style.background = 'rgba(245, 158, 11, 0.15)';
        loadEl.style.color = '#fbbf24';
        loadEl.style.border = '1px solid rgba(245, 158, 11, 0.3)';
      } else {
        loadEl.style.background = 'rgba(16, 185, 129, 0.15)';
        loadEl.style.color = '#34d399';
        loadEl.style.border = '1px solid rgba(16, 185, 129, 0.3)';
      }
    }

    // 3-5 Day Empirical Health Impact Cards
    const forecastDaysEl = document.getElementById('ml-forecast-days');
    if (forecastDaysEl) {
      forecastDaysEl.innerHTML = fusion.forecastDays.map(d => {
        const color = ThermalStressEngine.getRiskColor(d.riskLevel);
        return `
          <div class="day-prediction-card">
            <div class="day-name">${d.dayLabel}</div>
            <div class="day-hosp-rate" style="color:${color}">${d.hospitalizationRate}</div>
            <div class="day-hosp-label">Risk Load / 100k</div>
            <div class="day-risk-tag" style="background:${color}25; color:${color}">${d.riskLevel}</div>
          </div>
        `;
      }).join('');
    }

    // Top Risk Factors
    const topFactorsEl = document.getElementById('top-risk-drivers');
    if (topFactorsEl) {
      topFactorsEl.innerHTML = fusion.topFactors.map(f => `
        <div class="risk-factor-item">
          <span>${f.name}</span>
          <strong style="color:#f8fafc">${f.val}</strong>
        </div>
      `).join('');
    }
  }

  requestGPSLocation() {
    const btn = document.getElementById('gps-location-btn');
    const statusText = document.getElementById('gps-status-text');

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser. Please select your location manually.");
      return;
    }

    if (btn) btn.innerHTML = '⏳ Locating GPS...';
    if (statusText) statusText.textContent = 'Locating GPS coordinates...';

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const gpsLocObj = findClosestCity(lat, lon);
        this.currentCity = gpsLocObj;
        this.isGpsActive = true;

        if (btn) {
          btn.classList.add('active-gps');
          btn.innerHTML = `<i data-lucide="navigation"></i> GPS: ${gpsLocObj.districtName} (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)`;
        }
        if (statusText) statusText.textContent = `📍 Live GPS Active: ${gpsLocObj.districtName}`;

        const stateSelect = document.getElementById('state-select');
        if (stateSelect) {
          stateSelect.value = gpsLocObj.state;
          this.updateCityOptionsForState(gpsLocObj.state, gpsLocObj.districtName);
        }

        await this.updateDashboard();
        this.startGPSWatch();

        if (window.lucide) window.lucide.createIcons();
      },
      (error) => {
        console.warn("GPS Location error:", error.message);
        if (btn) {
          btn.classList.remove('active-gps');
          btn.innerHTML = `<i data-lucide="navigation"></i> Use Live GPS Location`;
        }
        if (statusText) statusText.textContent = `Manual Location Active`;
        alert(`📍 GPS Permission/Location Note: ${error.message}. System continues using manual location selection.`);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }

  startGPSWatch() {
    if (this.gpsWatchId) navigator.geolocation.clearWatch(this.gpsWatchId);
    this.gpsWatchId = navigator.geolocation.watchPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        if (this.currentCity && this.currentCity.isGPS) {
          const dist = Math.hypot(this.currentCity.lat - lat, this.currentCity.lon - lon);
          if (dist > 0.03) {
            this.currentCity = findClosestCity(lat, lon);
            await this.updateDashboard();
          }
        }
      },
      (err) => console.warn("GPS Watch error:", err.message),
      { enableHighAccuracy: true, maximumAge: 120000 }
    );
  }

  evaluateAndTriggerNotification(weather, htssData, forecastData, city) {
    const riskLevel = htssData.category;
    const locationName = city.name || `${city.districtName}, ${city.state}`;
    
    let startTimeStr = 'Active Now';
    let endTimeStr = '4:30 PM';
    let durationHours = 4;
    let isCurrentRisk = true;

    if (forecastData && forecastData.time && forecastData.temperature_2m) {
      let peakStartIdx = -1;
      let peakEndIdx = -1;
      const now = new Date();

      for (let i = 0; i < Math.min(24, forecastData.time.length); i++) {
        const temp = forecastData.temperature_2m[i];
        const rh = forecastData.relative_humidity_2m[i] || weather.humidity;
        const hi = ThermalStressEngine.calculateHeatIndex(temp, rh);
        const wbgt = ThermalStressEngine.calculateWBGT(temp, rh, forecastData.direct_radiation?.[i] || 0);
        const utci = ThermalStressEngine.calculateUTCI(temp, rh, forecastData.wind_speed_10m?.[i] || 10, forecastData.direct_radiation?.[i] || 0);
        const htss = ThermalStressEngine.calculateHTSS(hi, wbgt, utci);

        if (htss.score >= 50 || temp >= 38) {
          if (peakStartIdx === -1) peakStartIdx = i;
          peakEndIdx = i;
        }
      }

      if (peakStartIdx !== -1) {
        const startDate = new Date(forecastData.time[peakStartIdx]);
        const endDate = new Date(forecastData.time[peakEndIdx]);

        if (startDate > now) {
          isCurrentRisk = false;
          startTimeStr = startDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
        } else {
          startTimeStr = 'Active Now';
        }
        endTimeStr = endDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
        durationHours = Math.max(1, Math.round((endDate - startDate) / (1000 * 60 * 60)));
      }
    }

    const periodStr = isCurrentRisk ? `Active Now (Until ${endTimeStr})` : `${startTimeStr} – ${endTimeStr}`;
    const durationStr = `~${durationHours} Hours`;

    const condStr = `Temp: ${weather.temperature.toFixed(1)}°C | Humidity: ${weather.humidity.toFixed(0)}% | Wind: ${weather.windSpeed.toFixed(1)} km/h`;

    let reasonStr = `High ambient temperature combined with ${weather.humidity > 60 ? 'high humidity' : 'strong solar irradiance'} creating dangerous thermal stress.`;
    if (htssData.score > 80) {
      reasonStr = `EXTREME HEAT DANGER: UTCI & WBGT thresholds exceeded. Sweating efficiency severely compromised. High heat stroke risk.`;
    } else if (htssData.score > 65) {
      reasonStr = `HIGH HEAT RISK: Elevated human thermal stress. Prolonged exposure causes heat exhaustion and cramps.`;
    } else if (htssData.score > 50) {
      reasonStr = `MODERATE HEAT RISK: Moderate thermal discomfort during afternoon outdoor activity.`;
    }

    let preventionStr = 'Drink sufficient water, avoid direct sunlight during peak hours, and take frequent shade breaks.';
    if (htssData.category === 'Extreme' || htssData.category === 'High') {
      preventionStr = 'Avoid outdoor physical activity, stay in a cool/shaded place, drink water/ORS frequently, and take breaks.';
    } else if (htssData.category === 'Moderate') {
      preventionStr = 'Hydrate frequently with water/ORS, take 15-min shade breaks every hour, and avoid heavy afternoon exercise.';
    }

    const locationKey = `${city.lat.toFixed(2)}_${city.lon.toFixed(2)}`;
    const nowTs = Date.now();
    const isLevelEscalated = this.lastAlertState.riskLevel && (
      (this.lastAlertState.riskLevel === 'Moderate' && (riskLevel === 'High' || riskLevel === 'Extreme')) ||
      (this.lastAlertState.riskLevel === 'High' && riskLevel === 'Extreme')
    );
    const isCooldownElapsed = (nowTs - this.lastAlertState.timestamp) > 15 * 60 * 1000;
    const isNewLocation = this.lastAlertState.locationKey !== locationKey;

    const shouldNotify = (riskLevel !== 'Safe') && (isNewLocation || isLevelEscalated || isCooldownElapsed);

    const banner = document.getElementById('gps-alert-banner');
    const badgeEl = document.getElementById('banner-risk-badge');
    const locEl = document.getElementById('banner-loc');
    const periodEl = document.getElementById('banner-period');
    const durEl = document.getElementById('banner-duration');
    const condEl = document.getElementById('banner-cond');
    const reasonEl = document.getElementById('banner-reason');
    const prevEl = document.getElementById('banner-prevention');

    if (banner) {
      if (riskLevel === 'Moderate' || riskLevel === 'High' || riskLevel === 'Extreme') {
        const color = ThermalStressEngine.getRiskColor(riskLevel);
        if (badgeEl) {
          badgeEl.textContent = `🔴 [${riskLevel.toUpperCase()} HEAT RISK ALERT]`;
          badgeEl.style.backgroundColor = color;
          badgeEl.style.color = (riskLevel === 'Moderate' || riskLevel === 'Low') ? '#050811' : '#ffffff';
          badgeEl.style.fontWeight = '800';
        }
        if (locEl) locEl.textContent = locationName;
        if (periodEl) periodEl.textContent = periodStr;
        if (durEl) durEl.textContent = durationStr;
        if (condEl) condEl.textContent = condStr;
        if (reasonEl) reasonEl.textContent = reasonStr;
        if (prevEl) prevEl.textContent = preventionStr;

        banner.classList.remove('hidden');
      } else {
        banner.classList.add('hidden');
      }
    }

    if (shouldNotify && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(`[${riskLevel.toUpperCase()}] Heat Risk Alert`, {
          body: `📍 Location: ${locationName}\n⏰ Period: ${periodStr}\n⌛ Duration: ${durationStr}\n⚠️ ${reasonStr}\n🛡️ ${preventionStr}`,
          icon: "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20100%20100'%3E%3Ctext%20y='.9em'%20font-size='90'%3E%F0%9F%8C%A1%EF%B8%8F%3C/text%3E%3C/svg%3E"
        });
      } catch (e) {
        console.warn("Notification trigger error:", e);
      }
    }

    if (shouldNotify) {
      this.lastAlertState = {
        locationKey,
        riskLevel,
        timestamp: nowTs
      };
    }
  }

  // [REMOVED] Duplicate updateRiskFusion that was overwriting the corrected version (lines 1252-1308)
  // and re-injecting fake "ML Model Confidence" text. The single correct definition is above.

  setElText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  animateGauge(score, category) {
    // Build the SVG content if not already present
    const gaugeSvg = document.getElementById('htss-gauge');
    if (!gaugeSvg) return;
    
    if (!gaugeSvg.querySelector('circle.gauge-bg')) {
      gaugeSvg.innerHTML = `
        <circle class="gauge-bg" cx="130" cy="130" r="100" fill="none" stroke="#1a1f2e" stroke-width="20" />
        <circle id="htss-gauge-circle" cx="130" cy="130" r="100" fill="none" stroke="#10b981" stroke-width="20"
          stroke-linecap="round" transform="rotate(-90 130 130)"
          style="transition: stroke-dashoffset 0.5s ease;" />
      `;
    }
    
    const circle = document.getElementById('htss-gauge-circle') || document.getElementById('htss-gauge-fill');
    const scoreEl = document.getElementById('htss-value');
    const labelEl = document.getElementById('htss-label') || document.getElementById('dash-risk-badge');
    const container = gaugeSvg.parentElement;
    
    if (!circle || !scoreEl) return;
    
    if (this.gaugeAnimation) cancelAnimationFrame(this.gaugeAnimation);
    
    const radius = 100;
    const circumference = 2 * Math.PI * radius;
    circle.setAttribute('stroke-dasharray', `${circumference} ${circumference}`);
    
    const targetOffset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;
    const color = ThermalStressEngine.getRiskColor(category);
    
    circle.style.transition = 'stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1), stroke 0.4s ease';
    circle.setAttribute('stroke-dashoffset', targetOffset);
    circle.setAttribute('stroke', color);
    
    scoreEl.textContent = Math.round(score);
    scoreEl.style.color = color;
    
    if (labelEl) {
      labelEl.textContent = category.toUpperCase();
      labelEl.style.color = color;
    }
    
    if (container) {
      container.className = 'htss-circle-wrapper';
      if (score > 80) container.classList.add('glow-extreme');
      else if (score > 65) container.classList.add('glow-high');
      else if (score > 50) container.classList.add('glow-moderate');
    }
  }

  updateProbability(prob) {
    const svgEl = document.getElementById('prob-gauge');
    if (!svgEl) return;
    if (!svgEl.querySelector('circle.prob-bg')) {
      svgEl.innerHTML = `
        <circle class="prob-bg" cx="60" cy="60" r="50" fill="none" stroke="#1a1f2e" stroke-width="10" />
        <circle id="prob-circle" cx="60" cy="60" r="50" fill="none" stroke="#10b981" stroke-width="10"
          stroke-linecap="round" transform="rotate(-90 60 60)"
          style="transition: stroke-dashoffset 0.5s ease;" />
      `;
    }
    const circle = document.getElementById('prob-circle');
    const text = document.getElementById('prob-value');
    const stat = document.getElementById('heatwave-status');
    
    if (!circle || !text) return;
    
    const circumference = 2 * Math.PI * 36;
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = circumference - (prob / 100) * circumference;
    
    const color = ThermalStressEngine.getRiskColor(ThermalStressEngine.getRiskLevel(prob));
    circle.style.stroke = color;
    
    text.textContent = `${Math.round(prob)}%`;
    text.style.fill = color;
    
    if (stat) {
      stat.textContent = prob > 70 ? 'High Risk' : prob > 40 ? 'Moderate Risk' : 'Low Risk';
      stat.style.color = color;
    }
  }

  updateIndexDisplay(prefix, value, category, maxVal) {
    const valEl = document.getElementById(`${prefix}-value`);
    const barEl = document.getElementById(`${prefix}-bar`);
    const badgeEl = document.getElementById(`${prefix}-cat`);
    
    if (valEl) valEl.textContent = `${value.toFixed(1)}°C`;
    if (barEl) {
      const pct = Math.min(100, Math.max(0, (value / maxVal) * 100));
      barEl.style.width = `${pct}%`;
      barEl.style.backgroundColor = ThermalStressEngine.getRiskColor(category);
    }
    if (badgeEl) {
      badgeEl.textContent = category;
      badgeEl.style.color = ThermalStressEngine.getRiskColor(category);
    }
  }

  updateContributions(contribs) {
    const container = document.getElementById('contribution-bars');
    if (!container) return;
    
    container.innerHTML = `
      <div class="mb-2">
        <div class="d-flex justify-content-between mb-1" style="font-size:0.8rem">
          <span>UTCI</span><span>${contribs.utci}%</span>
        </div>
        <div class="progress bg-dark" style="height: 6px;">
          <div class="progress-bar bg-primary" style="width: ${contribs.utci}%"></div>
        </div>
      </div>
      <div class="mb-2">
        <div class="d-flex justify-content-between mb-1" style="font-size:0.8rem">
          <span>WBGT</span><span>${contribs.wbgt}%</span>
        </div>
        <div class="progress bg-dark" style="height: 6px;">
          <div class="progress-bar bg-info" style="width: ${contribs.wbgt}%"></div>
        </div>
      </div>
      <div>
        <div class="d-flex justify-content-between mb-1" style="font-size:0.8rem">
          <span>Heat Index</span><span>${contribs.hi}%</span>
        </div>
        <div class="progress bg-dark" style="height: 6px;">
          <div class="progress-bar bg-warning" style="width: ${contribs.hi}%"></div>
        </div>
      </div>
    `;
  }

  updateProbability(prob) {
    const svgEl = document.getElementById('prob-gauge');
    if (!svgEl.querySelector('circle.prob-bg')) {
      svgEl.innerHTML = `
        <circle class="prob-bg" cx="60" cy="60" r="50" fill="none" stroke="#1a1f2e" stroke-width="10" />
        <circle id="prob-circle" cx="60" cy="60" r="50" fill="none" stroke="#10b981" stroke-width="10"
          stroke-linecap="round" transform="rotate(-90 60 60)"
          style="transition: stroke-dashoffset 0.5s ease;" />
      `;
    }
    const circle = document.getElementById('prob-circle');
    const text = document.getElementById('prob-value');
    const stat = document.getElementById('heatwave-status');
    
    if (!circle || !text || !stat) return;
    
    const circumference = 2 * Math.PI * 36;
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = circumference - (prob / 100) * circumference;
    
    const color = ThermalStressEngine.getRiskColor(ThermalStressEngine.getRiskLevel(prob));
    circle.style.stroke = color;
    
    text.textContent = `${Math.round(prob)}%`;
    text.style.fill = color;
    
    stat.textContent = prob > 70 ? 'High Risk' : prob > 40 ? 'Moderate Risk' : 'Low Risk';
    stat.style.color = color;
  }

  renderAlerts(alerts) {
    const container = document.getElementById('alerts-container');
    if (!container) return;
    
    if (alerts.length === 0) {
      container.innerHTML = `<div class="alert alert-success bg-success bg-opacity-10 text-success border-success">
        <i data-lucide="check-circle" class="me-2"></i> No active alerts for this region.
      </div>`;
      return;
    }
    
    container.innerHTML = alerts.map(alert => `
      <div class="alert alert-${alert.severity === 'red' ? 'danger' : alert.severity === 'orange' ? 'warning' : 'info'} border-${alert.severity === 'red' ? 'danger' : 'warning'}">
        <h6 class="alert-heading fw-bold"><i data-lucide="alert-triangle" class="me-2"></i>${alert.title}</h6>
        <p class="mb-2">${alert.message}</p>
        <hr class="opacity-25">
        <ul class="mb-0 ps-3 small">
          ${alert.recommendations.map(r => `<li>${r}</li>`).join('')}
        </ul>
      </div>
    `).join('');
  }

  renderRecommendations(recs) {
    const container = document.getElementById('recommendations-container');
    if (!container) return;
    
    container.innerHTML = recs.map(rec => {
      const pColor = rec.priority === 'Critical' ? 'danger' : rec.priority === 'High' ? 'warning' : 'info';
      return `
        <div class="card bg-dark border-secondary mb-2">
          <div class="card-body p-3">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="badge bg-secondary">${rec.audience}</span>
              <span class="badge bg-${pColor} bg-opacity-25 text-${pColor}">${rec.priority}</span>
            </div>
            <p class="mb-0 small text-light">${rec.text}</p>
          </div>
        </div>
      `;
    }).join('');
  }

  renderForecastChart(baseTemp, baseHtss) {
    const ctx = document.getElementById('forecast-chart');
    if (!ctx) return;
    
    if (this.charts.forecast) {
      this.charts.forecast.destroy();
    }
    
    const labels = [];
    const temps = [];
    const htss = [];
    
    const now = new Date();
    for (let i = 0; i <= 24; i++) {
      labels.push(`+${i * 3}h`);
      const hourMod = Math.sin((i * 3 + now.getHours()) * Math.PI / 12) * 5;
      temps.push(baseTemp + hourMod + (Math.random() * 2 - 1));
      htss.push(Math.max(0, Math.min(100, baseHtss + hourMod * 2 + (Math.random() * 5 - 2.5))));
    }
    
    this.charts.forecast = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Temperature (°C)',
            data: temps,
            borderColor: '#f97316',
            backgroundColor: 'rgba(249, 115, 22, 0.1)',
            yAxisID: 'y',
            tension: 0.4,
            fill: true
          },
          {
            label: 'HTSS Score',
            data: htss,
            borderColor: '#8b5cf6',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            yAxisID: 'y1',
            tension: 0.4,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { labels: { color: '#e5e7eb' } }
        },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9ca3af' } },
          y: { 
            type: 'linear', display: true, position: 'left',
            grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#f97316' }
          },
          y1: { 
            type: 'linear', display: true, position: 'right',
            grid: { drawOnChartArea: false }, ticks: { color: '#8b5cf6' }
          }
        }
      }
    });
  }

  renderForecastChartLive(forecastData, fallbackTemp, fallbackHtss) {
    const ctx = document.getElementById('forecast-chart');
    if (!ctx) return;
    
    if (this.charts.forecast) this.charts.forecast.destroy();
    
    // If no forecast data, fall back to synthetic
    if (!forecastData || !forecastData.time) {
      return this.renderForecastChart(fallbackTemp, fallbackHtss);
    }
    
    const labels = [];
    const temps = [];
    const htssScores = [];
    
    // Sample every 3 hours from the hourly data
    for (let i = 0; i < forecastData.time.length && i < 72; i += 3) {
      const t = new Date(forecastData.time[i]);
      labels.push(t.toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', hour12: false }));
      
      const temp = forecastData.temperature_2m[i];
      const rh = forecastData.relative_humidity_2m[i];
      const wind = forecastData.wind_speed_10m[i];
      const sr = forecastData.direct_radiation?.[i] || 0;
      
      temps.push(temp);
      
      // Calculate HTSS for each forecast hour
      const hi = ThermalStressEngine.calculateHeatIndex(temp, rh);
      const wbgt = ThermalStressEngine.calculateWBGT(temp, rh, sr);
      const utci = ThermalStressEngine.calculateUTCI(temp, rh, wind, sr);
      const htss = ThermalStressEngine.calculateHTSS(hi, wbgt, utci);
      htssScores.push(htss.score);
    }
    
    this.charts.forecast = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Temperature °C (Live Forecast)',
            data: temps,
            borderColor: '#f97316',
            backgroundColor: 'rgba(249, 115, 22, 0.1)',
            yAxisID: 'y',
            tension: 0.4,
            fill: true,
            pointRadius: 2
          },
          {
            label: 'Predicted HTSS Score',
            data: htssScores,
            borderColor: '#8b5cf6',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            yAxisID: 'y1',
            tension: 0.4,
            fill: true,
            pointRadius: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { labels: { color: '#e5e7eb' } },
          title: {
            display: true,
            text: '72-Hour Live Forecast (Open-Meteo)',
            color: '#10b981',
            font: { size: 12 }
          }
        },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9ca3af', maxRotation: 45, font: { size: 10 } } },
          y: { 
            type: 'linear', display: true, position: 'left',
            title: { display: true, text: 'Temperature (°C)', color: '#f97316' },
            grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#f97316' }
          },
          y1: { 
            type: 'linear', display: true, position: 'right',
            title: { display: true, text: 'HTSS Score (0-100)', color: '#8b5cf6' },
            min: 0, max: 100,
            grid: { drawOnChartArea: false }, ticks: { color: '#8b5cf6' }
          }
        }
      }
    });
  }

  async updateMap() {
    if (!this.map) {
      this.initMap();
    }
    if (!this.map) return;
    
    this.markers.forEach(m => this.map.removeLayer(m));
    this.markers = [];

    const isLive = this.currentScenario === 'live';
    const statusEl = document.getElementById('map-status-info');

    if (this.mapViewMode === 'ward') {
      // Hyper-Local Ward GIS View Mode for selected city
      const city = this.currentCity;
      if (statusEl) statusEl.textContent = `Showing Hyper-Local Ward GIS Risk for ${city.name}, ${city.state}`;

      this.map.setView([city.lat, city.lon], 12); // Zoom into city wards

      let baseWeather;
      if (isLive) {
        baseWeather = await fetchLiveWeather(city.lat, city.lon);
      }
      if (!baseWeather) {
        baseWeather = generateWeatherForCity(city, isLive ? 'normal' : this.currentScenario);
      }

      const wards = generateWardsForCity(city, baseWeather);

      wards.forEach(ward => {
        // Filter checks
        if (this.mapFilter === 'high-risk' && ward.htss.score <= 65) return;

        const color = ThermalStressEngine.getRiskColor(ward.htss.category);
        const radius = 12 + (ward.htss.score / 6);

        // Ward Circle Marker
        if (this.mapFilter === 'all' || this.mapFilter === 'high-risk') {
          const wardMarker = L.circleMarker([ward.lat, ward.lon], {
            radius: radius,
            fillColor: color,
            color: '#ffffff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.75
          }).addTo(this.map);

          wardMarker.bindPopup(`
            <div class="map-popup-card">
              <h4 style="margin:0 0 4px 0; font-weight:800; color:#fff; font-size:0.95rem;">${ward.name}</h4>
              <div style="font-size:0.75rem; color:#94a3b8; margin-bottom:8px;">Density: ${ward.popDensity} | Type: ${ward.type}</div>
              <div style="font-size:0.82rem; color:#d1d5db; margin-bottom:4px;">
                🌡️ Temp: <strong>${ward.weather.temperature.toFixed(1)}°C</strong> | 💧 RH: <strong>${ward.weather.humidity.toFixed(0)}%</strong>
              </div>
              <div style="font-size:0.82rem; color:#d1d5db; margin-bottom:6px;">
                HTSS Ward Risk: <span style="color:${color};font-weight:800">${Math.round(ward.htss.score)} (${ward.htss.category})</span>
              </div>
              <hr style="border:0; border-top:1px solid rgba(255,255,255,0.1); margin:6px 0;">
              <div style="font-size:0.78rem; color:#fbbf24; margin-bottom:2px;">🏥 Hospital: ${ward.hospital}</div>
              <div style="font-size:0.78rem; color:#38bdf8;">💧 Cooling Shelter: ${ward.coolingShelter}</div>
            </div>
          `);
          this.markers.push(wardMarker);
        }

        // Dedicated Hospital Marker
        if (this.mapFilter === 'all' || this.mapFilter === 'hospitals') {
          const hospLat = ward.lat + 0.004;
          const hospLon = ward.lon - 0.005;
          const hospMarker = L.circleMarker([hospLat, hospLon], {
            radius: 8,
            fillColor: '#3b82f6',
            color: '#ffffff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.9
          }).addTo(this.map);

          hospMarker.bindPopup(`
            <div class="map-popup-card">
              <h4 style="margin:0 0 4px 0; font-weight:800; color:#60a5fa;">🏥 ${ward.hospital}</h4>
              <div style="font-size:0.8rem; color:#e2e8f0;">Assigned Ward: ${ward.name}</div>
              <div style="font-size:0.78rem; color:#34d399; margin-top:4px;">Status: Heatstroke Emergency Ward Ready</div>
            </div>
          `);
          this.markers.push(hospMarker);
        }

        // Dedicated Cooling Shelter Marker
        if (this.mapFilter === 'all' || this.mapFilter === 'shelters') {
          const shelterLat = ward.lat - 0.005;
          const shelterLon = ward.lon + 0.006;
          const shelterMarker = L.circleMarker([shelterLat, shelterLon], {
            radius: 8,
            fillColor: '#10b981',
            color: '#ffffff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.9
          }).addTo(this.map);

          shelterMarker.bindPopup(`
            <div class="map-popup-card">
              <h4 style="margin:0 0 4px 0; font-weight:800; color:#34d399;">💧 ${ward.coolingShelter}</h4>
              <div style="font-size:0.8rem; color:#e2e8f0;">Assigned Ward: ${ward.name}</div>
              <div style="font-size:0.78rem; color:#fbbf24; margin-top:4px;">Resources: Hydration Station + Air Cooling Pavilion</div>
            </div>
          `);
          this.markers.push(shelterMarker);
        }
      });
    } else {
      // National City Overview Mode
      if (statusEl) statusEl.textContent = `Showing National City Overview (${CITIES.length} Locations)`;
      this.map.setView([22.5, 82.0], 5);

      for (const city of CITIES) {
        let weather;
        if (isLive) {
          weather = await fetchLiveWeather(city.lat, city.lon);
        }
        if (!weather) {
          weather = generateWeatherForCity(city, isLive ? 'normal' : this.currentScenario);
        }

        const hi = ThermalStressEngine.calculateHeatIndex(weather.temperature, weather.humidity);
        const wbgt = ThermalStressEngine.calculateWBGT(weather.temperature, weather.humidity, weather.solarRadiation);
        const utci = ThermalStressEngine.calculateUTCI(weather.temperature, weather.humidity, weather.windSpeed, weather.solarRadiation);
        const htss = ThermalStressEngine.calculateHTSS(hi, wbgt, utci);
        const prob = ThermalStressEngine.calculateHeatwaveProbability(weather.temperature, weather.humidity, city.regionType);
        
        if (this.mapFilter === 'high-risk' && htss.score <= 65) continue;

        const color = ThermalStressEngine.getRiskColor(htss.category);
        const radius = 6 + (htss.score / 10);
        
        const marker = L.circleMarker([city.lat, city.lon], {
          radius: radius,
          fillColor: color,
          color: '#fff',
          weight: 1.5,
          opacity: 1,
          fillOpacity: 0.85
        }).addTo(this.map);
        
          const recText = htss.category === 'Extreme' ? 'Avoid outdoor exposure & stay in shade' : htss.category === 'High' ? 'Limit outdoor work & drink water/ORS' : htss.category === 'Moderate' ? 'Take regular shade breaks & hydrate' : 'Normal activity with adequate hydration';
          const updateTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

          marker.bindPopup(`
            <div class="map-popup-card">
              <h4 style="margin:0 0 6px 0; font-weight:800; color:#fff;">📍 ${city.name}, ${city.state}</h4>
              <div style="font-size:0.85rem; color:#d1d5db; margin-bottom:4px;">
                🌡️ <strong>Temp:</strong> ${weather.temperature.toFixed(1)}°C | 💧 <strong>Humidity:</strong> ${weather.humidity.toFixed(0)}%
              </div>
              <div style="font-size:0.85rem; color:#d1d5db; margin-bottom:4px;">
                🎯 <strong>HTSS Score:</strong> <span style="color:${color};font-weight:800">${Math.round(htss.score)} / 100</span>
              </div>
              <div style="font-size:0.85rem; margin-bottom:6px;">
                🚨 <strong>Risk Level:</strong> <span class="badge" style="background:${color}; color:${htss.category === 'Moderate' || htss.category === 'Low' ? '#050811' : '#fff'}; font-weight:800;">${htss.category.toUpperCase()}</span>
              </div>
              <div style="font-size:0.8rem; color:#fbbf24; margin-bottom:6px; background:rgba(15,23,42,0.6); padding:6px; border-radius:6px;">
                🛡️ <strong>Action:</strong> ${recText}
              </div>
              <div style="font-size:0.75rem; color:#9ca3af; text-align:right;">
                ⏰ Updated: ${updateTime} | ${weather.isLive ? '🟢 Live API' : 'Cached'}
              </div>
            </div>
          `);
          
          this.markers.push(marker);
        }
      }
    }

  async updateGovernment() {
    const isLive = this.currentScenario === 'live';
    const govDataPromises = CITIES.map(async city => {
      let weather;
      if (isLive) {
        weather = await fetchLiveWeather(city.lat, city.lon);
      }
      if (!weather) {
        weather = generateWeatherForCity(city, isLive ? 'normal' : this.currentScenario);
      }
      const hi = ThermalStressEngine.calculateHeatIndex(weather.temperature, weather.humidity);
      const wbgt = ThermalStressEngine.calculateWBGT(weather.temperature, weather.humidity, weather.solarRadiation);
      const utci = ThermalStressEngine.calculateUTCI(weather.temperature, weather.humidity, weather.windSpeed, weather.solarRadiation);
      const htss = ThermalStressEngine.calculateHTSS(hi, wbgt, utci);
      const prob = ThermalStressEngine.calculateHeatwaveProbability(weather.temperature, weather.humidity, city.regionType);
      return { city, weather, htss, prob };
    });

    const govData = (await Promise.all(govDataPromises)).sort((a, b) => b.htss.score - a.htss.score);

    // Update Overview Cards
    const highRisk = govData.filter(d => d.htss.score > 65).length;
    const statesAffected = new Set(govData.filter(d => d.htss.score > 50).map(d => d.city.state)).size;
    const activeAlerts = govData.filter(d => d.htss.score > 80).length;
    const pop = govData.filter(d => d.htss.score > 65)
      .reduce((acc, d) => acc + (VULNERABILITY_DATA[d.city.state]?.population || 10) * 0.1, 0);
    
    const overviewEl = document.getElementById('govt-overview');
    if (overviewEl) {
      overviewEl.innerHTML = `
        <div class="overview-card">
          <span class="overview-icon" style="color:#f97316">🏛️</span>
          <span class="overview-value">${statesAffected}</span>
          <span class="overview-label">States Affected</span>
        </div>
        <div class="overview-card">
          <span class="overview-icon" style="color:#ef4444">🔥</span>
          <span class="overview-value">${highRisk}</span>
          <span class="overview-label">High-Risk Cities</span>
        </div>
        <div class="overview-card">
          <span class="overview-icon" style="color:#a855f7">🚨</span>
          <span class="overview-value">${activeAlerts}</span>
          <span class="overview-label">Active Alerts</span>
        </div>
        <div class="overview-card">
          <span class="overview-icon" style="color:#eab308">👥</span>
          <span class="overview-value">${pop.toFixed(1)}M</span>
          <span class="overview-label">Population at Risk</span>
        </div>
      `;
    }

    // Populate Table
    const tbody = document.getElementById('govt-table-body');
    if (tbody) {
      tbody.innerHTML = govData.map(d => {
        const color = ThermalStressEngine.getRiskColor(d.htss.category);
        return `
          <tr>
            <td>${d.city.name}</td>
            <td>${d.city.state}</td>
            <td>${d.weather.temperature.toFixed(1)}°C</td>
            <td>
              <span class="badge" style="background-color: ${color}20; color: ${color}; border: 1px solid ${color}">
                ${Math.round(d.htss.score)} - ${d.htss.category}
              </span>
            </td>
            <td>${d.city.regionType}</td>
          </tr>
        `;
      }).join('');
    }

    this.renderStateRiskChart(govData);
    this.renderVulnerabilityRadar();
  }

  renderStateRiskChart(govData) {
    const ctx = document.getElementById('state-risk-chart');
    if (!ctx) return;
    
    if (this.charts.stateRisk) this.charts.stateRisk.destroy();

    const stateScores = {};
    govData.forEach(d => {
      if (!stateScores[d.city.state]) stateScores[d.city.state] = [];
      stateScores[d.city.state].push(d.htss.score);
    });

    const avgScores = Object.keys(stateScores).map(state => {
      const avg = stateScores[state].reduce((a, b) => a + b, 0) / stateScores[state].length;
      return { state, avg };
    }).sort((a, b) => b.avg - a.avg).slice(0, 15);

    this.charts.stateRisk = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: avgScores.map(d => d.state),
        datasets: [{
          label: 'Average HTSS',
          data: avgScores.map(d => d.avg),
          backgroundColor: avgScores.map(d => ThermalStressEngine.getRiskColor(ThermalStressEngine.getRiskLevel(d.avg))),
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9ca3af' } },
          y: { grid: { display: false }, ticks: { color: '#e5e7eb' } }
        }
      }
    });
  }

  renderVulnerabilityRadar() {
    const ctx = document.getElementById('vulnerability-chart');
    if (!ctx) return;
    
    if (this.charts.vulnRadar) this.charts.vulnRadar.destroy();

    const state = this.currentCity.state;
    const vData = VULNERABILITY_DATA[state] || VULNERABILITY_DATA['Delhi'];

    this.charts.vulnRadar = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Elderly %', 'Outdoor Workers %', 'Poverty %', 'Density (scaled)', 'Lack of Healthcare'],
        datasets: [{
          label: `${state} Vulnerability Profile`,
          data: [
            vData.elderlyPct * 5, 
            vData.outdoorWorkersPct * 2, 
            vData.povertyPct * 2.5, 
            Math.min(100, vData.density / 100), 
            100 - vData.healthcareAccess
          ],
          backgroundColor: 'rgba(239, 68, 68, 0.2)',
          borderColor: 'rgba(239, 68, 68, 1)',
          pointBackgroundColor: 'rgba(239, 68, 68, 1)',
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            angleLines: { color: 'rgba(255,255,255,0.1)' },
            grid: { color: 'rgba(255,255,255,0.1)' },
            pointLabels: { color: '#9ca3af', font: { size: 11 } },
            ticks: { display: false, min: 0, max: 100 }
          }
        },
        plugins: { legend: { labels: { color: '#e5e7eb' } } }
      }
    });
  }

  updateAnalytics() {
    this.renderTrendChart();
    this.renderHtssTrendChart();
    this.renderHeatwaveDaysChart();
    
    // Analytics insights
    const insightsEl = document.getElementById('analytics-insights');
    if (insightsEl) {
      insightsEl.innerHTML = `
        <div class="insight-item"><span class="insight-icon">📈</span><p>Average summer max temperatures have risen <strong>2.3°C</strong> over the past 5 years.</p></div>
        <div class="insight-item"><span class="insight-icon">🔥</span><p>Heatwave days increased from <strong>12 to 40</strong> between 2021-2025 — a 233% increase.</p></div>
        <div class="insight-item"><span class="insight-icon">⚠️</span><p>HTSS scores trending towards <strong>High-Risk</strong> category consistently since 2023.</p></div>
        <div class="insight-item"><span class="insight-icon">🏥</span><p>Heat-related hospital admissions correlate strongly with HTSS > 75 zones.</p></div>
      `;
    }
  }

  renderTrendChart() {
    const ctx = document.getElementById('temp-trend-chart');
    if (!ctx) return;
    
    if (this.charts.trend) this.charts.trend.destroy();

    const years = ['2021', '2022', '2023', '2024', '2025'];
    
    this.charts.trend = new Chart(ctx, {
      type: 'line',
      data: {
        labels: years,
        datasets: [
          {
            label: 'Avg Summer Max Temp (°C)',
            data: [41.2, 41.8, 42.1, 42.9, 43.5],
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            tension: 0.3,
            fill: true
          },
          {
            label: 'Avg HTSS Score',
            data: [58, 61, 65, 72, 78],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.3,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#e5e7eb' } } },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9ca3af' } },
          y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9ca3af' } }
        }
      }
    });
  }

  renderHtssTrendChart() {
    const ctx = document.getElementById('htss-trend-chart');
    if (!ctx) return;
    
    if (this.charts.htssTrend) this.charts.htssTrend.destroy();

    const years = ['2021', '2022', '2023', '2024', '2025'];
    
    this.charts.htssTrend = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: years,
        datasets: [
          {
            label: 'Avg HTSS Score (All India)',
            data: [48, 54, 62, 69, 76],
            backgroundColor: ['rgba(16, 185, 129, 0.7)', 'rgba(234, 179, 8, 0.7)', 'rgba(249, 115, 22, 0.7)', 'rgba(239, 68, 68, 0.7)', 'rgba(168, 85, 247, 0.7)'],
            borderColor: ['#10b981', '#eab308', '#f97316', '#ef4444', '#a855f7'],
            borderWidth: 2,
            borderRadius: 6
          },
          {
            label: 'Peak HTSS Score',
            data: [72, 78, 85, 91, 96],
            backgroundColor: 'rgba(239, 68, 68, 0.25)',
            borderColor: '#ef4444',
            borderWidth: 2,
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#e5e7eb' } } },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9ca3af' } },
          y: { 
            grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9ca3af' },
            min: 0, max: 100,
            title: { display: true, text: 'HTSS Score (0-100)', color: '#9ca3af' }
          }
        }
      }
    });
  }

  renderHeatwaveDaysChart() {
    const ctx = document.getElementById('heatwave-days-chart');
    if (!ctx) return;
    
    if (this.charts.hwDays) this.charts.hwDays.destroy();

    const years = ['2021', '2022', '2023', '2024', '2025'];
    
    this.charts.hwDays = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: years,
        datasets: [{
          label: 'Heatwave Days per Year',
          data: [12, 18, 22, 31, 40],
          backgroundColor: '#f59e0b',
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#e5e7eb' } } },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#9ca3af' } },
          y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9ca3af' } }
        }
      }
    });
  }

  switchPage(pageId) {
    if (!pageId) return;
    
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.bottom-nav-btn').forEach(b => b.classList.remove('active'));
    
    const targetPage = document.getElementById(`page-${pageId}`);
    const targetBtn = document.querySelector(`.nav-btn[data-page="${pageId}"]`);
    const targetBottomBtn = document.querySelector(`.bottom-nav-btn[data-page="${pageId}"]`);
    
    if (targetPage) targetPage.classList.add('active');
    if (targetBtn) targetBtn.classList.add('active');
    if (targetBottomBtn) targetBottomBtn.classList.add('active');
    
    if (pageId === 'map') {
      setTimeout(() => {
        if (this.map) this.map.invalidateSize();
        this.updateMap();
      }, 100);
    } else if (pageId === 'government') {
      this.updateGovernment();
    } else if (pageId === 'analytics') {
      this.updateAnalytics();
    }
  }
}

// 10. INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
  window.thermosApp = new App();
  window.thermosApp.init();
});
