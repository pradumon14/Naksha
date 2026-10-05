import { MapCategory, DownloadItem } from '../types';

/**
 * Array of predefined map categories representing the educational syllabus.
 * Includes geographic features, industrial centers, and historical locations.
 */
export const mapData: MapCategory[] = [
  {
    "title": "Software Technology Parks",
    "icon": "fa-laptop-code",
    "locations": [
      {
        "name": "Noida",
        "state": "Uttar Pradesh",
        "coords": { "x": 7478, "y": 8401 },
        "description": "A major IT hub in the National Capital Region, hosting numerous software companies and multinational corporations."
      },
      {
        "name": "Gandhinagar",
        "state": "Gujarat",
        "coords": { "x": 4575, "y": 12238 },
        "description": "The capital of Gujarat, featuring the GIFT City (Gujarat International Finance Tec-City) and emerging IT sectors."
      },
      {
        "name": "Mumbai",
        "state": "Maharashtra",
        "coords": { "x": 4966, "y": 14873 },
        "description": "India's financial capital, with a thriving tech scene and numerous headquarters for major IT companies."
      },
      {
        "name": "Pune",
        "state": "Maharashtra",
        "coords": { "x": 4874, "y": 15252 },
        "description": "Known as the 'Oxford of the East', Pune has a massive IT park in Hinjewadi and is a hub for tech startups."
      },
      {
        "name": "Hyderabad",
        "state": "Telangana",
        "coords": { "x": 7907, "y": 15989 },
        "description": "Often called 'Cyberabad', it hosts a significant technology township and major offices for global tech giants."
      },
      {
        "name": "Bengaluru",
        "state": "Karnataka",
        "coords": { "x": 7471, "y": 18878 },
        "description": "Recognized as the 'Silicon Valley of India', it's the nation's leading information technology exporter."
      },
      {
        "name": "Chennai",
        "state": "Tamil Nadu",
        "coords": { "x": 9112, "y": 18715 },
        "description": "A major IT and BPO hub in South India with a strong base in hardware and software manufacturing."
      },
      {
        "name": "Thiruvananthapuram",
        "state": "Kerala",
        "coords": { "x": 7182, "y": 21513 },
        "description": "Home to Technopark, one of the largest IT parks in India, contributing significantly to the state's economy."
      }
    ]
  },
  {
    "title": "Nuclear Power Plants",
    "icon": "fa-radiation",
    "locations": [
      {
        "name": "Narora",
        "state": "Uttar Pradesh",
        "coords": { "x": 8120, "y": 8257 },
        "description": "Located in Bulandshahr district, this plant supplies electricity to the Northern Power Grid of India."
      },
      {
        "name": "Kakrapar",
        "state": "Gujarat",
        "coords": { "x": 4855, "y": 13236 },
        "description": "Situated near Surat, this plant consists of multiple pressurized heavy-water reactors (PHWRs)."
      },
      {
        "name": "Tarapur",
        "state": "Maharashtra",
        "coords": { "x": 4734, "y": 14442 },
        "description": "India's first commercial nuclear power station, commissioned in 1969, marking the beginning of the country's nuclear power program."
      },
      {
        "name": "Kalpakkam",
        "state": "Tamil Nadu",
        "coords": { "x": 9141, "y": 18682 },
        "description": "This comprehensive nuclear power production, fuel reprocessing, and waste treatment facility includes the Madras Atomic Power Station (MAPS)."
      }
    ]
  },
  {
    "title": "Iron and Steel Plants",
    "icon": "fa-industry",
    "locations": [
      {
        "name": "Durgapur",
        "state": "West Bengal",
        "coords": { "x": 13955, "y": 12460 },
        "description": "Known as the 'Ruhr of India', this city is a major industrial hub famous for its steel plant established in the 1950s with British collaboration."
      },
      {
        "name": "Bokaro",
        "state": "Jharkhand",
        "coords": { "x": 12787, "y": 11826 },
        "description": "Planned and built with Soviet help, Bokaro Steel Plant is the fourth integrated public sector steel plant in India."
      },
      {
        "name": "Jamshedpur",
        "state": "Jharkhand",
        "coords": { "x": 12972, "y": 12737 },
        "description": "Home to the Tata Steel plant, the first private iron and steel company in India, founded by Jamsetji Tata in 1907."
      },
      {
        "name": "Bhilai",
        "state": "Chhattisgarh",
        "coords": { "x": 9687, "y": 13624 },
        "description": "A major steel plant in Central India, known for being the sole producer of the country's longest rail tracks."
      },
      {
        "name": "Vijaynagar",
        "state": "Karnataka",
        "coords": { "x": 7053, "y": 16784 },
        "description": "Also known as Jindal Vijayanagar Steel Ltd (JVSL), it is the first and largest integrated steel plant in the private sector in India."
      },
      {
        "name": "Salem",
        "state": "Tamil Nadu",
        "coords": { "x": 8214, "y": 19691 },
        "description": "A special steels plant operated by SAIL, producing high-quality stainless steel and other special grades of steel."
      }
    ]
  },
  {
    "title": "Thermal Power Plants",
    "icon": "fa-fire",
    "locations": [
      {
        "name": "Namrup",
        "state": "Assam",
        "coords": { "x": 18448, "y": 9373 },
        "description": "A gas-based thermal power station that utilizes the natural gas from the nearby oil fields of Assam."
      },
      {
        "name": "Singrauli",
        "state": "Madhya Pradesh",
        "coords": { "x": 10319, "y": 11596 },
        "description": "The Singrauli region is a major hub for coal-based thermal power generation, often called the 'energy capital of India'."
      },
      {
        "name": "Ramagundam",
        "state": "Telangana",
        "coords": { "x": 8845, "y": 15307 },
        "description": "One of the largest thermal power stations in South India, operated by NTPC. It's a super thermal power station with a massive generation capacity."
      }
    ]
  },
  {
    "title": "Cotton Textile Industries",
    "icon": "fa-tshirt",
    "locations": [
      {
        "name": "Kanpur",
        "state": "Uttar Pradesh",
        "coords": { "x": 8904, "y": 10005 },
        "description": "Historically known as the 'Manchester of the East' for its booming textile mills in the 19th and 20th centuries."
      },
      {
        "name": "Surat",
        "state": "Gujarat",
        "coords": { "x": 4852, "y": 13076 },
        "description": "A global center for textiles, particularly known for its synthetic fabric production and diamond cutting industries."
      },
      {
        "name": "Mumbai",
        "state": "Maharashtra",
        "coords": { "x": 4880, "y": 14841 },
        "description": "The historical heart of India's cotton textile industry, with the first mill established here in the 1850s."
      },
      {
        "name": "Indore",
        "state": "Madhya Pradesh",
        "coords": { "x": 6207, "y": 12932 },
        "description": "A major center for cotton textiles in Central India, benefiting from the rich cotton-growing regions nearby."
      },
      {
        "name": "Coimbatore",
        "state": "Tamil Nadu",
        "coords": { "x": 7175, "y": 20075 },
        "description": "Often called the 'Manchester of South India' due to its extensive textile industry, fed by the surrounding cotton fields."
      }
    ]
  },
  {
    "title": "Iron Ore Mines",
    "icon": "fa-hammer",
    "locations": [
      {
        "name": "Mayurbhanj",
        "state": "Odisha",
        "coords": { "x": 13048, "y": 13139 },
        "description": "This district contains some of India's richest iron ore deposits, particularly in the Badampahar mines."
      },
      {
        "name": "Durg",
        "state": "Chhattisgarh",
        "coords": { "x": 10126, "y": 13207 },
        "description": "The Dalli-Rajhara mines in this district are a major captive source of iron ore for the Bhilai Steel Plant."
      },
      {
        "name": "Bailadila",
        "state": "Chhattisgarh",
        "coords": { "x": 9850, "y": 15257 },
        "description": "The Bailadila Range is famous for its super high-grade hematite iron ore, which is exported to countries like Japan."
      },
      {
        "name": "Bellary",
        "state": "Karnataka",
        "coords": { "x": 7024, "y": 17451 },
        "description": "The Bellary-Hospet region is a massive iron ore belt, though it has faced scrutiny for environmental and mining regulations."
      },
      {
        "name": "Kudremukh",
        "state": "Karnataka",
        "coords": { "x": 6138, "y": 18859 },
        "description": "Meaning 'horse-face' in Kannada, this mountain range was a major site for iron ore mining, though operations have been scaled back for conservation."
      }
    ]
  },
  {
    "title": "Coal Mines",
    "icon": "fa-cubes",
    "locations": [
      {
        "name": "Bokaro",
        "state": "Jharkhand",
        "coords": { "x": 12711, "y": 11777 },
        "description": "The Bokaro coalfield is a major source of prime coking coal for the steel industry."
      },
      {
        "name": "Raniganj",
        "state": "West Bengal",
        "coords": { "x": 13710, "y": 11910 },
        "description": "The birthplace of coal mining in India, this coalfield has been in operation since the late 18th century."
      },
      {
        "name": "Talcher",
        "state": "Odisha",
        "coords": { "x": 12600, "y": 13392 },
        "description": "One of the largest coalfields in India, with massive reserves of power-grade coal."
      },
      {
        "name": "Neyveli",
        "state": "Tamil Nadu",
        "coords": { "x": 8541, "y": 20036 },
        "description": "Famous for its large lignite (brown coal) mines, which fuel several thermal power stations."
      }
    ]
  },
  {
    "title": "Oil Fields",
    "icon": "fa-oil-well",
    "locations": [
      {
        "name": "Digboi",
        "state": "Assam",
        "coords": { "x": 18501, "y": 9348 },
        "description": "Home to the oldest operating oil refinery in the world, where crude oil was discovered in the late 19th century."
      },
      {
        "name": "Naharkatia",
        "state": "Assam",
        "coords": { "x": 18135, "y": 9524 },
        "description": "A significant onshore oil field in Assam, discovered after India's independence."
      },
      {
        "name": "Kalol",
        "state": "Gujarat",
        "coords": { "x": 5160, "y": 12595 },
        "description": "One of the major onshore oil and gas fields located in the Cambay Basin of Gujarat."
      },
      {
        "name": "Ankleshwar",
        "state": "Gujarat",
        "coords": { "x": 4970, "y": 13426 },
        "description": "Once the largest oil and gas field in India, it has been a crucial asset for ONGC since its discovery."
      },
      {
        "name": "Bassein",
        "state": "Arabian Sea",
        "coords": { "x": 4246, "y": 14608 },
        "description": "A large offshore natural gas field located to the south of the Mumbai High fields."
      },
      {
        "name": "Mumbai High",
        "state": "Arabian Sea",
        "coords": { "x": 4428, "y": 15082 },
        "description": "India's most important offshore oil field, contributing a significant portion of the country's total oil production."
      }
    ]
  },
  {
    "title": "Dams",
    "icon": "fa-water",
    "locations": [
      {
        "name": "Salal",
        "state": "Jammu & Kashmir",
        "coords": { "x": 6086, "y": 5374 },
        "description": "A run-of-the-river hydroelectric power project built on the Chenab River."
      },
      {
        "name": "Bhakra Nangal",
        "state": "Himachal Pradesh",
        "coords": { "x": 6964, "y": 6447 },
        "description": "A concrete gravity dam on the Sutlej River, forming the Gobind Sagar reservoir. It's one of the highest gravity dams in the world."
      },
      {
        "name": "Tehri",
        "state": "Uttarakhand",
        "coords": { "x": 8131, "y": 7599 },
        "description": "The tallest dam in India, this multi-purpose rock and earth-fill embankment dam is on the Bhagirathi River."
      },
      {
        "name": "Rana Pratap Sagar",
        "state": "Rajasthan",
        "coords": { "x": 6591, "y": 11145 },
        "description": "A gravity masonry dam on the Chambal River, part of an integrated scheme of four dams for power and irrigation."
      },
      {
        "name": "Sardar Sarovar",
        "state": "Gujarat",
        "coords": { "x": 5097, "y": 13481 },
        "description": "A large gravity dam on the Narmada River, providing water and electricity to four Indian states."
      },
      {
        "name": "Hirakud",
        "state": "Odisha",
        "coords": { "x": 11575, "y": 13491 },
        "description": "One of the first major multipurpose river valley projects, built on the Mahanadi River. It's one of the longest dams in the world."
      },
      {
        "name": "Nagarjuna Sagar",
        "state": "Telangana",
        "coords": { "x": 8627, "y": 16990 },
        "description": "A masonry dam on the Krishna River, it is one of the largest man-made lakes in the world."
      },
      {
        "name": "Tungabhadra",
        "state": "Karnataka",
        "coords": { "x": 6816, "y": 17439 },
        "description": "A multipurpose dam constructed across the Tungabhadra River, a tributary of the Krishna River."
      }
    ]
  },
  {
    "title": "Major Ports",
    "icon": "fa-anchor",
    "locations": [
      {
        "name": "Kandla",
        "state": "Gujarat",
        "coords": { "x": 2473, "y": 12288 },
        "description": "One of the major ports on the west coast, known for handling large volumes of cargo, especially crude oil."
      },
      {
        "name": "Mumbai",
        "state": "Maharashtra",
        "coords": { "x": 4912, "y": 14912 },
        "description": "India's largest port by size and shipping traffic, with a natural deep-water harbour."
      },
      {
        "name": "Marmagao",
        "state": "Goa",
        "coords": { "x": 5439, "y": 17341 },
        "description": "A leading iron ore exporting port in India, located in Goa."
      },
      {
        "name": "New Mangalore",
        "state": "Karnataka",
        "coords": { "x": 5995, "y": 18921 },
        "description": "An all-weather port, it's the deepest inner harbour on the west coast and a major exporter of coffee and cashew nuts."
      },
      {
        "name": "Kochi",
        "state": "Kerala",
        "coords": { "x": 6992, "y": 21013 },
        "description": "A major port on the Arabian Sea, located on the route connecting Europe and the Middle East to the Pacific Rim."
      },
      {
        "name": "Tuticorin",
        "state": "Tamil Nadu",
        "coords": { "x": 7826, "y": 21367 },
        "description": "Now known as V.O. Chidambaranar Port, it is an artificial deep-sea harbour and one of the 12 major ports of India."
      },
      {
        "name": "Chennai",
        "state": "Tamil Nadu",
        "coords": { "x": 9078, "y": 18802 },
        "description": "The largest port in the Bay of Bengal, it is the second largest container port in India."
      },
      {
        "name": "Vishakhapatnam",
        "state": "Andhra Pradesh",
        "coords": { "x": 10912, "y": 15722 },
        "description": "One of India's largest and oldest ports, with a natural harbour and significant cargo traffic."
      },
      {
        "name": "Paradip",
        "state": "Odisha",
        "coords": { "x": 12989, "y": 14179 },
        "description": "An artificial, deep-water port on the east coast, a major hub for handling coal, iron ore, and other dry cargo."
      },
      {
        "name": "Haldia",
        "state": "West Bengal",
        "coords": { "x": 13673, "y": 13167 },
        "description": "A major seaport located near the Hooghly River, serving as a satellite port for Kolkata."
      }
    ]
  },
  {
    "title": "International Airports",
    "icon": "fa-plane-departure",
    "locations": [
      {
        "name": "Raja Sansi",
        "state": "Punjab",
        "coords": { "x": 5987, "y": 6468 },
        "description": "Also known as Sri Guru Ram Dass Jee International Airport, it serves the city of Amritsar."
      },
      {
        "name": "Indira Gandhi International",
        "state": "Delhi",
        "coords": { "x": 7296, "y": 8583 },
        "description": "The primary international airport serving Delhi, it is the busiest airport in India in terms of passenger traffic."
      },
      {
        "name": "Netaji Subhash Chandra Bose",
        "state": "West Bengal",
        "coords": { "x": 14006, "y": 12668 },
        "description": "Located in Kolkata, it is the aviation hub for the entire eastern and northeastern India."
      },
      {
        "name": "Chhatrapati Shivaji",
        "state": "Maharashtra",
        "coords": { "x": 4832, "y": 14842 },
        "description": "Serving the Mumbai Metropolitan Region, it is the second busiest airport in the country."
      },
      {
        "name": "Rajiv Gandhi",
        "state": "Telangana",
        "coords": { "x": 7969, "y": 15904 },
        "description": "The international airport serving Hyderabad, known for its modern infrastructure and passenger amenities."
      },
      {
        "name": "Meenam Bakkam",
        "state": "Tamil Nadu",
        "coords": { "x": 9076, "y": 18712 },
        "description": "Officially known as Chennai International Airport, it is the main aviation gateway to South India."
      },
      {
        "name": "Thiruvananthapuram",
        "state": "Kerala",
        "coords": { "x": 7251, "y": 21559 },
        "description": "The first international airport in a non-metro city in India, serving the capital of Kerala."
      }
    ]
  },
  {
    "title": "Congress Sessions",
    "icon": "fa-users",
    "locations": [
      {
        "name": "Lahore Session (1929)",
        "state": "Pakistan",
        "coords": { "x": 5491, "y": 5955 },
        "description": "A landmark session where the resolution for 'Purna Swaraj' (complete independence) was passed, with Jawaharlal Nehru as president."
      },
      {
        "name": "Nagpur (Dec. 1920)",
        "state": "Maharashtra",
        "coords": { "x": 8798, "y": 13544 },
        "description": "The session where the Non-Cooperation Movement program was formally ratified and the Congress constitution was changed."
      },
      {
        "name": "Calcutta (Sept. 1920)",
        "state": "West Bengal",
        "coords": { "x": 14137, "y": 12677 },
        "description": "A special session where Mahatma Gandhi's proposal for the Non-Cooperation Movement was approved."
      },
      {
        "name": "Madras (Dec. 1927)",
        "state": "Tamil Nadu",
        "coords": { "x": 9057, "y": 18836 },
        "description": "This session passed a resolution against the use of Indian troops in China, Java, and Mesopotamia and decided to boycott the Simon Commission."
      }
    ]
  },
  {
    "title": "National Movement Centres",
    "icon": "fa-flag",
    "locations": [
      {
        "name": "Amritsar",
        "state": "Punjab",
        "coords": { "x": 6030, "y": 6793 },
        "description": "Site of the tragic Jallianwala Bagh massacre in 1919, a pivotal event that galvanized the independence movement."
      },
      {
        "name": "Chauri Chaura",
        "state": "Uttar Pradesh",
        "coords": { "x": 11193, "y": 9936 },
        "description": "A 1922 incident here where protestors clashed with police led Mahatma Gandhi to call off the Non-Cooperation Movement."
      },
      {
        "name": "Champaran",
        "state": "Bihar",
        "coords": { "x": 11860, "y": 9991 },
        "description": "The site of Gandhi's first major Satyagraha movement in 1917, protesting against the forced cultivation of indigo."
      },
      {
        "name": "Ahmedabad",
        "state": "Gujarat",
        "coords": { "x": 4209, "y": 12777 },
        "description": "A key center for many of Gandhi's activities, including the 1918 Ahmedabad mill strike."
      },
      {
        "name": "Kheda",
        "state": "Gujarat",
        "coords": { "x": 4804, "y": 12698 },
        "description": "In 1918, Gandhi and Sardar Patel led the Kheda Satyagraha here, supporting peasants who were unable to pay high taxes."
      },
      {
        "name": "Dandi",
        "state": "Gujarat",
        "coords": { "x": 4969, "y": 13836 },
        "description": "The destination of the famous Dandi March (Salt March) in 1930, where Gandhi broke the British salt law."
      }
    ]
  }
];

