export interface SubCountyData {
  name: string;
  code?: string; // Will be generated if not provided
  districtName: string;
}

// Function to generate sub-county code from district code and subcounty name
export const generateSubCountyCode = (
  districtCode: string,
  subCountyName: string,
): string => {
  // Extract the first 3 letters from sub-county name and convert to uppercase
  const subCountyInitials = subCountyName.substring(0, 3).toUpperCase();

  // Format as "UG-KBL-KAM" where:
  // - UG is country code
  // - KBL is district code
  // - KAM is subcounty initial 3 letters
  // The district code will include the country code followed by district initials
  const parts = districtCode.split("-");
  if (parts.length === 2) {
    const countryCode = parts[0]; // e.g., "UG"
    const districtInitials = parts[1]; // e.g., "KAB"
    return `${countryCode}-${districtInitials}-${subCountyInitials}`;
  }

  // Fallback to the original format if district code is not as expected
  return `${districtCode}-${subCountyInitials}`;
};

export const ugandaSubCounties: SubCountyData[] = [
  // Previous entries remain the same...

  // Hoima District
  { name: "Hoima Central", districtName: "Hoima" },
  { name: "Kahoora Division", districtName: "Hoima" },
  { name: "Busiisi Division", districtName: "Hoima" },
  { name: "Mparo Division", districtName: "Hoima" },
  { name: "Kigorobya", districtName: "Hoima" },

  // Tororo District
  { name: "Tororo Municipality", districtName: "Tororo" },
  { name: "Eastern Division", districtName: "Tororo" },
  { name: "Western Division", districtName: "Tororo" },
  { name: "Mukuju", districtName: "Tororo" },
  { name: "Molo", districtName: "Tororo" },

  // Iganga District
  { name: "Iganga Municipality", districtName: "Iganga" },
  { name: "Northern Division", districtName: "Iganga" },
  { name: "Central Division", districtName: "Iganga" },
  { name: "Nakalama", districtName: "Iganga" },
  { name: "Nakigo", districtName: "Iganga" },

  // Kasese District
  { name: "Kasese Municipality", districtName: "Kasese" },
  { name: "Nyamwamba Division", districtName: "Kasese" },
  { name: "Central Division", districtName: "Kasese" },
  { name: "Bulembia Division", districtName: "Kasese" },
  { name: "Kitswamba", districtName: "Kasese" },

  // Bushenyi District
  { name: "Bushenyi-Ishaka", districtName: "Bushenyi" },
  { name: "Central Division", districtName: "Bushenyi" },
  { name: "Nyakabirizi", districtName: "Bushenyi" },
  { name: "Kyeizooba", districtName: "Bushenyi" },
  { name: "Kyamuhunga", districtName: "Bushenyi" },

  // Kitgum District
  { name: "Kitgum Municipality", districtName: "Kitgum" },
  { name: "Central Division", districtName: "Kitgum" },
  { name: "Pager Division", districtName: "Kitgum" },
  { name: "Labongo Layamo", districtName: "Kitgum" },
  { name: "Labongo Amida", districtName: "Kitgum" },

  // Moroto District
  { name: "Moroto Municipality", districtName: "Moroto" },
  { name: "North Division", districtName: "Moroto" },
  { name: "South Division", districtName: "Moroto" },
  { name: "Nadunget", districtName: "Moroto" },
  { name: "Katikekile", districtName: "Moroto" },

  // Busia District
  { name: "Busia Municipality", districtName: "Busia" },
  { name: "Eastern Division", districtName: "Busia" },
  { name: "Western Division", districtName: "Busia" },
  { name: "Dabani", districtName: "Busia" },
  { name: "Buteba", districtName: "Busia" },
  { name: "Bungatira", districtName: "Gulu" },
  { name: "Palaro", districtName: "Gulu" },

  // Mbale District
  { name: "Mbale City", districtName: "Mbale" },
  { name: "Industrial Division", districtName: "Mbale" },
  { name: "Wanale Division", districtName: "Mbale" },
  { name: "Northern Division", districtName: "Mbale" },
  { name: "Nakaloke", districtName: "Mbale" },
  { name: "Namanyonyi", districtName: "Mbale" },

  // Arua District
  { name: "Arua City", districtName: "Arua" },
  { name: "Ayivu Division", districtName: "Arua" },
  { name: "River Oli Division", districtName: "Arua" },
  { name: "Adumi", districtName: "Arua" },
  { name: "Pajulu", districtName: "Arua" },
  { name: "Dadamu", districtName: "Arua" },

  // Lira District
  { name: "Lira City", districtName: "Lira" },
  { name: "Adyel", districtName: "Lira" },
  { name: "Ojwina", districtName: "Lira" },
  { name: "Railway", districtName: "Lira" },
  { name: "Central", districtName: "Lira" },
  { name: "Agweng", districtName: "Lira" },
  { name: "Aromo", districtName: "Lira" },

  // Masaka District
  { name: "Masaka City", districtName: "Masaka" },
  { name: "Kimaanya-Kyabakuza", districtName: "Masaka" },
  { name: "Nyendo-Mukungwe", districtName: "Masaka" },
  { name: "Katwe-Butego", districtName: "Masaka" },
  { name: "Mukungwe", districtName: "Masaka" },
  { name: "Kabonera", districtName: "Masaka" },

  // Kabale District
  { name: "Kabale Municipality", districtName: "Kabale" },
  { name: "Northern Division", districtName: "Kabale" },
  { name: "Southern Division", districtName: "Kabale" },
  { name: "Kamuganguzi", districtName: "Kabale" },
  { name: "Buhara", districtName: "Kabale" },
  { name: "Kyanamira", districtName: "Kabale" },
  // Soroti District
  { name: "Soroti City", districtName: "Soroti" },
  { name: "Eastern Division", districtName: "Soroti" },
  { name: "Western Division", districtName: "Soroti" },
  { name: "Gweri", districtName: "Soroti" },
  { name: "Arapai", districtName: "Soroti" },

  // Fort Portal District
  { name: "Fort Portal City", districtName: "Fort Portal" },
  { name: "Central Division", districtName: "Fort Portal" },
  { name: "Southern Division", districtName: "Fort Portal" },
  { name: "Western Division", districtName: "Fort Portal" },
  { name: "Busoro", districtName: "Fort Portal" },
  { name: "Karambi", districtName: "Fort Portal" },

  // Jinja District
  { name: "Jinja City", districtName: "Jinja" },
  { name: "Central Division", districtName: "Jinja" },
  { name: "Masese Division", districtName: "Jinja" },
  { name: "Mpumudde Division", districtName: "Jinja" },
  { name: "Budondo", districtName: "Jinja" },

  // Mbarara District
  { name: "Mbarara City", districtName: "Mbarara" },
  { name: "Kakoba Division", districtName: "Mbarara" },
  { name: "Nyamitanga Division", districtName: "Mbarara" },
  { name: "Biharwe", districtName: "Mbarara" },
  { name: "Rubindi", districtName: "Mbarara" },

  // Mukono District
  { name: "Mukono Municipality", districtName: "Mukono" },
  { name: "Goma Division", districtName: "Mukono" },
  { name: "Nakifuma", districtName: "Mukono" },
  { name: "Kyampisi", districtName: "Mukono" },
  { name: "Ntenjeru", districtName: "Mukono" },

  // Wakiso District
  { name: "Nansana Municipality", districtName: "Wakiso" },
  { name: "Kira Municipality", districtName: "Wakiso" },
  { name: "Entebbe Municipality", districtName: "Wakiso" },
  { name: "Makindye-Ssabagabo", districtName: "Wakiso" },
  { name: "Kasangati", districtName: "Wakiso" },
];
