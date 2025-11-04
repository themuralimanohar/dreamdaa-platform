// Tamil Nadu Districts Data with School Coverage Information
export interface DistrictData {
  id: string
  name: string
  totalSchools: number
  coveredSchools: number
  availableForSponsorship: number
  fundingStatus: 'low' | 'medium' | 'high' | 'complete'
  coordinates?: [number, number] // lat, lng for popup positioning
}

export const tamilNaduDistricts: DistrictData[] = [
  {
    id: 'ariyalur',
    name: 'Ariyalur',
    totalSchools: 245,
    coveredSchools: 89,
    availableForSponsorship: 156,
    fundingStatus: 'low',
    coordinates: [11.1401, 79.0766]
  },
  {
    id: 'chengalpattu',
    name: 'Chengalpattu',
    totalSchools: 412,
    coveredSchools: 298,
    availableForSponsorship: 114,
    fundingStatus: 'high',
    coordinates: [12.6918, 79.9764]
  },
  {
    id: 'chennai',
    name: 'Chennai',
    totalSchools: 687,
    coveredSchools: 687,
    availableForSponsorship: 0,
    fundingStatus: 'complete',
    coordinates: [13.0827, 80.2707]
  },
  {
    id: 'coimbatore',
    name: 'Coimbatore',
    totalSchools: 823,
    coveredSchools: 456,
    availableForSponsorship: 367,
    fundingStatus: 'medium',
    coordinates: [11.0168, 76.9558]
  },
  {
    id: 'cuddalore',
    name: 'Cuddalore',
    totalSchools: 534,
    coveredSchools: 234,
    availableForSponsorship: 300,
    fundingStatus: 'low',
    coordinates: [11.7449, 79.7689]
  },
  {
    id: 'dharmapuri',
    name: 'Dharmapuri',
    totalSchools: 445,
    coveredSchools: 178,
    availableForSponsorship: 267,
    fundingStatus: 'low',
    coordinates: [12.1211, 78.1583]
  },
  {
    id: 'dindigul',
    name: 'Dindigul',
    totalSchools: 567,
    coveredSchools: 267,
    availableForSponsorship: 300,
    fundingStatus: 'medium',
    coordinates: [10.3673, 77.9803]
  },
  {
    id: 'erode',
    name: 'Erode',
    totalSchools: 634,
    coveredSchools: 398,
    availableForSponsorship: 236,
    fundingStatus: 'high',
    coordinates: [11.3410, 77.7172]
  },
  {
    id: 'kallakurichi',
    name: 'Kallakurichi',
    totalSchools: 312,
    coveredSchools: 89,
    availableForSponsorship: 223,
    fundingStatus: 'low',
    coordinates: [11.7401, 78.9618]
  },
  {
    id: 'kanchipuram',
    name: 'Kanchipuram',
    totalSchools: 456,
    coveredSchools: 334,
    availableForSponsorship: 122,
    fundingStatus: 'high',
    coordinates: [12.8185, 79.7037]
  },
  {
    id: 'kanniyakumari',
    name: 'Kanniyakumari',
    totalSchools: 289,
    coveredSchools: 201,
    availableForSponsorship: 88,
    fundingStatus: 'high',
    coordinates: [8.0883, 77.5385]
  },
  {
    id: 'karur',
    name: 'Karur',
    totalSchools: 298,
    coveredSchools: 134,
    availableForSponsorship: 164,
    fundingStatus: 'medium',
    coordinates: [10.9601, 78.0766]
  },
  {
    id: 'krishnagiri',
    name: 'Krishnagiri',
    totalSchools: 387,
    coveredSchools: 145,
    availableForSponsorship: 242,
    fundingStatus: 'low',
    coordinates: [12.5186, 78.2137]
  },
  {
    id: 'madurai',
    name: 'Madurai',
    totalSchools: 712,
    coveredSchools: 423,
    availableForSponsorship: 289,
    fundingStatus: 'medium',
    coordinates: [9.9252, 78.1198]
  },
  {
    id: 'mayiladuthurai',
    name: 'Mayiladuthurai',
    totalSchools: 234,
    coveredSchools: 167,
    availableForSponsorship: 67,
    fundingStatus: 'high',
    coordinates: [11.1024, 79.6506]
  },
  {
    id: 'nagapattinam',
    name: 'Nagapattinam',
    totalSchools: 345,
    coveredSchools: 198,
    availableForSponsorship: 147,
    fundingStatus: 'medium',
    coordinates: [10.7667, 79.8420]
  },
  {
    id: 'namakkal',
    name: 'Namakkal',
    totalSchools: 378,
    coveredSchools: 234,
    availableForSponsorship: 144,
    fundingStatus: 'high',
    coordinates: [11.2189, 78.1677]
  },
  {
    id: 'nilgiris',
    name: 'Nilgiris',
    totalSchools: 156,
    coveredSchools: 98,
    availableForSponsorship: 58,
    fundingStatus: 'high',
    coordinates: [11.4064, 76.6932]
  },
  {
    id: 'perambalur',
    name: 'Perambalur',
    totalSchools: 189,
    coveredSchools: 67,
    availableForSponsorship: 122,
    fundingStatus: 'low',
    coordinates: [11.2342, 78.8808]
  },
  {
    id: 'pudukkottai',
    name: 'Pudukkottai',
    totalSchools: 423,
    coveredSchools: 189,
    availableForSponsorship: 234,
    fundingStatus: 'medium',
    coordinates: [10.3833, 78.8200]
  },
  {
    id: 'ramanathapuram',
    name: 'Ramanathapuram',
    totalSchools: 367,
    coveredSchools: 123,
    availableForSponsorship: 244,
    fundingStatus: 'low',
    coordinates: [9.3639, 78.8437]
  },
  {
    id: 'ranipet',
    name: 'Ranipet',
    totalSchools: 298,
    coveredSchools: 187,
    availableForSponsorship: 111,
    fundingStatus: 'high',
    coordinates: [12.9249, 79.3308]
  },
  {
    id: 'salem',
    name: 'Salem',
    totalSchools: 645,
    coveredSchools: 298,
    availableForSponsorship: 347,
    fundingStatus: 'medium',
    coordinates: [11.6643, 78.1460]
  },
  {
    id: 'sivagangai',
    name: 'Sivagangai',
    totalSchools: 334,
    coveredSchools: 145,
    availableForSponsorship: 189,
    fundingStatus: 'low',
    coordinates: [9.8438, 78.4809]
  },
  {
    id: 'tenkasi',
    name: 'Tenkasi',
    totalSchools: 287,
    coveredSchools: 123,
    availableForSponsorship: 164,
    fundingStatus: 'medium',
    coordinates: [8.9597, 77.3152]
  },
  {
    id: 'thanjavur',
    name: 'Thanjavur',
    totalSchools: 489,
    coveredSchools: 267,
    availableForSponsorship: 222,
    fundingStatus: 'medium',
    coordinates: [10.7870, 79.1378]
  },
  {
    id: 'theni',
    name: 'Theni',
    totalSchools: 298,
    coveredSchools: 134,
    availableForSponsorship: 164,
    fundingStatus: 'medium',
    coordinates: [10.0104, 77.4977]
  },
  {
    id: 'thiruvallur',
    name: 'Thiruvallur',
    totalSchools: 523,
    coveredSchools: 398,
    availableForSponsorship: 125,
    fundingStatus: 'high',
    coordinates: [13.1068, 79.9092]
  },
  {
    id: 'thiruvarur',
    name: 'Thiruvarur',
    totalSchools: 267,
    coveredSchools: 156,
    availableForSponsorship: 111,
    fundingStatus: 'medium',
    coordinates: [10.7667, 79.6333]
  },
  {
    id: 'thoothukudi',
    name: 'Thoothukudi',
    totalSchools: 445,
    coveredSchools: 189,
    availableForSponsorship: 256,
    fundingStatus: 'low',
    coordinates: [8.7642, 78.1348]
  },
  {
    id: 'tiruchirappalli',
    name: 'Tiruchirappalli',
    totalSchools: 612,
    coveredSchools: 367,
    availableForSponsorship: 245,
    fundingStatus: 'medium',
    coordinates: [10.7905, 78.7047]
  },
  {
    id: 'tirunelveli',
    name: 'Tirunelveli',
    totalSchools: 567,
    coveredSchools: 234,
    availableForSponsorship: 333,
    fundingStatus: 'low',
    coordinates: [8.7139, 77.7567]
  },
  {
    id: 'tirupathur',
    name: 'Tirupathur',
    totalSchools: 234,
    coveredSchools: 98,
    availableForSponsorship: 136,
    fundingStatus: 'low',
    coordinates: [12.4958, 78.5731]
  },
  {
    id: 'tiruppur',
    name: 'Tiruppur',
    totalSchools: 456,
    coveredSchools: 298,
    availableForSponsorship: 158,
    fundingStatus: 'high',
    coordinates: [11.1085, 77.3411]
  },
  {
    id: 'tiruvannamalai',
    name: 'Tiruvannamalai',
    totalSchools: 423,
    coveredSchools: 178,
    availableForSponsorship: 245,
    fundingStatus: 'low',
    coordinates: [12.2253, 79.0747]
  },
  {
    id: 'vellore',
    name: 'Vellore',
    totalSchools: 534,
    coveredSchools: 289,
    availableForSponsorship: 245,
    fundingStatus: 'medium',
    coordinates: [12.9165, 79.1325]
  },
  {
    id: 'villupuram',
    name: 'Villupuram',
    totalSchools: 456,
    coveredSchools: 198,
    availableForSponsorship: 258,
    fundingStatus: 'low',
    coordinates: [11.9401, 79.4861]
  },
  {
    id: 'virudhunagar',
    name: 'Virudhunagar',
    totalSchools: 378,
    coveredSchools: 167,
    availableForSponsorship: 211,
    fundingStatus: 'medium',
    coordinates: [9.5812, 77.9624]
  }
]

// Helper functions for the map
export const getDistrictColor = (fundingStatus: DistrictData['fundingStatus']): string => {
  switch (fundingStatus) {
    case 'complete': return '#10b981' // Green - All schools covered
    case 'high': return '#3b82f6'     // Blue - High coverage
    case 'medium': return '#f59e0b'   // Orange - Medium coverage  
    case 'low': return '#ef4444'      // Red - Low coverage, needs funding
    default: return '#6b7280'         // Gray - Unknown
  }
}

export const getFundingStatusText = (fundingStatus: DistrictData['fundingStatus']): string => {
  switch (fundingStatus) {
    case 'complete': return 'Fully Funded'
    case 'high': return 'Well Funded'
    case 'medium': return 'Partially Funded'
    case 'low': return 'Needs Funding'
    default: return 'Unknown'
  }
}

export const getCoveragePercentage = (district: DistrictData): number => {
  return Math.round((district.coveredSchools / district.totalSchools) * 100)
}