/**
 * Array of downloadable resources related to the map application.
 * Users can download high-res maps in various categories.
 */
export const downloadsData: DownloadItem[] = [
  { 
    id: 'political-map',
    title: 'Political Map', 
    description: 'States, UTs, and Capitals boundaries.', 
    downloadUrl: 'https://drive.google.com/uc?export=download&id=1a1E8JlmZ7hyXbUesNdXRyXcj8GG10SW8', 
    type: 'political', 
    category: 'outlines',
    icon: 'fa-map-location-dot', 
    size: '2.4 MB',
    format: 'PDF',
    isAvailable: true
  },
  { 
    id: 'physical-features',
    title: 'Physical Features', 
    description: 'Major mountains, peaks, rivers, and plateaus.', 
    downloadUrl: '#', 
    type: 'physical', 
    category: 'physical',
    icon: 'fa-mountain-sun', 
    size: '1.8 MB',
    format: 'PDF',
    isAvailable: false
  },
  { 
    id: 'national-movement',
    title: 'National Movement', 
    description: 'Congress sessions & Independence centers.', 
    downloadUrl: '#', 
    type: 'history', 
    category: 'history',
    icon: 'fa-scroll', 
    size: '1.2 MB',
    format: 'PDF',
    isAvailable: false
  },
  { 
    id: 'rivers-dams',
    title: 'Rivers & Dams', 
    description: 'Major river systems and dams projects.', 
    downloadUrl: '#', 
    type: 'water', 
    category: 'physical',
    icon: 'fa-water', 
    size: '3.1 MB',
    format: 'PDF',
    isAvailable: false
  },
];
