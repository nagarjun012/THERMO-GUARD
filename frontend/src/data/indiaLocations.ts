export interface District {
  name: string;
  lat: number;
  lon: number;
  hasWardData?: boolean;
  dataStatus?: 'LIVE' | 'DEMO' | 'LIMITED' | 'UNAVAILABLE';
}

export interface StateUT {
  name: string;
  type: 'State' | 'Union Territory';
  districts: District[];
}

export const INDIA_LOCATIONS: StateUT[] = [
  {
    "name": "Andhra Pradesh",
    "type": "State",
    "districts": [
      {
        "name": "Alluri Sitharama Raju",
        "lat": 18.15,
        "lon": 82.68
      },
      {
        "name": "Anakapalli",
        "lat": 17.68,
        "lon": 83.01
      },
      {
        "name": "Ananthapuramu",
        "lat": 14.68,
        "lon": 77.6
      },
      {
        "name": "Annamayya",
        "lat": 14.15,
        "lon": 79.1
      },
      {
        "name": "Bapatla",
        "lat": 15.9,
        "lon": 80.46
      },
      {
        "name": "Chittoor",
        "lat": 13.21,
        "lon": 79.1
      },
      {
        "name": "Dr. B.R. Ambedkar Konaseema",
        "lat": 16.55,
        "lon": 81.98
      },
      {
        "name": "East Godavari",
        "lat": 17.0,
        "lon": 81.8
      },
      {
        "name": "Eluru",
        "lat": 16.71,
        "lon": 81.1
      },
      {
        "name": "Guntur",
        "lat": 16.3,
        "lon": 80.44
      },
      {
        "name": "Kakinada",
        "lat": 16.98,
        "lon": 82.24
      },
      {
        "name": "Krishna",
        "lat": 16.18,
        "lon": 81.13
      },
      {
        "name": "Kurnool",
        "lat": 15.82,
        "lon": 78.03
      },
      {
        "name": "Nandyal",
        "lat": 15.48,
        "lon": 78.48
      },
      {
        "name": "NTR",
        "lat": 16.5,
        "lon": 80.64
      },
      {
        "name": "Palnadu",
        "lat": 16.23,
        "lon": 80.05
      },
      {
        "name": "Parvathipuram Manyam",
        "lat": 18.78,
        "lon": 83.42
      },
      {
        "name": "Prakasam",
        "lat": 15.5,
        "lon": 80.05
      },
      {
        "name": "Sri Potti Sriramulu Nellore",
        "lat": 14.44,
        "lon": 79.98
      },
      {
        "name": "Sri Sathya Sai",
        "lat": 14.16,
        "lon": 77.81
      },
      {
        "name": "Srikakulam",
        "lat": 18.3,
        "lon": 83.9
      },
      {
        "name": "Tirupati",
        "lat": 13.62,
        "lon": 79.41
      },
      {
        "name": "Visakhapatnam",
        "lat": 17.68,
        "lon": 83.21
      },
      {
        "name": "Vizianagaram",
        "lat": 18.11,
        "lon": 83.41
      },
      {
        "name": "West Godavari",
        "lat": 16.7,
        "lon": 81.1
      },
      {
        "name": "YSR (Kadapa)",
        "lat": 14.47,
        "lon": 78.82
      }
    ]
  },
  {
    "name": "Arunachal Pradesh",
    "type": "State",
    "districts": [
      {
        "name": "Anjaw",
        "lat": 27.91,
        "lon": 96.25
      },
      {
        "name": "Bichom",
        "lat": 27.2,
        "lon": 92.5
      },
      {
        "name": "Changlang",
        "lat": 27.12,
        "lon": 95.73
      },
      {
        "name": "Dibang Valley",
        "lat": 28.6,
        "lon": 95.8
      },
      {
        "name": "East Kameng",
        "lat": 27.32,
        "lon": 93.03
      },
      {
        "name": "East Siang",
        "lat": 28.06,
        "lon": 95.32
      },
      {
        "name": "Kamle",
        "lat": 27.7,
        "lon": 93.8
      },
      {
        "name": "Keyi Panyor",
        "lat": 27.5,
        "lon": 93.7
      },
      {
        "name": "Kra Daadi",
        "lat": 27.9,
        "lon": 93.5
      },
      {
        "name": "Kurung Kumey",
        "lat": 27.9,
        "lon": 93.35
      },
      {
        "name": "Lepa Rada",
        "lat": 27.8,
        "lon": 94.7
      },
      {
        "name": "Lohit",
        "lat": 27.9,
        "lon": 96.16
      },
      {
        "name": "Longding",
        "lat": 26.85,
        "lon": 95.3
      },
      {
        "name": "Lower Dibang Valley",
        "lat": 28.14,
        "lon": 95.84
      },
      {
        "name": "Lower Siang",
        "lat": 27.7,
        "lon": 94.6
      },
      {
        "name": "Lower Subansiri",
        "lat": 27.55,
        "lon": 93.83
      },
      {
        "name": "Namsai",
        "lat": 27.67,
        "lon": 95.86
      },
      {
        "name": "Pakke-Kessang",
        "lat": 27.1,
        "lon": 93.1
      },
      {
        "name": "Papum Pare",
        "lat": 27.15,
        "lon": 93.62
      },
      {
        "name": "Shi Yomi",
        "lat": 28.5,
        "lon": 94.2
      },
      {
        "name": "Siang",
        "lat": 28.3,
        "lon": 94.9
      },
      {
        "name": "Tawang",
        "lat": 27.58,
        "lon": 91.86
      },
      {
        "name": "Tirap",
        "lat": 27.0,
        "lon": 95.5
      },
      {
        "name": "Upper Siang",
        "lat": 28.6,
        "lon": 94.9
      },
      {
        "name": "Upper Subansiri",
        "lat": 28.2,
        "lon": 93.8
      },
      {
        "name": "West Kameng",
        "lat": 27.3,
        "lon": 92.4
      },
      {
        "name": "West Siang",
        "lat": 28.1,
        "lon": 94.8
      },
      {
        "name": "Itanagar Capital Complex",
        "lat": 27.08,
        "lon": 93.6
      }
    ]
  },
  {
    "name": "Assam",
    "type": "State",
    "districts": [
      {
        "name": "Baksa",
        "lat": 26.69,
        "lon": 91.42
      },
      {
        "name": "Barpeta",
        "lat": 26.32,
        "lon": 91.0
      },
      {
        "name": "Biswanath",
        "lat": 26.73,
        "lon": 93.15
      },
      {
        "name": "Bongaigaon",
        "lat": 26.47,
        "lon": 90.56
      },
      {
        "name": "Cachar",
        "lat": 24.83,
        "lon": 92.8
      },
      {
        "name": "Charaideo",
        "lat": 27.0,
        "lon": 94.9
      },
      {
        "name": "Chirang",
        "lat": 26.54,
        "lon": 90.5
      },
      {
        "name": "Darrang",
        "lat": 26.45,
        "lon": 92.03
      },
      {
        "name": "Dhemaji",
        "lat": 27.48,
        "lon": 94.58
      },
      {
        "name": "Dhubri",
        "lat": 26.02,
        "lon": 89.97
      },
      {
        "name": "Dibrugarh",
        "lat": 27.47,
        "lon": 94.91
      },
      {
        "name": "Dima Hasao",
        "lat": 25.17,
        "lon": 93.02
      },
      {
        "name": "Goalpara",
        "lat": 26.17,
        "lon": 90.62
      },
      {
        "name": "Golaghat",
        "lat": 26.52,
        "lon": 93.96
      },
      {
        "name": "Hailakandi",
        "lat": 24.68,
        "lon": 92.56
      },
      {
        "name": "Hojai",
        "lat": 26.0,
        "lon": 92.86
      },
      {
        "name": "Jorhat",
        "lat": 26.75,
        "lon": 94.22
      },
      {
        "name": "Kamrup",
        "lat": 26.3,
        "lon": 91.5
      },
      {
        "name": "Kamrup Metropolitan",
        "lat": 26.14,
        "lon": 91.73
      },
      {
        "name": "Karbi Anglong",
        "lat": 26.15,
        "lon": 93.5
      },
      {
        "name": "Karimganj",
        "lat": 24.87,
        "lon": 92.35
      },
      {
        "name": "Kokrajhar",
        "lat": 26.4,
        "lon": 90.27
      },
      {
        "name": "Lakhimpur",
        "lat": 27.23,
        "lon": 94.1
      },
      {
        "name": "Majuli",
        "lat": 26.95,
        "lon": 94.17
      },
      {
        "name": "Morigaon",
        "lat": 26.25,
        "lon": 92.33
      },
      {
        "name": "Nagaon",
        "lat": 26.35,
        "lon": 92.68
      },
      {
        "name": "Nalbari",
        "lat": 26.44,
        "lon": 91.44
      },
      {
        "name": "Sivasagar",
        "lat": 26.98,
        "lon": 94.63
      },
      {
        "name": "Sonitpur",
        "lat": 26.63,
        "lon": 92.8
      },
      {
        "name": "South Salmara-Mankachar",
        "lat": 25.75,
        "lon": 89.9
      },
      {
        "name": "Tamulpur",
        "lat": 26.62,
        "lon": 91.56
      },
      {
        "name": "Tinsukia",
        "lat": 27.5,
        "lon": 95.36
      },
      {
        "name": "Udalguri",
        "lat": 26.74,
        "lon": 92.13
      },
      {
        "name": "West Karbi Anglong",
        "lat": 25.8,
        "lon": 92.5
      },
      {
        "name": "Bajali",
        "lat": 26.55,
        "lon": 91.13
      }
    ]
  },
  {
    "name": "Bihar",
    "type": "State",
    "districts": [
      {
        "name": "Araria",
        "lat": 26.15,
        "lon": 87.52
      },
      {
        "name": "Arwal",
        "lat": 25.24,
        "lon": 84.68
      },
      {
        "name": "Aurangabad",
        "lat": 24.75,
        "lon": 84.37
      },
      {
        "name": "Banka",
        "lat": 24.88,
        "lon": 86.92
      },
      {
        "name": "Begusarai",
        "lat": 25.42,
        "lon": 86.13
      },
      {
        "name": "Bhagalpur",
        "lat": 25.25,
        "lon": 87.0
      },
      {
        "name": "Bhojpur",
        "lat": 25.56,
        "lon": 84.67
      },
      {
        "name": "Buxar",
        "lat": 25.56,
        "lon": 83.98
      },
      {
        "name": "Darbhanga",
        "lat": 26.15,
        "lon": 85.9
      },
      {
        "name": "East Champaran (Motihari)",
        "lat": 26.65,
        "lon": 84.91
      },
      {
        "name": "Gaya",
        "lat": 24.79,
        "lon": 85.0
      },
      {
        "name": "Gopalganj",
        "lat": 26.47,
        "lon": 84.44
      },
      {
        "name": "Jamui",
        "lat": 24.92,
        "lon": 86.22
      },
      {
        "name": "Jehanabad",
        "lat": 25.21,
        "lon": 84.98
      },
      {
        "name": "Kaimur (Bhabua)",
        "lat": 25.04,
        "lon": 83.61
      },
      {
        "name": "Katihar",
        "lat": 25.54,
        "lon": 87.57
      },
      {
        "name": "Khagaria",
        "lat": 25.5,
        "lon": 86.48
      },
      {
        "name": "Kishanganj",
        "lat": 26.07,
        "lon": 87.95
      },
      {
        "name": "Lakhisarai",
        "lat": 25.17,
        "lon": 86.09
      },
      {
        "name": "Madhepura",
        "lat": 25.92,
        "lon": 86.79
      },
      {
        "name": "Madhubani",
        "lat": 26.35,
        "lon": 86.07
      },
      {
        "name": "Munger",
        "lat": 25.37,
        "lon": 86.47
      },
      {
        "name": "Muzaffarpur",
        "lat": 26.12,
        "lon": 85.39
      },
      {
        "name": "Nalanda",
        "lat": 25.2,
        "lon": 85.52
      },
      {
        "name": "Nawada",
        "lat": 24.88,
        "lon": 85.53
      },
      {
        "name": "Patna",
        "lat": 25.6,
        "lon": 85.13
      },
      {
        "name": "Purnia",
        "lat": 25.78,
        "lon": 87.47
      },
      {
        "name": "Rohtas",
        "lat": 24.95,
        "lon": 84.01
      },
      {
        "name": "Saharsa",
        "lat": 25.88,
        "lon": 86.6
      },
      {
        "name": "Samastipur",
        "lat": 25.86,
        "lon": 85.78
      },
      {
        "name": "Saran",
        "lat": 25.92,
        "lon": 84.74
      },
      {
        "name": "Sheikhpura",
        "lat": 25.13,
        "lon": 85.85
      },
      {
        "name": "Sheohar",
        "lat": 26.52,
        "lon": 85.3
      },
      {
        "name": "Sitamarhi",
        "lat": 26.6,
        "lon": 85.48
      },
      {
        "name": "Siwan",
        "lat": 26.22,
        "lon": 84.36
      },
      {
        "name": "Supaul",
        "lat": 26.12,
        "lon": 86.6
      },
      {
        "name": "Vaishali",
        "lat": 25.68,
        "lon": 85.22
      },
      {
        "name": "West Champaran (Bettiah)",
        "lat": 26.8,
        "lon": 84.5
      }
    ]
  },
  {
    "name": "Chhattisgarh",
    "type": "State",
    "districts": [
      {
        "name": "Balod",
        "lat": 20.73,
        "lon": 81.2
      },
      {
        "name": "Baloda Bazar-Bhatapara",
        "lat": 21.65,
        "lon": 82.15
      },
      {
        "name": "Balrampur-Ramanujganj",
        "lat": 23.61,
        "lon": 83.6
      },
      {
        "name": "Bastar (Jagdalpur)",
        "lat": 19.07,
        "lon": 82.03
      },
      {
        "name": "Bemetara",
        "lat": 21.7,
        "lon": 81.54
      },
      {
        "name": "Bijapur",
        "lat": 18.79,
        "lon": 80.81
      },
      {
        "name": "Bilaspur",
        "lat": 22.08,
        "lon": 82.15
      },
      {
        "name": "Dakshin Bastar Dantewada",
        "lat": 18.9,
        "lon": 81.35
      },
      {
        "name": "Dhamtari",
        "lat": 20.71,
        "lon": 81.55
      },
      {
        "name": "Durg",
        "lat": 21.19,
        "lon": 81.28
      },
      {
        "name": "Gariaband",
        "lat": 20.96,
        "lon": 82.08
      },
      {
        "name": "Gaurela-Pendra-Marwahi",
        "lat": 22.75,
        "lon": 81.95
      },
      {
        "name": "Janjgir-Champa",
        "lat": 22.01,
        "lon": 82.57
      },
      {
        "name": "Jashpur",
        "lat": 22.88,
        "lon": 84.15
      },
      {
        "name": "Kabirdham (Kawardha)",
        "lat": 22.01,
        "lon": 81.25
      },
      {
        "name": "Khairagarh-Chhuikhadan-Gandai",
        "lat": 21.42,
        "lon": 80.97
      },
      {
        "name": "Kondagaon",
        "lat": 19.6,
        "lon": 81.66
      },
      {
        "name": "Korba",
        "lat": 22.35,
        "lon": 82.68
      },
      {
        "name": "Koriya",
        "lat": 23.25,
        "lon": 82.55
      },
      {
        "name": "Mahasamund",
        "lat": 21.11,
        "lon": 82.1
      },
      {
        "name": "Manendragarh-Chirmiri-Bharatpur",
        "lat": 23.2,
        "lon": 82.2
      },
      {
        "name": "Mohla-Manpur-Ambagarh Chowki",
        "lat": 20.62,
        "lon": 80.74
      },
      {
        "name": "Mungeli",
        "lat": 22.07,
        "lon": 81.68
      },
      {
        "name": "Narayanpur",
        "lat": 19.72,
        "lon": 81.25
      },
      {
        "name": "Raigarh",
        "lat": 21.9,
        "lon": 83.4
      },
      {
        "name": "Raipur",
        "lat": 21.25,
        "lon": 81.63
      },
      {
        "name": "Rajnandgaon",
        "lat": 21.1,
        "lon": 81.03
      },
      {
        "name": "Sakti",
        "lat": 22.03,
        "lon": 82.96
      },
      {
        "name": "Sarangarh-Bilaigarh",
        "lat": 21.58,
        "lon": 83.08
      },
      {
        "name": "Sukma",
        "lat": 18.4,
        "lon": 81.67
      },
      {
        "name": "Surajpur",
        "lat": 23.22,
        "lon": 82.86
      },
      {
        "name": "Surguja",
        "lat": 23.12,
        "lon": 83.2
      },
      {
        "name": "Uttar Bastar Kanker",
        "lat": 20.27,
        "lon": 81.49
      }
    ]
  },
  {
    "name": "Goa",
    "type": "State",
    "districts": [
      {
        "name": "North Goa",
        "lat": 15.54,
        "lon": 73.83
      },
      {
        "name": "South Goa",
        "lat": 15.27,
        "lon": 73.96
      }
    ]
  },
  {
    "name": "Gujarat",
    "type": "State",
    "districts": [
      {
        "name": "Ahmedabad",
        "lat": 23.02,
        "lon": 72.57
      },
      {
        "name": "Amreli",
        "lat": 21.6,
        "lon": 71.22
      },
      {
        "name": "Anand",
        "lat": 22.56,
        "lon": 72.93
      },
      {
        "name": "Aravalli",
        "lat": 23.5,
        "lon": 73.3
      },
      {
        "name": "Banaskantha",
        "lat": 24.17,
        "lon": 72.43
      },
      {
        "name": "Bharuch",
        "lat": 21.7,
        "lon": 72.97
      },
      {
        "name": "Bhavnagar",
        "lat": 21.76,
        "lon": 72.15
      },
      {
        "name": "Botad",
        "lat": 22.17,
        "lon": 71.67
      },
      {
        "name": "Chhota Udaipur",
        "lat": 22.31,
        "lon": 74.01
      },
      {
        "name": "Dahod",
        "lat": 22.83,
        "lon": 74.25
      },
      {
        "name": "Dang",
        "lat": 20.8,
        "lon": 73.7
      },
      {
        "name": "Devbhumi Dwarka",
        "lat": 22.24,
        "lon": 68.96
      },
      {
        "name": "Gandhinagar",
        "lat": 23.22,
        "lon": 72.65
      },
      {
        "name": "Gir Somnath",
        "lat": 20.9,
        "lon": 70.37
      },
      {
        "name": "Jamnagar",
        "lat": 22.47,
        "lon": 70.07
      },
      {
        "name": "Junagadh",
        "lat": 21.52,
        "lon": 70.45
      },
      {
        "name": "Kheda",
        "lat": 22.75,
        "lon": 72.68
      },
      {
        "name": "Kutch",
        "lat": 23.25,
        "lon": 69.67
      },
      {
        "name": "Mahisagar",
        "lat": 23.16,
        "lon": 73.55
      },
      {
        "name": "Mehsana",
        "lat": 23.6,
        "lon": 72.4
      },
      {
        "name": "Morbi",
        "lat": 22.82,
        "lon": 70.83
      },
      {
        "name": "Narmada",
        "lat": 21.87,
        "lon": 73.5
      },
      {
        "name": "Navsari",
        "lat": 20.95,
        "lon": 72.93
      },
      {
        "name": "Panchmahal",
        "lat": 22.77,
        "lon": 73.61
      },
      {
        "name": "Patan",
        "lat": 23.85,
        "lon": 72.12
      },
      {
        "name": "Porbandar",
        "lat": 21.64,
        "lon": 69.6
      },
      {
        "name": "Rajkot",
        "lat": 22.3,
        "lon": 70.8
      },
      {
        "name": "Sabarkantha",
        "lat": 23.6,
        "lon": 73.0
      },
      {
        "name": "Surat",
        "lat": 21.17,
        "lon": 72.83
      },
      {
        "name": "Surendranagar",
        "lat": 22.72,
        "lon": 71.63
      },
      {
        "name": "Tapi",
        "lat": 21.12,
        "lon": 73.4
      },
      {
        "name": "Vadodara",
        "lat": 22.3,
        "lon": 73.19
      },
      {
        "name": "Valsad",
        "lat": 20.61,
        "lon": 72.93
      }
    ]
  },
  {
    "name": "Haryana",
    "type": "State",
    "districts": [
      {
        "name": "Ambala",
        "lat": 30.38,
        "lon": 76.78
      },
      {
        "name": "Bhiwani",
        "lat": 28.78,
        "lon": 76.13
      },
      {
        "name": "Charkhi Dadri",
        "lat": 28.59,
        "lon": 76.27
      },
      {
        "name": "Faridabad",
        "lat": 28.41,
        "lon": 77.31
      },
      {
        "name": "Fatehabad",
        "lat": 29.52,
        "lon": 75.45
      },
      {
        "name": "Gurugram",
        "lat": 28.46,
        "lon": 77.03
      },
      {
        "name": "Hisar",
        "lat": 29.15,
        "lon": 75.72
      },
      {
        "name": "Jhajjar",
        "lat": 28.61,
        "lon": 76.65
      },
      {
        "name": "Jind",
        "lat": 29.32,
        "lon": 76.31
      },
      {
        "name": "Kaithal",
        "lat": 29.8,
        "lon": 76.4
      },
      {
        "name": "Karnal",
        "lat": 29.69,
        "lon": 76.98
      },
      {
        "name": "Kurukshetra",
        "lat": 29.97,
        "lon": 76.88
      },
      {
        "name": "Mahendragarh",
        "lat": 28.28,
        "lon": 76.15
      },
      {
        "name": "Nuh",
        "lat": 28.1,
        "lon": 77.01
      },
      {
        "name": "Palwal",
        "lat": 28.15,
        "lon": 77.33
      },
      {
        "name": "Panchkula",
        "lat": 30.69,
        "lon": 76.86
      },
      {
        "name": "Panipat",
        "lat": 29.39,
        "lon": 76.97
      },
      {
        "name": "Rewari",
        "lat": 28.18,
        "lon": 76.62
      },
      {
        "name": "Rohtak",
        "lat": 28.89,
        "lon": 76.57
      },
      {
        "name": "Sirsa",
        "lat": 29.53,
        "lon": 75.02
      },
      {
        "name": "Sonipat",
        "lat": 28.99,
        "lon": 77.02
      },
      {
        "name": "Yamunanagar",
        "lat": 30.13,
        "lon": 77.28
      }
    ]
  },
  {
    "name": "Himachal Pradesh",
    "type": "State",
    "districts": [
      {
        "name": "Bilaspur",
        "lat": 31.33,
        "lon": 76.76
      },
      {
        "name": "Chamba",
        "lat": 32.55,
        "lon": 76.12
      },
      {
        "name": "Hamirpur",
        "lat": 31.68,
        "lon": 76.52
      },
      {
        "name": "Kangra",
        "lat": 32.1,
        "lon": 76.27
      },
      {
        "name": "Kinnaur",
        "lat": 31.65,
        "lon": 78.48
      },
      {
        "name": "Kullu",
        "lat": 31.96,
        "lon": 77.11
      },
      {
        "name": "Lahaul and Spiti",
        "lat": 32.57,
        "lon": 77.62
      },
      {
        "name": "Mandi",
        "lat": 31.71,
        "lon": 76.93
      },
      {
        "name": "Shimla",
        "lat": 31.1,
        "lon": 77.17
      },
      {
        "name": "Sirmaur",
        "lat": 30.6,
        "lon": 77.3
      },
      {
        "name": "Solan",
        "lat": 30.91,
        "lon": 77.1
      },
      {
        "name": "Una",
        "lat": 31.47,
        "lon": 76.27
      }
    ]
  },
  {
    "name": "Jharkhand",
    "type": "State",
    "districts": [
      {
        "name": "Bokaro",
        "lat": 23.67,
        "lon": 86.15
      },
      {
        "name": "Chatra",
        "lat": 24.21,
        "lon": 84.87
      },
      {
        "name": "Deoghar",
        "lat": 24.48,
        "lon": 86.7
      },
      {
        "name": "Dhanbad",
        "lat": 23.8,
        "lon": 86.43
      },
      {
        "name": "Dumka",
        "lat": 24.27,
        "lon": 87.25
      },
      {
        "name": "East Singhbhum (Jamshedpur)",
        "lat": 22.8,
        "lon": 86.2
      },
      {
        "name": "Garhwa",
        "lat": 24.18,
        "lon": 83.81
      },
      {
        "name": "Giridih",
        "lat": 24.18,
        "lon": 86.3
      },
      {
        "name": "Godda",
        "lat": 24.83,
        "lon": 87.21
      },
      {
        "name": "Gumla",
        "lat": 23.04,
        "lon": 84.54
      },
      {
        "name": "Hazaribagh",
        "lat": 23.98,
        "lon": 85.35
      },
      {
        "name": "Jamtara",
        "lat": 23.96,
        "lon": 86.8
      },
      {
        "name": "Khunti",
        "lat": 23.07,
        "lon": 85.28
      },
      {
        "name": "Koderma",
        "lat": 24.47,
        "lon": 85.6
      },
      {
        "name": "Latehar",
        "lat": 23.75,
        "lon": 84.5
      },
      {
        "name": "Lohardaga",
        "lat": 23.43,
        "lon": 84.68
      },
      {
        "name": "Pakur",
        "lat": 24.63,
        "lon": 87.85
      },
      {
        "name": "Palamu",
        "lat": 24.05,
        "lon": 84.07
      },
      {
        "name": "Ramgarh",
        "lat": 23.63,
        "lon": 85.52
      },
      {
        "name": "Ranchi",
        "lat": 23.34,
        "lon": 85.31
      },
      {
        "name": "Sahibganj",
        "lat": 25.25,
        "lon": 87.65
      },
      {
        "name": "Saraikela Kharsawan",
        "lat": 22.7,
        "lon": 85.93
      },
      {
        "name": "Simdega",
        "lat": 22.62,
        "lon": 84.5
      },
      {
        "name": "West Singhbhum",
        "lat": 22.57,
        "lon": 85.82
      }
    ]
  },
  {
    "name": "Karnataka",
    "type": "State",
    "districts": [
      {
        "name": "Bagalkote",
        "lat": 16.18,
        "lon": 75.7
      },
      {
        "name": "Ballari",
        "lat": 15.14,
        "lon": 76.92
      },
      {
        "name": "Belagavi",
        "lat": 15.85,
        "lon": 74.5
      },
      {
        "name": "Bengaluru Rural",
        "lat": 13.22,
        "lon": 77.58
      },
      {
        "name": "Bengaluru Urban",
        "lat": 12.97,
        "lon": 77.59
      },
      {
        "name": "Bidar",
        "lat": 17.91,
        "lon": 77.52
      },
      {
        "name": "Chamarajanagara",
        "lat": 11.92,
        "lon": 76.94
      },
      {
        "name": "Chikkaballapura",
        "lat": 13.43,
        "lon": 77.73
      },
      {
        "name": "Chikkamagaluru",
        "lat": 13.32,
        "lon": 75.77
      },
      {
        "name": "Chitradurga",
        "lat": 14.23,
        "lon": 76.4
      },
      {
        "name": "Dakshina Kannada",
        "lat": 12.87,
        "lon": 74.88
      },
      {
        "name": "Davanagere",
        "lat": 14.47,
        "lon": 75.92
      },
      {
        "name": "Dharwad",
        "lat": 15.46,
        "lon": 75.01
      },
      {
        "name": "Gadag",
        "lat": 15.43,
        "lon": 75.63
      },
      {
        "name": "Hassan",
        "lat": 13.0,
        "lon": 76.1
      },
      {
        "name": "Haveri",
        "lat": 14.79,
        "lon": 75.4
      },
      {
        "name": "Kalaburagi",
        "lat": 17.33,
        "lon": 76.83
      },
      {
        "name": "Kodagu",
        "lat": 12.42,
        "lon": 75.73
      },
      {
        "name": "Kolar",
        "lat": 13.13,
        "lon": 78.13
      },
      {
        "name": "Koppal",
        "lat": 15.35,
        "lon": 76.15
      },
      {
        "name": "Mandya",
        "lat": 12.52,
        "lon": 76.9
      },
      {
        "name": "Mysuru",
        "lat": 12.3,
        "lon": 76.64
      },
      {
        "name": "Raichur",
        "lat": 16.2,
        "lon": 77.35
      },
      {
        "name": "Ramanagara",
        "lat": 12.72,
        "lon": 77.28
      },
      {
        "name": "Shivamogga",
        "lat": 13.93,
        "lon": 75.57
      },
      {
        "name": "Tumakuru",
        "lat": 13.34,
        "lon": 77.1
      },
      {
        "name": "Udupi",
        "lat": 13.34,
        "lon": 74.74
      },
      {
        "name": "Uttara Kannada",
        "lat": 14.8,
        "lon": 74.13
      },
      {
        "name": "Vijayanagara",
        "lat": 15.27,
        "lon": 76.38
      },
      {
        "name": "Vijayapura",
        "lat": 16.83,
        "lon": 75.71
      },
      {
        "name": "Yadgir",
        "lat": 16.77,
        "lon": 77.13
      }
    ]
  },
  {
    "name": "Kerala",
    "type": "State",
    "districts": [
      {
        "name": "Alappuzha",
        "lat": 9.49,
        "lon": 76.33
      },
      {
        "name": "Ernakulam",
        "lat": 9.98,
        "lon": 76.3
      },
      {
        "name": "Idukki",
        "lat": 9.85,
        "lon": 76.97
      },
      {
        "name": "Kannur",
        "lat": 11.87,
        "lon": 75.37
      },
      {
        "name": "Kasaragod",
        "lat": 12.5,
        "lon": 74.99
      },
      {
        "name": "Kollam",
        "lat": 8.89,
        "lon": 76.6
      },
      {
        "name": "Kottayam",
        "lat": 9.59,
        "lon": 76.52
      },
      {
        "name": "Kozhikode",
        "lat": 11.25,
        "lon": 75.78
      },
      {
        "name": "Malappuram",
        "lat": 11.07,
        "lon": 76.07
      },
      {
        "name": "Palakkad",
        "lat": 10.78,
        "lon": 76.65
      },
      {
        "name": "Pathanamthitta",
        "lat": 9.26,
        "lon": 76.78
      },
      {
        "name": "Thiruvananthapuram",
        "lat": 8.52,
        "lon": 76.94
      },
      {
        "name": "Thrissur",
        "lat": 10.52,
        "lon": 76.21
      },
      {
        "name": "Wayanad",
        "lat": 11.69,
        "lon": 76.13
      }
    ]
  },
  {
    "name": "Madhya Pradesh",
    "type": "State",
    "districts": [
      {
        "name": "Agar Malwa",
        "lat": 23.71,
        "lon": 76.01
      },
      {
        "name": "Alirajpur",
        "lat": 22.3,
        "lon": 74.35
      },
      {
        "name": "Anuppur",
        "lat": 23.1,
        "lon": 81.68
      },
      {
        "name": "Ashoknagar",
        "lat": 24.57,
        "lon": 77.73
      },
      {
        "name": "Balaghat",
        "lat": 21.8,
        "lon": 80.18
      },
      {
        "name": "Barwani",
        "lat": 22.03,
        "lon": 74.9
      },
      {
        "name": "Betul",
        "lat": 21.9,
        "lon": 77.9
      },
      {
        "name": "Bhind",
        "lat": 26.56,
        "lon": 78.78
      },
      {
        "name": "Bhopal",
        "lat": 23.25,
        "lon": 77.41
      },
      {
        "name": "Burhanpur",
        "lat": 21.31,
        "lon": 76.23
      },
      {
        "name": "Chhatarpur",
        "lat": 24.91,
        "lon": 79.58
      },
      {
        "name": "Chhindwara",
        "lat": 22.06,
        "lon": 78.93
      },
      {
        "name": "Damoh",
        "lat": 23.83,
        "lon": 79.44
      },
      {
        "name": "Datia",
        "lat": 25.67,
        "lon": 78.46
      },
      {
        "name": "Dewas",
        "lat": 22.96,
        "lon": 76.05
      },
      {
        "name": "Dhar",
        "lat": 22.6,
        "lon": 75.3
      },
      {
        "name": "Dindori",
        "lat": 22.95,
        "lon": 81.08
      },
      {
        "name": "Guna",
        "lat": 24.65,
        "lon": 77.32
      },
      {
        "name": "Gwalior",
        "lat": 26.22,
        "lon": 78.18
      },
      {
        "name": "Harda",
        "lat": 22.34,
        "lon": 77.09
      },
      {
        "name": "Narmadapuram (Hoshangabad)",
        "lat": 22.75,
        "lon": 77.72
      },
      {
        "name": "Indore",
        "lat": 22.72,
        "lon": 75.86
      },
      {
        "name": "Jabalpur",
        "lat": 23.18,
        "lon": 79.98
      },
      {
        "name": "Jhabua",
        "lat": 22.77,
        "lon": 74.6
      },
      {
        "name": "Katni",
        "lat": 23.83,
        "lon": 80.4
      },
      {
        "name": "Khandwa",
        "lat": 21.83,
        "lon": 76.35
      },
      {
        "name": "Khargone",
        "lat": 21.82,
        "lon": 75.6
      },
      {
        "name": "Maihar",
        "lat": 24.27,
        "lon": 80.75
      },
      {
        "name": "Mandla",
        "lat": 22.6,
        "lon": 80.38
      },
      {
        "name": "Mandsaur",
        "lat": 24.07,
        "lon": 75.07
      },
      {
        "name": "Mauganj",
        "lat": 24.68,
        "lon": 81.86
      },
      {
        "name": "Morena",
        "lat": 26.5,
        "lon": 78.0
      },
      {
        "name": "Narsinghpur",
        "lat": 22.95,
        "lon": 79.2
      },
      {
        "name": "Neemuch",
        "lat": 24.47,
        "lon": 74.87
      },
      {
        "name": "Niwari",
        "lat": 25.36,
        "lon": 78.8
      },
      {
        "name": "Panna",
        "lat": 24.72,
        "lon": 80.2
      },
      {
        "name": "Pandhurna",
        "lat": 21.6,
        "lon": 78.52
      },
      {
        "name": "Raisen",
        "lat": 23.33,
        "lon": 77.8
      },
      {
        "name": "Rajgarh",
        "lat": 24.01,
        "lon": 76.73
      },
      {
        "name": "Ratlam",
        "lat": 23.33,
        "lon": 75.03
      },
      {
        "name": "Rewa",
        "lat": 24.53,
        "lon": 81.3
      },
      {
        "name": "Sagar",
        "lat": 23.83,
        "lon": 78.73
      },
      {
        "name": "Satna",
        "lat": 24.58,
        "lon": 80.83
      },
      {
        "name": "Sehore",
        "lat": 23.2,
        "lon": 77.08
      },
      {
        "name": "Seoni",
        "lat": 22.08,
        "lon": 79.55
      },
      {
        "name": "Shahdol",
        "lat": 23.28,
        "lon": 81.35
      },
      {
        "name": "Shajapur",
        "lat": 23.43,
        "lon": 76.27
      },
      {
        "name": "Sheopur",
        "lat": 25.67,
        "lon": 76.7
      },
      {
        "name": "Shivpuri",
        "lat": 25.43,
        "lon": 77.65
      },
      {
        "name": "Sidhi",
        "lat": 24.42,
        "lon": 81.88
      },
      {
        "name": "Singrauli",
        "lat": 24.2,
        "lon": 82.67
      },
      {
        "name": "Tikamgarh",
        "lat": 24.75,
        "lon": 78.83
      },
      {
        "name": "Ujjain",
        "lat": 23.18,
        "lon": 75.77
      },
      {
        "name": "Umaria",
        "lat": 23.52,
        "lon": 80.83
      },
      {
        "name": "Vidisha",
        "lat": 23.53,
        "lon": 77.82
      }
    ]
  },
  {
    "name": "Maharashtra",
    "type": "State",
    "districts": [
      {
        "name": "Ahmednagar (Ahilyanagar)",
        "lat": 19.09,
        "lon": 74.74
      },
      {
        "name": "Akola",
        "lat": 20.7,
        "lon": 77.0
      },
      {
        "name": "Amravati",
        "lat": 20.93,
        "lon": 77.75
      },
      {
        "name": "Beed",
        "lat": 18.99,
        "lon": 75.76
      },
      {
        "name": "Bhandara",
        "lat": 21.17,
        "lon": 79.65
      },
      {
        "name": "Buldhana",
        "lat": 20.53,
        "lon": 76.18
      },
      {
        "name": "Chandrapur",
        "lat": 19.95,
        "lon": 79.3
      },
      {
        "name": "Chhatrapati Sambhajinagar (Aurangabad)",
        "lat": 19.88,
        "lon": 75.34
      },
      {
        "name": "Dhule",
        "lat": 20.9,
        "lon": 74.78
      },
      {
        "name": "Gadchiroli",
        "lat": 20.18,
        "lon": 79.98
      },
      {
        "name": "Gondia",
        "lat": 21.46,
        "lon": 80.2
      },
      {
        "name": "Hingoli",
        "lat": 19.72,
        "lon": 77.15
      },
      {
        "name": "Jalgaon",
        "lat": 21.0,
        "lon": 75.56
      },
      {
        "name": "Jalna",
        "lat": 19.84,
        "lon": 75.88
      },
      {
        "name": "Kolhapur",
        "lat": 16.7,
        "lon": 74.24
      },
      {
        "name": "Latur",
        "lat": 18.4,
        "lon": 76.58
      },
      {
        "name": "Mumbai City",
        "lat": 18.96,
        "lon": 72.82
      },
      {
        "name": "Mumbai Suburban",
        "lat": 19.12,
        "lon": 72.85
      },
      {
        "name": "Nagpur",
        "lat": 21.14,
        "lon": 79.08
      },
      {
        "name": "Nanded",
        "lat": 19.15,
        "lon": 77.3
      },
      {
        "name": "Nandurbar",
        "lat": 21.37,
        "lon": 74.23
      },
      {
        "name": "Nashik",
        "lat": 20.0,
        "lon": 73.78
      },
      {
        "name": "Dharashiv (Osmanabad)",
        "lat": 18.18,
        "lon": 76.04
      },
      {
        "name": "Palghar",
        "lat": 19.7,
        "lon": 72.77
      },
      {
        "name": "Parbhani",
        "lat": 19.27,
        "lon": 76.78
      },
      {
        "name": "Pune",
        "lat": 18.52,
        "lon": 73.85
      },
      {
        "name": "Raigad",
        "lat": 18.65,
        "lon": 72.88
      },
      {
        "name": "Ratnagiri",
        "lat": 16.99,
        "lon": 73.3
      },
      {
        "name": "Sangli",
        "lat": 16.85,
        "lon": 74.58
      },
      {
        "name": "Satara",
        "lat": 17.68,
        "lon": 74.0
      },
      {
        "name": "Sindhudurg",
        "lat": 16.12,
        "lon": 73.7
      },
      {
        "name": "Solapur",
        "lat": 17.65,
        "lon": 75.9
      },
      {
        "name": "Thane",
        "lat": 19.2,
        "lon": 72.97
      },
      {
        "name": "Wardha",
        "lat": 20.74,
        "lon": 78.6
      },
      {
        "name": "Washim",
        "lat": 20.1,
        "lon": 77.13
      },
      {
        "name": "Yavatmal",
        "lat": 20.39,
        "lon": 78.13
      }
    ]
  },
  {
    "name": "Manipur",
    "type": "State",
    "districts": [
      {
        "name": "Bishnupur",
        "lat": 24.63,
        "lon": 93.76
      },
      {
        "name": "Chandel",
        "lat": 24.32,
        "lon": 94.0
      },
      {
        "name": "Churachandpur",
        "lat": 24.33,
        "lon": 93.68
      },
      {
        "name": "Imphal East",
        "lat": 24.8,
        "lon": 93.95
      },
      {
        "name": "Imphal West",
        "lat": 24.81,
        "lon": 93.93
      },
      {
        "name": "Jiribam",
        "lat": 24.8,
        "lon": 93.12
      },
      {
        "name": "Kakching",
        "lat": 24.48,
        "lon": 93.98
      },
      {
        "name": "Kamjong",
        "lat": 24.82,
        "lon": 94.48
      },
      {
        "name": "Kangpokpi",
        "lat": 25.15,
        "lon": 93.97
      },
      {
        "name": "Noney",
        "lat": 24.85,
        "lon": 93.6
      },
      {
        "name": "Pherzawl",
        "lat": 24.2,
        "lon": 93.2
      },
      {
        "name": "Senapati",
        "lat": 25.27,
        "lon": 94.02
      },
      {
        "name": "Tamenglong",
        "lat": 24.98,
        "lon": 93.5
      },
      {
        "name": "Tengnoupal",
        "lat": 24.3,
        "lon": 94.15
      },
      {
        "name": "Thoubal",
        "lat": 24.63,
        "lon": 94.02
      },
      {
        "name": "Ukhrul",
        "lat": 25.12,
        "lon": 94.36
      }
    ]
  },
  {
    "name": "Meghalaya",
    "type": "State",
    "districts": [
      {
        "name": "Eastern West Khasi Hills",
        "lat": 25.52,
        "lon": 91.6
      },
      {
        "name": "East Garo Hills",
        "lat": 25.63,
        "lon": 90.67
      },
      {
        "name": "East Jaintia Hills",
        "lat": 25.32,
        "lon": 92.4
      },
      {
        "name": "East Khasi Hills",
        "lat": 25.57,
        "lon": 91.88
      },
      {
        "name": "North Garo Hills",
        "lat": 25.9,
        "lon": 90.58
      },
      {
        "name": "Ri-Bhoi",
        "lat": 25.9,
        "lon": 91.88
      },
      {
        "name": "South Garo Hills",
        "lat": 25.25,
        "lon": 90.63
      },
      {
        "name": "South West Garo Hills",
        "lat": 25.47,
        "lon": 89.92
      },
      {
        "name": "South West Khasi Hills",
        "lat": 25.3,
        "lon": 91.25
      },
      {
        "name": "West Garo Hills",
        "lat": 25.51,
        "lon": 90.22
      },
      {
        "name": "West Jaintia Hills",
        "lat": 25.45,
        "lon": 92.2
      },
      {
        "name": "West Khasi Hills",
        "lat": 25.53,
        "lon": 91.26
      }
    ]
  },
  {
    "name": "Mizoram",
    "type": "State",
    "districts": [
      {
        "name": "Aizawl",
        "lat": 23.73,
        "lon": 92.71
      },
      {
        "name": "Champhai",
        "lat": 23.47,
        "lon": 93.32
      },
      {
        "name": "Hnahthial",
        "lat": 22.96,
        "lon": 92.93
      },
      {
        "name": "Khawzawl",
        "lat": 23.53,
        "lon": 93.18
      },
      {
        "name": "Kolasib",
        "lat": 24.22,
        "lon": 92.68
      },
      {
        "name": "Lawngtlai",
        "lat": 22.53,
        "lon": 92.89
      },
      {
        "name": "Lunglei",
        "lat": 22.88,
        "lon": 92.73
      },
      {
        "name": "Mamit",
        "lat": 23.93,
        "lon": 92.48
      },
      {
        "name": "Saitual",
        "lat": 23.97,
        "lon": 92.97
      },
      {
        "name": "Serchhip",
        "lat": 23.3,
        "lon": 92.85
      },
      {
        "name": "Siaha",
        "lat": 22.48,
        "lon": 92.97
      }
    ]
  },
  {
    "name": "Nagaland",
    "type": "State",
    "districts": [
      {
        "name": "Ch\u00fcmoukedima",
        "lat": 25.8,
        "lon": 93.77
      },
      {
        "name": "Dimapur",
        "lat": 25.91,
        "lon": 93.73
      },
      {
        "name": "Kiphire",
        "lat": 25.9,
        "lon": 94.78
      },
      {
        "name": "Kohima",
        "lat": 25.67,
        "lon": 94.11
      },
      {
        "name": "Longleng",
        "lat": 26.5,
        "lon": 94.8
      },
      {
        "name": "Mokokchung",
        "lat": 26.32,
        "lon": 94.52
      },
      {
        "name": "Mon",
        "lat": 26.75,
        "lon": 95.06
      },
      {
        "name": "Niuland",
        "lat": 25.98,
        "lon": 93.88
      },
      {
        "name": "Noklak",
        "lat": 26.2,
        "lon": 95.0
      },
      {
        "name": "Peren",
        "lat": 25.52,
        "lon": 93.73
      },
      {
        "name": "Phek",
        "lat": 25.68,
        "lon": 94.47
      },
      {
        "name": "Shamator",
        "lat": 26.08,
        "lon": 94.88
      },
      {
        "name": "Tseminy\u00fc",
        "lat": 25.9,
        "lon": 94.21
      },
      {
        "name": "Tuensang",
        "lat": 26.28,
        "lon": 94.83
      },
      {
        "name": "Wokha",
        "lat": 26.1,
        "lon": 94.27
      },
      {
        "name": "Z\u00fcnheboto",
        "lat": 26.0,
        "lon": 94.52
      }
    ]
  },
  {
    "name": "Odisha",
    "type": "State",
    "districts": [
      {
        "name": "Angul",
        "lat": 20.84,
        "lon": 85.1
      },
      {
        "name": "Balangir",
        "lat": 20.71,
        "lon": 83.48
      },
      {
        "name": "Balasore (Baleswar)",
        "lat": 21.49,
        "lon": 86.93
      },
      {
        "name": "Bargarh",
        "lat": 21.33,
        "lon": 83.62
      },
      {
        "name": "Bhadrak",
        "lat": 21.06,
        "lon": 86.5
      },
      {
        "name": "Boudh",
        "lat": 20.84,
        "lon": 84.32
      },
      {
        "name": "Cuttack",
        "lat": 20.46,
        "lon": 85.88
      },
      {
        "name": "Deogarh",
        "lat": 21.53,
        "lon": 84.73
      },
      {
        "name": "Dhenkanal",
        "lat": 20.67,
        "lon": 85.6
      },
      {
        "name": "Gajapati",
        "lat": 18.8,
        "lon": 84.1
      },
      {
        "name": "Ganjam",
        "lat": 19.38,
        "lon": 85.05
      },
      {
        "name": "Jagatsinghpur",
        "lat": 20.27,
        "lon": 86.17
      },
      {
        "name": "Jajpur",
        "lat": 20.85,
        "lon": 86.33
      },
      {
        "name": "Jharsuguda",
        "lat": 21.85,
        "lon": 84.0
      },
      {
        "name": "Kalahandi",
        "lat": 19.9,
        "lon": 83.16
      },
      {
        "name": "Kandhamal",
        "lat": 20.24,
        "lon": 84.14
      },
      {
        "name": "Kendrapara",
        "lat": 20.5,
        "lon": 86.42
      },
      {
        "name": "Kendujhar (Keonjhar)",
        "lat": 21.63,
        "lon": 85.58
      },
      {
        "name": "Khordha",
        "lat": 20.18,
        "lon": 85.62
      },
      {
        "name": "Koraput",
        "lat": 18.81,
        "lon": 82.71
      },
      {
        "name": "Malkangiri",
        "lat": 18.35,
        "lon": 81.88
      },
      {
        "name": "Mayurbhanj",
        "lat": 21.93,
        "lon": 86.73
      },
      {
        "name": "Nabarangpur",
        "lat": 19.23,
        "lon": 82.55
      },
      {
        "name": "Nayagarh",
        "lat": 20.13,
        "lon": 85.1
      },
      {
        "name": "Nuapada",
        "lat": 20.83,
        "lon": 82.6
      },
      {
        "name": "Puri",
        "lat": 19.81,
        "lon": 85.83
      },
      {
        "name": "Rayagada",
        "lat": 19.17,
        "lon": 83.42
      },
      {
        "name": "Sambalpur",
        "lat": 21.47,
        "lon": 83.97
      },
      {
        "name": "Subarnapur (Sonepur)",
        "lat": 20.84,
        "lon": 83.92
      },
      {
        "name": "Sundargarh",
        "lat": 22.12,
        "lon": 84.03
      }
    ]
  },
  {
    "name": "Punjab",
    "type": "State",
    "districts": [
      {
        "name": "Amritsar",
        "lat": 31.63,
        "lon": 74.87
      },
      {
        "name": "Barnala",
        "lat": 30.38,
        "lon": 75.55
      },
      {
        "name": "Bathinda",
        "lat": 30.21,
        "lon": 74.95
      },
      {
        "name": "Faridkot",
        "lat": 30.67,
        "lon": 74.75
      },
      {
        "name": "Fatehgarh Sahib",
        "lat": 30.65,
        "lon": 76.4
      },
      {
        "name": "Fazilka",
        "lat": 30.4,
        "lon": 74.03
      },
      {
        "name": "Ferozepur",
        "lat": 30.92,
        "lon": 74.61
      },
      {
        "name": "Gurdaspur",
        "lat": 32.04,
        "lon": 75.4
      },
      {
        "name": "Hoshiarpur",
        "lat": 31.53,
        "lon": 75.92
      },
      {
        "name": "Jalandhar",
        "lat": 31.33,
        "lon": 75.58
      },
      {
        "name": "Kapurthala",
        "lat": 31.38,
        "lon": 75.38
      },
      {
        "name": "Ludhiana",
        "lat": 30.9,
        "lon": 75.85
      },
      {
        "name": "Malerkotla",
        "lat": 30.52,
        "lon": 75.88
      },
      {
        "name": "Mansa",
        "lat": 29.98,
        "lon": 75.38
      },
      {
        "name": "Moga",
        "lat": 30.82,
        "lon": 75.17
      },
      {
        "name": "Pathankot",
        "lat": 32.26,
        "lon": 75.65
      },
      {
        "name": "Patiala",
        "lat": 30.34,
        "lon": 76.38
      },
      {
        "name": "Rupnagar",
        "lat": 30.97,
        "lon": 76.53
      },
      {
        "name": "Sahibzada Ajit Singh Nagar (Mohali)",
        "lat": 30.7,
        "lon": 76.72
      },
      {
        "name": "Sangrur",
        "lat": 30.25,
        "lon": 75.84
      },
      {
        "name": "Shahid Bhagat Singh Nagar (Nawanshahr)",
        "lat": 31.12,
        "lon": 76.12
      },
      {
        "name": "Sri Muktsar Sahib",
        "lat": 30.48,
        "lon": 74.52
      },
      {
        "name": "Tarn Taran",
        "lat": 31.45,
        "lon": 74.93
      }
    ]
  },
  {
    "name": "Rajasthan",
    "type": "State",
    "districts": [
      {
        "name": "Ajmer",
        "lat": 26.45,
        "lon": 74.64
      },
      {
        "name": "Alwar",
        "lat": 27.57,
        "lon": 76.6
      },
      {
        "name": "Anupgarh",
        "lat": 29.19,
        "lon": 73.21
      },
      {
        "name": "Balotra",
        "lat": 25.83,
        "lon": 72.24
      },
      {
        "name": "Banswara",
        "lat": 23.55,
        "lon": 74.43
      },
      {
        "name": "Baran",
        "lat": 25.1,
        "lon": 76.52
      },
      {
        "name": "Barmer",
        "lat": 25.75,
        "lon": 71.4
      },
      {
        "name": "Beawar",
        "lat": 26.1,
        "lon": 74.32
      },
      {
        "name": "Bharatpur",
        "lat": 27.22,
        "lon": 77.49
      },
      {
        "name": "Bhilwara",
        "lat": 25.35,
        "lon": 74.63
      },
      {
        "name": "Bikaner",
        "lat": 28.02,
        "lon": 73.31
      },
      {
        "name": "Bundi",
        "lat": 25.44,
        "lon": 75.64
      },
      {
        "name": "Chittorgarh",
        "lat": 24.89,
        "lon": 74.63
      },
      {
        "name": "Churu",
        "lat": 28.3,
        "lon": 74.97
      },
      {
        "name": "Dausa",
        "lat": 26.89,
        "lon": 76.33
      },
      {
        "name": "Deeg",
        "lat": 27.47,
        "lon": 77.33
      },
      {
        "name": "Dholpur",
        "lat": 26.7,
        "lon": 77.9
      },
      {
        "name": "Didwana-Kuchaman",
        "lat": 27.4,
        "lon": 74.58
      },
      {
        "name": "Dudu",
        "lat": 26.68,
        "lon": 75.23
      },
      {
        "name": "Dungarpur",
        "lat": 23.84,
        "lon": 73.72
      },
      {
        "name": "Gangapur City",
        "lat": 26.47,
        "lon": 76.72
      },
      {
        "name": "Hanumangarh",
        "lat": 29.58,
        "lon": 74.32
      },
      {
        "name": "Jaipur",
        "lat": 26.91,
        "lon": 75.79
      },
      {
        "name": "Jaipur Rural",
        "lat": 26.95,
        "lon": 75.7
      },
      {
        "name": "Jaisalmer",
        "lat": 26.92,
        "lon": 70.9
      },
      {
        "name": "Jalore",
        "lat": 25.35,
        "lon": 72.62
      },
      {
        "name": "Jhalawar",
        "lat": 24.6,
        "lon": 76.15
      },
      {
        "name": "Jhunjhunu",
        "lat": 28.13,
        "lon": 75.4
      },
      {
        "name": "Jodhpur",
        "lat": 26.24,
        "lon": 73.02
      },
      {
        "name": "Jodhpur Rural",
        "lat": 26.2,
        "lon": 73.0
      },
      {
        "name": "Karauli",
        "lat": 26.5,
        "lon": 77.02
      },
      {
        "name": "Kekri",
        "lat": 25.97,
        "lon": 75.15
      },
      {
        "name": "Khairthal-Tijara",
        "lat": 27.8,
        "lon": 76.83
      },
      {
        "name": "Kota",
        "lat": 25.21,
        "lon": 75.86
      },
      {
        "name": "Kotputli-Behror",
        "lat": 27.7,
        "lon": 76.2
      },
      {
        "name": "Nagaur",
        "lat": 27.2,
        "lon": 73.74
      },
      {
        "name": "Neem Ka Thana",
        "lat": 27.74,
        "lon": 75.78
      },
      {
        "name": "Pali",
        "lat": 25.77,
        "lon": 73.33
      },
      {
        "name": "Phalodi",
        "lat": 27.13,
        "lon": 72.36
      },
      {
        "name": "Pratapgarh",
        "lat": 24.03,
        "lon": 74.78
      },
      {
        "name": "Rajsamand",
        "lat": 25.07,
        "lon": 73.88
      },
      {
        "name": "Salumbar",
        "lat": 24.13,
        "lon": 74.04
      },
      {
        "name": "Sanchore",
        "lat": 24.75,
        "lon": 71.77
      },
      {
        "name": "Sawai Madhopur",
        "lat": 26.0,
        "lon": 76.35
      },
      {
        "name": "Shahpura",
        "lat": 25.63,
        "lon": 74.93
      },
      {
        "name": "Sikar",
        "lat": 27.62,
        "lon": 75.15
      },
      {
        "name": "Sirohi",
        "lat": 24.88,
        "lon": 72.86
      },
      {
        "name": "Sri Ganganagar",
        "lat": 29.92,
        "lon": 73.88
      },
      {
        "name": "Tonk",
        "lat": 26.17,
        "lon": 75.79
      },
      {
        "name": "Udaipur",
        "lat": 24.58,
        "lon": 73.71
      }
    ]
  },
  {
    "name": "Sikkim",
    "type": "State",
    "districts": [
      {
        "name": "Gangtok",
        "lat": 27.33,
        "lon": 88.61
      },
      {
        "name": "Gyalshing",
        "lat": 27.28,
        "lon": 88.23
      },
      {
        "name": "Mangan",
        "lat": 27.5,
        "lon": 88.53
      },
      {
        "name": "Namchi",
        "lat": 27.17,
        "lon": 88.35
      },
      {
        "name": "Pakyong",
        "lat": 27.23,
        "lon": 88.59
      },
      {
        "name": "Soreng",
        "lat": 27.17,
        "lon": 88.2
      }
    ]
  },
  {
    "name": "Tamil Nadu",
    "type": "State",
    "districts": [
      {
        "name": "Ariyalur",
        "lat": 11.14,
        "lon": 79.08
      },
      {
        "name": "Chengalpattu",
        "lat": 12.68,
        "lon": 79.98
      },
      {
        "name": "Chennai",
        "lat": 13.08,
        "lon": 80.27,
        "hasWardData": true
      },
      {
        "name": "Coimbatore",
        "lat": 11.01,
        "lon": 76.95
      },
      {
        "name": "Cuddalore",
        "lat": 11.75,
        "lon": 79.75
      },
      {
        "name": "Dharmapuri",
        "lat": 12.13,
        "lon": 78.16
      },
      {
        "name": "Dindigul",
        "lat": 10.36,
        "lon": 77.98
      },
      {
        "name": "Erode",
        "lat": 11.34,
        "lon": 77.72
      },
      {
        "name": "Kallakurichi",
        "lat": 11.74,
        "lon": 78.96
      },
      {
        "name": "Kanchipuram",
        "lat": 12.83,
        "lon": 79.7
      },
      {
        "name": "Kanyakumari",
        "lat": 8.08,
        "lon": 77.54
      },
      {
        "name": "Karur",
        "lat": 10.96,
        "lon": 78.08,
        "hasWardData": true
      },
      {
        "name": "Krishnagiri",
        "lat": 12.52,
        "lon": 78.21
      },
      {
        "name": "Madurai",
        "lat": 9.92,
        "lon": 78.12
      },
      {
        "name": "Mayiladuthurai",
        "lat": 11.1,
        "lon": 79.65
      },
      {
        "name": "Nagapattinam",
        "lat": 10.77,
        "lon": 79.83
      },
      {
        "name": "Namakkal",
        "lat": 11.22,
        "lon": 78.17
      },
      {
        "name": "Nilgiris",
        "lat": 11.41,
        "lon": 76.7
      },
      {
        "name": "Perambalur",
        "lat": 11.23,
        "lon": 78.88
      },
      {
        "name": "Pudukkottai",
        "lat": 10.38,
        "lon": 78.82
      },
      {
        "name": "Ramanathapuram",
        "lat": 9.37,
        "lon": 78.83
      },
      {
        "name": "Ranipet",
        "lat": 12.93,
        "lon": 79.33
      },
      {
        "name": "Salem",
        "lat": 11.66,
        "lon": 78.15
      },
      {
        "name": "Sivaganga",
        "lat": 9.85,
        "lon": 78.48
      },
      {
        "name": "Tenkasi",
        "lat": 8.96,
        "lon": 77.31
      },
      {
        "name": "Thanjavur",
        "lat": 10.79,
        "lon": 79.13
      },
      {
        "name": "Theni",
        "lat": 10.01,
        "lon": 77.47
      },
      {
        "name": "Thoothukudi",
        "lat": 8.76,
        "lon": 78.13
      },
      {
        "name": "Tiruchirappalli",
        "lat": 10.79,
        "lon": 78.7
      },
      {
        "name": "Tirunelveli",
        "lat": 8.71,
        "lon": 77.76
      },
      {
        "name": "Tirupathur",
        "lat": 12.49,
        "lon": 78.57
      },
      {
        "name": "Tiruppur",
        "lat": 11.1,
        "lon": 77.34
      },
      {
        "name": "Tiruvallur",
        "lat": 13.14,
        "lon": 79.91
      },
      {
        "name": "Tiruvannamalai",
        "lat": 12.23,
        "lon": 79.07
      },
      {
        "name": "Tiruvarur",
        "lat": 10.77,
        "lon": 79.63
      },
      {
        "name": "Vellore",
        "lat": 12.92,
        "lon": 79.13
      },
      {
        "name": "Viluppuram",
        "lat": 11.94,
        "lon": 79.49
      },
      {
        "name": "Virudhunagar",
        "lat": 9.58,
        "lon": 77.96
      }
    ]
  },
  {
    "name": "Telangana",
    "type": "State",
    "districts": [
      {
        "name": "Adilabad",
        "lat": 19.66,
        "lon": 78.53
      },
      {
        "name": "Bhadradri Kothagudem",
        "lat": 17.55,
        "lon": 80.61
      },
      {
        "name": "Hanamkonda",
        "lat": 18.01,
        "lon": 79.56
      },
      {
        "name": "Hyderabad",
        "lat": 17.38,
        "lon": 78.48
      },
      {
        "name": "Jagtial",
        "lat": 18.79,
        "lon": 78.91
      },
      {
        "name": "Jangaon",
        "lat": 17.72,
        "lon": 79.16
      },
      {
        "name": "Jayashankar Bhupalpally",
        "lat": 18.43,
        "lon": 79.86
      },
      {
        "name": "Jogulamba Gadwal",
        "lat": 16.23,
        "lon": 77.8
      },
      {
        "name": "Kamareddy",
        "lat": 18.32,
        "lon": 78.34
      },
      {
        "name": "Karimnagar",
        "lat": 18.44,
        "lon": 79.13
      },
      {
        "name": "Khammam",
        "lat": 17.25,
        "lon": 80.15
      },
      {
        "name": "Kumuram Bheem Asifabad",
        "lat": 19.36,
        "lon": 79.28
      },
      {
        "name": "Mahabubabad",
        "lat": 17.6,
        "lon": 80.0
      },
      {
        "name": "Mahabubnagar",
        "lat": 16.74,
        "lon": 77.98
      },
      {
        "name": "Mancherial",
        "lat": 18.87,
        "lon": 79.46
      },
      {
        "name": "Medak",
        "lat": 18.04,
        "lon": 78.26
      },
      {
        "name": "Medchal-Malkajgiri",
        "lat": 17.63,
        "lon": 78.48
      },
      {
        "name": "Mulugu",
        "lat": 18.19,
        "lon": 79.94
      },
      {
        "name": "Nagarkurnool",
        "lat": 16.48,
        "lon": 78.32
      },
      {
        "name": "Nalgonda",
        "lat": 17.05,
        "lon": 79.27
      },
      {
        "name": "Narayanpet",
        "lat": 16.74,
        "lon": 77.5
      },
      {
        "name": "Nirmal",
        "lat": 19.09,
        "lon": 78.34
      },
      {
        "name": "Nizamabad",
        "lat": 18.67,
        "lon": 78.1
      },
      {
        "name": "Peddapalli",
        "lat": 18.61,
        "lon": 79.37
      },
      {
        "name": "Rajanna Sircilla",
        "lat": 18.39,
        "lon": 78.8
      },
      {
        "name": "Ranga Reddy",
        "lat": 17.3,
        "lon": 78.5
      },
      {
        "name": "Sangareddy",
        "lat": 17.62,
        "lon": 78.08
      },
      {
        "name": "Siddipet",
        "lat": 18.1,
        "lon": 78.85
      },
      {
        "name": "Suryapet",
        "lat": 17.14,
        "lon": 79.62
      },
      {
        "name": "Vikarabad",
        "lat": 17.33,
        "lon": 77.9
      },
      {
        "name": "Wanaparthy",
        "lat": 16.36,
        "lon": 78.06
      },
      {
        "name": "Warangal",
        "lat": 17.97,
        "lon": 79.6
      },
      {
        "name": "Yadadri Bhuvanagiri",
        "lat": 17.51,
        "lon": 78.89
      }
    ]
  },
  {
    "name": "Tripura",
    "type": "State",
    "districts": [
      {
        "name": "Dhalai",
        "lat": 23.85,
        "lon": 91.85
      },
      {
        "name": "Gomati",
        "lat": 23.53,
        "lon": 91.48
      },
      {
        "name": "Khowai",
        "lat": 24.06,
        "lon": 91.6
      },
      {
        "name": "North Tripura",
        "lat": 24.3,
        "lon": 92.1
      },
      {
        "name": "Sepahijala",
        "lat": 23.6,
        "lon": 91.3
      },
      {
        "name": "South Tripura",
        "lat": 23.23,
        "lon": 91.55
      },
      {
        "name": "Unakoti",
        "lat": 24.33,
        "lon": 92.02
      },
      {
        "name": "West Tripura",
        "lat": 23.83,
        "lon": 91.28
      }
    ]
  },
  {
    "name": "Uttar Pradesh",
    "type": "State",
    "districts": [
      {
        "name": "Agra",
        "lat": 27.18,
        "lon": 78.01
      },
      {
        "name": "Aligarh",
        "lat": 27.89,
        "lon": 78.08
      },
      {
        "name": "Ambedkar Nagar",
        "lat": 26.44,
        "lon": 82.6
      },
      {
        "name": "Amethi",
        "lat": 26.15,
        "lon": 81.81
      },
      {
        "name": "Amroha",
        "lat": 28.9,
        "lon": 78.47
      },
      {
        "name": "Auraiya",
        "lat": 26.46,
        "lon": 79.51
      },
      {
        "name": "Ayodhya",
        "lat": 26.79,
        "lon": 82.2
      },
      {
        "name": "Azamgarh",
        "lat": 26.07,
        "lon": 83.18
      },
      {
        "name": "Baghpat",
        "lat": 28.94,
        "lon": 77.22
      },
      {
        "name": "Bahraich",
        "lat": 27.57,
        "lon": 81.59
      },
      {
        "name": "Ballia",
        "lat": 25.76,
        "lon": 84.15
      },
      {
        "name": "Balrampur",
        "lat": 27.43,
        "lon": 82.18
      },
      {
        "name": "Banda",
        "lat": 25.48,
        "lon": 80.33
      },
      {
        "name": "Barabanki",
        "lat": 26.92,
        "lon": 81.18
      },
      {
        "name": "Bareilly",
        "lat": 28.36,
        "lon": 79.41
      },
      {
        "name": "Basti",
        "lat": 26.8,
        "lon": 82.76
      },
      {
        "name": "Bhadohi",
        "lat": 25.39,
        "lon": 82.57
      },
      {
        "name": "Bijnor",
        "lat": 29.37,
        "lon": 78.13
      },
      {
        "name": "Budaun",
        "lat": 28.04,
        "lon": 79.12
      },
      {
        "name": "Bulandshahr",
        "lat": 28.41,
        "lon": 77.85
      },
      {
        "name": "Chandauli",
        "lat": 25.26,
        "lon": 83.27
      },
      {
        "name": "Chitrakoot",
        "lat": 25.17,
        "lon": 80.86
      },
      {
        "name": "Deoria",
        "lat": 26.5,
        "lon": 83.78
      },
      {
        "name": "Etah",
        "lat": 27.63,
        "lon": 78.66
      },
      {
        "name": "Etawah",
        "lat": 26.77,
        "lon": 79.02
      },
      {
        "name": "Farrukhabad",
        "lat": 27.38,
        "lon": 79.58
      },
      {
        "name": "Fatehpur",
        "lat": 25.93,
        "lon": 80.8
      },
      {
        "name": "Firozabad",
        "lat": 27.15,
        "lon": 78.4
      },
      {
        "name": "Gautam Buddha Nagar (Noida)",
        "lat": 28.53,
        "lon": 77.39
      },
      {
        "name": "Ghaziabad",
        "lat": 28.67,
        "lon": 77.45
      },
      {
        "name": "Ghazipur",
        "lat": 25.58,
        "lon": 83.57
      },
      {
        "name": "Gonda",
        "lat": 27.13,
        "lon": 81.96
      },
      {
        "name": "Gorakhpur",
        "lat": 26.76,
        "lon": 83.37
      },
      {
        "name": "Hamirpur",
        "lat": 25.95,
        "lon": 80.15
      },
      {
        "name": "Hapur",
        "lat": 28.73,
        "lon": 77.78
      },
      {
        "name": "Hardoi",
        "lat": 27.4,
        "lon": 80.13
      },
      {
        "name": "Hathras",
        "lat": 27.6,
        "lon": 78.05
      },
      {
        "name": "Jalaun",
        "lat": 25.92,
        "lon": 79.35
      },
      {
        "name": "Jaunpur",
        "lat": 25.75,
        "lon": 82.68
      },
      {
        "name": "Jhansi",
        "lat": 25.45,
        "lon": 78.57
      },
      {
        "name": "Kannauj",
        "lat": 27.05,
        "lon": 79.92
      },
      {
        "name": "Kanpur Dehat",
        "lat": 26.37,
        "lon": 79.8
      },
      {
        "name": "Kanpur Nagar",
        "lat": 26.45,
        "lon": 80.33
      },
      {
        "name": "Kasganj",
        "lat": 27.8,
        "lon": 78.65
      },
      {
        "name": "Kaushambi",
        "lat": 25.53,
        "lon": 81.42
      },
      {
        "name": "Kheri (Lakhimpur)",
        "lat": 27.95,
        "lon": 80.78
      },
      {
        "name": "Kushinagar",
        "lat": 26.74,
        "lon": 83.89
      },
      {
        "name": "Lalitpur",
        "lat": 24.68,
        "lon": 78.41
      },
      {
        "name": "Lucknow",
        "lat": 26.85,
        "lon": 80.94
      },
      {
        "name": "Maharajganj",
        "lat": 27.14,
        "lon": 83.56
      },
      {
        "name": "Mahoba",
        "lat": 25.29,
        "lon": 79.87
      },
      {
        "name": "Mainpuri",
        "lat": 27.23,
        "lon": 79.02
      },
      {
        "name": "Mathura",
        "lat": 27.49,
        "lon": 77.67
      },
      {
        "name": "Mau",
        "lat": 25.95,
        "lon": 83.56
      },
      {
        "name": "Meerut",
        "lat": 28.98,
        "lon": 77.7
      },
      {
        "name": "Mirzapur",
        "lat": 25.14,
        "lon": 82.56
      },
      {
        "name": "Moradabad",
        "lat": 28.83,
        "lon": 78.78
      },
      {
        "name": "Muzaffarnagar",
        "lat": 29.47,
        "lon": 77.7
      },
      {
        "name": "Pilibhit",
        "lat": 28.63,
        "lon": 79.8
      },
      {
        "name": "Pratapgarh",
        "lat": 25.9,
        "lon": 81.99
      },
      {
        "name": "Prayagraj (Allahabad)",
        "lat": 25.43,
        "lon": 81.84
      },
      {
        "name": "Raebareli",
        "lat": 26.23,
        "lon": 81.23
      },
      {
        "name": "Rampur",
        "lat": 28.81,
        "lon": 79.02
      },
      {
        "name": "Saharanpur",
        "lat": 29.96,
        "lon": 77.55
      },
      {
        "name": "Sambhal",
        "lat": 28.58,
        "lon": 78.57
      },
      {
        "name": "Sant Kabir Nagar",
        "lat": 26.78,
        "lon": 83.02
      },
      {
        "name": "Shahjahanpur",
        "lat": 27.88,
        "lon": 79.91
      },
      {
        "name": "Shamli",
        "lat": 29.45,
        "lon": 77.31
      },
      {
        "name": "Shravasti",
        "lat": 27.7,
        "lon": 81.83
      },
      {
        "name": "Siddharthnagar",
        "lat": 27.3,
        "lon": 82.82
      },
      {
        "name": "Sitapur",
        "lat": 27.57,
        "lon": 80.68
      },
      {
        "name": "Sonbhadra",
        "lat": 24.68,
        "lon": 83.06
      },
      {
        "name": "Sultanpur",
        "lat": 26.26,
        "lon": 82.07
      },
      {
        "name": "Unnao",
        "lat": 26.54,
        "lon": 80.49
      },
      {
        "name": "Varanasi",
        "lat": 25.31,
        "lon": 82.97
      }
    ]
  },
  {
    "name": "Uttarakhand",
    "type": "State",
    "districts": [
      {
        "name": "Almora",
        "lat": 29.6,
        "lon": 79.66
      },
      {
        "name": "Bageshwar",
        "lat": 29.84,
        "lon": 79.77
      },
      {
        "name": "Chamoli",
        "lat": 30.4,
        "lon": 79.33
      },
      {
        "name": "Champawat",
        "lat": 29.33,
        "lon": 80.09
      },
      {
        "name": "Dehradun",
        "lat": 30.31,
        "lon": 78.03
      },
      {
        "name": "Haridwar",
        "lat": 29.94,
        "lon": 78.16
      },
      {
        "name": "Nainital",
        "lat": 29.38,
        "lon": 79.46
      },
      {
        "name": "Pauri Garhwal",
        "lat": 30.15,
        "lon": 78.78
      },
      {
        "name": "Pithoragarh",
        "lat": 29.58,
        "lon": 80.22
      },
      {
        "name": "Rudraprayag",
        "lat": 30.28,
        "lon": 78.98
      },
      {
        "name": "Tehri Garhwal",
        "lat": 30.38,
        "lon": 78.48
      },
      {
        "name": "Udham Singh Nagar",
        "lat": 28.98,
        "lon": 79.4
      },
      {
        "name": "Uttarkashi",
        "lat": 30.73,
        "lon": 78.45
      }
    ]
  },
  {
    "name": "West Bengal",
    "type": "State",
    "districts": [
      {
        "name": "Alipurduar",
        "lat": 26.49,
        "lon": 89.52
      },
      {
        "name": "Bankura",
        "lat": 23.23,
        "lon": 87.07
      },
      {
        "name": "Birbhum",
        "lat": 23.84,
        "lon": 87.61
      },
      {
        "name": "Cooch Behar",
        "lat": 26.32,
        "lon": 89.45
      },
      {
        "name": "Dakshin Dinajpur",
        "lat": 25.22,
        "lon": 88.77
      },
      {
        "name": "Darjeeling",
        "lat": 27.04,
        "lon": 88.26
      },
      {
        "name": "Hooghly",
        "lat": 22.9,
        "lon": 88.39
      },
      {
        "name": "Howrah",
        "lat": 22.59,
        "lon": 88.31
      },
      {
        "name": "Jalpaiguri",
        "lat": 26.52,
        "lon": 88.73
      },
      {
        "name": "Jhargram",
        "lat": 22.45,
        "lon": 86.98
      },
      {
        "name": "Kalimpong",
        "lat": 27.06,
        "lon": 88.47
      },
      {
        "name": "Kolkata",
        "lat": 22.57,
        "lon": 88.36
      },
      {
        "name": "Malda",
        "lat": 25.0,
        "lon": 88.14
      },
      {
        "name": "Murshidabad",
        "lat": 24.18,
        "lon": 88.27
      },
      {
        "name": "Nadia",
        "lat": 23.47,
        "lon": 88.55
      },
      {
        "name": "North 24 Parganas",
        "lat": 22.72,
        "lon": 88.48
      },
      {
        "name": "Paschim Bardhaman",
        "lat": 23.68,
        "lon": 86.98
      },
      {
        "name": "Paschim Medinipur",
        "lat": 22.42,
        "lon": 87.32
      },
      {
        "name": "Purba Bardhaman",
        "lat": 23.23,
        "lon": 87.86
      },
      {
        "name": "Purba Medinipur",
        "lat": 21.95,
        "lon": 87.78
      },
      {
        "name": "Purulia",
        "lat": 23.33,
        "lon": 86.36
      },
      {
        "name": "South 24 Parganas",
        "lat": 22.15,
        "lon": 88.4
      },
      {
        "name": "Uttar Dinajpur",
        "lat": 25.62,
        "lon": 88.12
      }
    ]
  },
  {
    "name": "Andaman and Nicobar Islands",
    "type": "Union Territory",
    "districts": [
      {
        "name": "Nicobar",
        "lat": 7.0,
        "lon": 93.8
      },
      {
        "name": "North and Middle Andaman",
        "lat": 12.5,
        "lon": 92.9
      },
      {
        "name": "South Andaman",
        "lat": 11.67,
        "lon": 92.74
      }
    ]
  },
  {
    "name": "Chandigarh",
    "type": "Union Territory",
    "districts": [
      {
        "name": "Chandigarh",
        "lat": 30.73,
        "lon": 76.78
      }
    ]
  },
  {
    "name": "Dadra and Nagar Haveli and Daman and Diu",
    "type": "Union Territory",
    "districts": [
      {
        "name": "Dadra and Nagar Haveli",
        "lat": 20.27,
        "lon": 73.02
      },
      {
        "name": "Daman",
        "lat": 20.42,
        "lon": 72.83
      },
      {
        "name": "Diu",
        "lat": 20.71,
        "lon": 70.98
      }
    ]
  },
  {
    "name": "Delhi (National Capital Territory)",
    "type": "Union Territory",
    "districts": [
      {
        "name": "Central Delhi",
        "lat": 28.64,
        "lon": 77.22,
        "hasWardData": true
      },
      {
        "name": "East Delhi",
        "lat": 28.63,
        "lon": 77.29,
        "hasWardData": true
      },
      {
        "name": "New Delhi",
        "lat": 28.61,
        "lon": 77.21,
        "hasWardData": true
      },
      {
        "name": "North Delhi",
        "lat": 28.71,
        "lon": 77.17,
        "hasWardData": true
      },
      {
        "name": "North East Delhi",
        "lat": 28.7,
        "lon": 77.26,
        "hasWardData": true
      },
      {
        "name": "North West Delhi",
        "lat": 28.74,
        "lon": 77.1,
        "hasWardData": true
      },
      {
        "name": "Shahdara",
        "lat": 28.67,
        "lon": 77.29,
        "hasWardData": true
      },
      {
        "name": "South Delhi",
        "lat": 28.52,
        "lon": 77.21,
        "hasWardData": true
      },
      {
        "name": "South East Delhi",
        "lat": 28.54,
        "lon": 77.26,
        "hasWardData": true
      },
      {
        "name": "South West Delhi",
        "lat": 28.58,
        "lon": 77.06,
        "hasWardData": true
      },
      {
        "name": "West Delhi",
        "lat": 28.65,
        "lon": 77.1,
        "hasWardData": true
      }
    ]
  },
  {
    "name": "Jammu and Kashmir",
    "type": "Union Territory",
    "districts": [
      {
        "name": "Anantnag",
        "lat": 33.73,
        "lon": 75.15
      },
      {
        "name": "Bandipora",
        "lat": 34.42,
        "lon": 74.65
      },
      {
        "name": "Baramulla",
        "lat": 34.2,
        "lon": 74.35
      },
      {
        "name": "Budgam",
        "lat": 34.02,
        "lon": 74.72
      },
      {
        "name": "Doda",
        "lat": 33.14,
        "lon": 75.54
      },
      {
        "name": "Ganderbal",
        "lat": 34.23,
        "lon": 74.78
      },
      {
        "name": "Jammu",
        "lat": 32.73,
        "lon": 74.87
      },
      {
        "name": "Kathua",
        "lat": 32.37,
        "lon": 75.52
      },
      {
        "name": "Kishtwar",
        "lat": 33.31,
        "lon": 75.77
      },
      {
        "name": "Kulgam",
        "lat": 33.64,
        "lon": 75.02
      },
      {
        "name": "Kupwara",
        "lat": 34.53,
        "lon": 74.25
      },
      {
        "name": "Poonch",
        "lat": 33.77,
        "lon": 74.1
      },
      {
        "name": "Pulwama",
        "lat": 33.87,
        "lon": 74.9
      },
      {
        "name": "Rajouri",
        "lat": 33.38,
        "lon": 74.3
      },
      {
        "name": "Ramban",
        "lat": 33.24,
        "lon": 75.24
      },
      {
        "name": "Reasi",
        "lat": 33.08,
        "lon": 74.83
      },
      {
        "name": "Samba",
        "lat": 32.56,
        "lon": 75.12
      },
      {
        "name": "Shopian",
        "lat": 33.72,
        "lon": 74.83
      },
      {
        "name": "Srinagar",
        "lat": 34.08,
        "lon": 74.8
      },
      {
        "name": "Udhampur",
        "lat": 32.93,
        "lon": 75.14
      }
    ]
  },
  {
    "name": "Ladakh",
    "type": "Union Territory",
    "districts": [
      {
        "name": "Kargil",
        "lat": 34.55,
        "lon": 76.13
      },
      {
        "name": "Leh",
        "lat": 34.15,
        "lon": 77.58
      }
    ]
  },
  {
    "name": "Lakshadweep",
    "type": "Union Territory",
    "districts": [
      {
        "name": "Lakshadweep",
        "lat": 10.57,
        "lon": 72.64
      }
    ]
  },
  {
    "name": "Puducherry",
    "type": "Union Territory",
    "districts": [
      {
        "name": "Karaikal",
        "lat": 10.92,
        "lon": 79.83
      },
      {
        "name": "Mahe",
        "lat": 11.7,
        "lon": 75.53
      },
      {
        "name": "Puducherry",
        "lat": 11.94,
        "lon": 79.81
      },
      {
        "name": "Yanam",
        "lat": 16.73,
        "lon": 82.21
      }
    ]
  }
];

