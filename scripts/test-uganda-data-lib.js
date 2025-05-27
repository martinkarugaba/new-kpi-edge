import UgandaData from 'uganda-data-lib';

// Test the uganda-data-lib package to see what data it provides
async function testUgandaDataLib() {
  console.log('Testing uganda-data-lib package...\n');

  // Initialize with a dummy API key to see what happens
  const ugandaDataLib = new UgandaData('test-api-key');

  try {
    console.log('Available methods in UgandaData:');
    console.log(
      Object.getOwnPropertyNames(Object.getPrototypeOf(ugandaDataLib))
    );
    console.log('\n');

    // Try to fetch districts (this will likely fail without a real API key, but we can see the structure)
    console.log('Attempting to fetch districts...');
    const districts = await ugandaDataLib.fetchDistricts(5, 1, 'asc');
    console.log('Districts response:', districts);
  } catch (error) {
    console.log('Error (expected without real API key):', error.message);
    console.log('\nThis package requires an API key from uganda.rapharm.shop');
  }
}

testUgandaDataLib();
