import fs from 'fs';
import path from 'path';

/**
 * Comprehensive script to save all flight data from existing files
 * Usage: node save_all_flight_data.js
 */

const saveFlightData = (data, TUI, type, outputDir = 'api_request_response') => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${type}_${TUI}_${timestamp}.json`;
    const filepath = path.join(process.cwd(), outputDir, filename);
    
    // Ensure directory exists
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Save the complete response data with proper formatting
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
    
    console.log(`✅ Complete ${type} data saved to: ${filepath}`);
    console.log(`📁 File size: ${(fs.statSync(filepath).size / 1024).toFixed(2)} KB`);
    
    return {
      success: true,
      filepath,
      filename,
      size: fs.statSync(filepath).size,
      type
    };
  } catch (error) {
    console.error(`❌ Error saving ${type} data:`, error);
    return {
      success: false,
      error: error.message
    };
  }
};

const detectDataType = (data) => {
  // Check for getExpSearch characteristics
  if (data.Completed === "True" && data.Trips && data.Trips[0] && data.Trips[0].Journey) {
    return 'getExpSearch';
  }
  
  // Check for getPricer characteristics
  if (data.Code === "200" && data.Trips && data.Trips[0] && data.Trips[0].Journey && 
      data.Trips[0].Journey[0] && data.Trips[0].Journey[0].Segments) {
    return 'getPricer';
  }
  
  // Check for other API types based on file naming patterns
  return 'unknown';
};

const processFile = (filepath) => {
  try {
    if (!fs.existsSync(filepath)) {
      console.error(`❌ File not found: ${filepath}`);
      return { success: false, error: 'File not found' };
    }
    
    console.log(`📖 Reading: ${filepath}`);
    const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    
    // Extract TUI from the data
    const TUI = data.TUI || 'unknown';
    console.log(`🔍 Found TUI: ${TUI}`);
    
    // Detect data type
    const dataType = detectDataType(data);
    console.log(`🔍 Detected type: ${dataType}`);
    
    if (dataType === 'unknown') {
      console.log(`⚠️  Unknown data type for file: ${filepath}`);
      return { success: false, error: 'Unknown data type' };
    }
    
    // Save the data
    const result = saveFlightData(data, TUI, dataType);
    
    if (result.success) {
      console.log(`\n🎉 Successfully saved ${dataType} data!`);
      console.log(`📄 File: ${result.filename}`);
      console.log(`📂 Path: ${result.filepath}`);
      console.log(`📊 Size: ${(result.size / 1024).toFixed(2)} KB`);
      
      // Show data summary
      console.log(`\n📋 Data Summary:`);
      console.log(`   - TUI: ${data.TUI}`);
      console.log(`   - Type: ${dataType}`);
      
      if (dataType === 'getExpSearch') {
        console.log(`   - Completed: ${data.Completed}`);
        console.log(`   - Currency: ${data.CurrencyCode}`);
        console.log(`   - Trips: ${data.Trips?.length || 0} trip(s)`);
        if (data.Trips && data.Trips[0] && data.Trips[0].Journey) {
          console.log(`   - Journeys: ${data.Trips[0].Journey.length} journey(s)`);
        }
      } else if (dataType === 'getPricer') {
        console.log(`   - Code: ${data.Code}`);
        console.log(`   - Currency: ${data.CurrencyCode}`);
        console.log(`   - From: ${data.From} (${data.FromName})`);
        console.log(`   - To: ${data.To} (${data.ToName})`);
        console.log(`   - Date: ${data.OnwardDate}`);
        console.log(`   - Passengers: ${data.ADT} ADT, ${data.CHD} CHD, ${data.INF} INF`);
        console.log(`   - Net Amount: ${data.NetAmount} ${data.CurrencyCode}`);
        console.log(`   - Gross Amount: ${data.GrossAmount} ${data.CurrencyCode}`);
        console.log(`   - Trips: ${data.Trips?.length || 0} trip(s)`);
        if (data.Trips && data.Trips[0] && data.Trips[0].Journey) {
          console.log(`   - Journeys: ${data.Trips[0].Journey.length} journey(s)`);
        }
        if (data.Rules) {
          console.log(`   - Rules: ${data.Rules.length} rule(s)`);
        }
        if (data.SSR) {
          console.log(`   - SSR: ${data.SSR.length} service(s)`);
        }
      }
    }
    
    return result;
  } catch (error) {
    console.error(`❌ Error processing file ${filepath}:`, error.message);
    return { success: false, error: error.message };
  }
};

const main = () => {
  try {
    console.log('🚀 Starting to save all flight data...\n');
    
    // Define the directory containing the flight data files
    const inputDir = 'Oneway Booking with Baggage_Direct Flight_Direct Flight_2ADT_2CHD_2INF';
    
    if (!fs.existsSync(inputDir)) {
      console.error(`❌ Input directory not found: ${inputDir}`);
      console.log('Please make sure the directory exists.');
      return;
    }
    
    // Get all JSON files in the directory
    const files = fs.readdirSync(inputDir);
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    
    console.log(`📁 Found ${jsonFiles.length} JSON files in ${inputDir}`);
    
    const results = [];
    
    // Process each file
    for (const file of jsonFiles) {
      console.log(`\n${'='.repeat(60)}`);
      const filepath = path.join(inputDir, file);
      const result = processFile(filepath);
      results.push({
        file,
        ...result
      });
    }
    
    // Summary
    console.log(`\n${'='.repeat(60)}`);
    console.log('📊 FINAL SUMMARY');
    console.log(`${'='.repeat(60)}`);
    
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    console.log(`✅ Successfully saved: ${successful.length} files`);
    console.log(`❌ Failed: ${failed.length} files`);
    
    if (successful.length > 0) {
      const totalSize = successful.reduce((sum, r) => sum + r.size, 0);
      console.log(`📁 Total size: ${(totalSize / 1024).toFixed(2)} KB`);
      
      // Group by type
      const byType = successful.reduce((acc, r) => {
        acc[r.type] = (acc[r.type] || 0) + 1;
        return acc;
      }, {});
      
      console.log(`\n📋 By Type:`);
      Object.entries(byType).forEach(([type, count]) => {
        console.log(`   - ${type}: ${count} file(s)`);
      });
    }
    
    if (failed.length > 0) {
      console.log(`\n❌ Failed files:`);
      failed.forEach(f => {
        console.log(`   - ${f.file}: ${f.error}`);
      });
    }
    
    console.log(`\n🎉 Process completed!`);
    
  } catch (error) {
    console.error('❌ Error in main process:', error.message);
  }
};

// Run the script
main(); 