export interface SearchResult {
  stateName: string;
  districtName: string;
  localityName?: string;
  state: string;
  district: string;
  type: string;
  lat: number;
  lon: number;
  hasWardData?: boolean;
  dataStatus?: 'LIVE' | 'DEMO' | 'LIMITED' | 'UNAVAILABLE';
}

export const NOTABLE_TOWNS: SearchResult[] = [];

export function searchLocations(query: string): SearchResult[] {
  if (!query || query.trim().length < 1) return [];
  const q = query.toLowerCase().trim();
  const results: SearchResult[] = [];

  for (const state of INDIA_LOCATIONS) {
    const stateMatch = state.name.toLowerCase().includes(q);
    for (const district of state.districts) {
      const distMatch = district.name.toLowerCase().includes(q);
      if (stateMatch || distMatch) {
        results.push({
          stateName: state.name,
          districtName: district.name,
          state: state.name,
          district: district.name,
          type: state.type || 'District',
          lat: district.lat,
          lon: district.lon,
          hasWardData: district.hasWardData,
          dataStatus: district.dataStatus || (district.hasWardData ? 'LIVE' : 'DEMO'),
        });
      }
      if (results.length >= 25) break;
    }
    if (results.length >= 25) break;
  }
  return results;
}

export function findLocation(stateName: string, districtName: string): SearchResult | null {
  const state = INDIA_LOCATIONS.find((s) => s.name.toLowerCase() === stateName.toLowerCase());
  if (!state) return null;
  const district = state.districts.find((d) => d.name.toLowerCase() === districtName.toLowerCase());
  if (!district) return null;

  return {
    stateName: state.name,
    districtName: district.name,
    state: state.name,
    district: district.name,
    type: state.type || 'State',
    lat: district.lat,
    lon: district.lon,
    hasWardData: district.hasWardData,
    dataStatus: district.dataStatus || (district.hasWardData ? 'LIVE' : 'DEMO'),
  };
}

export function findNearestDistrict(lat: number, lon: number): SearchResult {
  let closest: SearchResult | null = null;
  let minDistance = Infinity;

  for (const state of INDIA_LOCATIONS) {
    for (const district of state.districts) {
      const dLat = district.lat - lat;
      const dLon = (district.lon - lon) * Math.cos((lat * Math.PI) / 180);
      const distSq = dLat * dLat + dLon * dLon;
      if (distSq < minDistance) {
        minDistance = distSq;
        closest = {
          stateName: state.name,
          districtName: district.name,
          state: state.name,
          district: district.name,
          type: state.type || 'District',
          lat: district.lat,
          lon: district.lon,
          hasWardData: district.hasWardData,
          dataStatus: 'LIVE',
        };
      }
    }
  }

  return (
    closest || {
      stateName: 'Delhi',
      districtName: 'New Delhi',
      state: 'Delhi',
      district: 'New Delhi',
      type: 'District',
      lat: 28.6139,
      lon: 77.2090,
      hasWardData: true,
      dataStatus: 'LIVE',
    }
  );
}


