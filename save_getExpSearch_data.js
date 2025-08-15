import fs from 'fs';
import path from 'path';

/**
 * Script to save getExpSearch data from existing file
 * Usage: node save_getExpSearch_data.js
 */

const saveGetExpSearchData = (data, TUI, outputDir = 'api_request_response') => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `getExpSearch_${TUI}_${timestamp}.json`;
    const filepath = path.join(process.cwd(), outputDir, filename);
    
    // Ensure directory exists
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Save the complete response data with proper formatting
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
    
    console.log(`✅ Complete getExpSearch data saved to: ${filepath}`);
    console.log(`📁 File size: ${(fs.statSync(filepath).size / 1024).toFixed(2)} KB`);
    
    return {
      success: true,
      filepath,
      filename,
      size: fs.statSync(filepath).size
    };
  } catch (error) {
    console.error("❌ Error saving getExpSearch data:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

const main = () => {
  try {
    // Path to the existing getExpSearch response file
    const inputFile = 'Oneway Booking with Baggage_Direct Flight_Direct Flight_2ADT_2CHD_2INF/4.GetExpSearchRS.json';
    
    if (!fs.existsSync(inputFile)) {
      console.error(`❌ Input file not found: ${inputFile}`);
      console.log('Please make sure the file exists in the specified path.');
      return;
    }
    
    console.log(`📖 Reading data from: ${inputFile}`);
    const data = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
    
    // Extract TUI from the data
    const TUI = data.TUI || 'unknown';
    console.log(`🔍 Found TUI: ${TUI}`);
    
    // Save the data
    const result = saveGetExpSearchData(data, TUI);
    
    if (result.success) {
      console.log(`\n🎉 Successfully saved getExpSearch data!`);
      console.log(`📄 File: ${result.filename}`);
      console.log(`📂 Path: ${result.filepath}`);
      console.log(`📊 Size: ${(result.size / 1024).toFixed(2)} KB`);
      
      // Show some basic info about the data
      console.log(`\n📋 Data Summary:`);
      console.log(`   - TUI: ${data.TUI}`);
      console.log(`   - Completed: ${data.Completed}`);
      console.log(`   - Currency: ${data.CurrencyCode}`);
      console.log(`   - Trips: ${data.Trips?.length || 0} trip(s)`);
      
      if (data.Trips && data.Trips[0] && data.Trips[0].Journey) {
        console.log(`   - Journeys: ${data.Trips[0].Journey.length} journey(s)`);
      }
    } else {
      console.error(`❌ Failed to save data: ${result.error}`);
    }
    
  } catch (error) {
    console.error('❌ Error processing file:', error.message);
  }
};

// Run the script
main(); 