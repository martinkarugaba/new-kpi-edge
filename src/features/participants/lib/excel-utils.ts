import * as XLSX from 'xlsx';

export function downloadTemplate() {
  // Sample data with expected format
  const sampleData = [
    {
      firstName: 'John',
      lastName: 'Doe',
      sex: 'male', // Accepted values: male, female, other
      age: '25',
      contact: '+256700000000',
      isPWD: 'no', // yes or no
      isMother: 'no', // yes or no
      isRefugee: 'no', // yes or no
      project_id: '', // Required: Project ID from your system
      cluster_id: '', // Required: Cluster ID from your system
      organization_id: '', // Required: Organization ID from your system
      country: 'Uganda',
      district: 'Sample District',
      subCounty: 'Sample Sub County',
      parish: 'Sample Parish',
      village: 'Sample Village',
      designation: 'Farmer',
      enterprise: 'Agriculture',
      noOfTrainings: '0',
      isActive: 'yes', // yes or no
    },
  ];

  const ws = XLSX.utils.json_to_sheet(sampleData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Participants');

  // Add column widths for better readability
  ws['!cols'] = [
    { wch: 15 }, // firstName
    { wch: 15 }, // lastName
    { wch: 8 }, // sex
    { wch: 6 }, // age
    { wch: 15 }, // contact
    { wch: 6 }, // isPWD
    { wch: 8 }, // isMother
    { wch: 8 }, // isRefugee
    { wch: 36 }, // project_id
    { wch: 36 }, // cluster_id
    { wch: 36 }, // organization_id
    { wch: 15 }, // country
    { wch: 15 }, // district
    { wch: 15 }, // subCounty
    { wch: 15 }, // parish
    { wch: 15 }, // village
    { wch: 15 }, // designation
    { wch: 15 }, // enterprise
    { wch: 12 }, // noOfTrainings
    { wch: 8 }, // isActive
  ];

  XLSX.writeFile(wb, 'participants-template.xlsx');
}
