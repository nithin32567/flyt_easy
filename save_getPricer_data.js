import fs from 'fs';
import path from 'path';

/**
 * Script to save getPricer data from existing file
 * Usage: node save_getPricer_data.js
 */

const saveGetPricerData = (data, TUI, outputDir = 'api_request_response') => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `getPricer_${TUI}_${timestamp}.json`;
    const filepath = path.join(process.cwd(), outputDir, filename);
    
    // Ensure directory exists
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Save the complete response data with proper formatting
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
    
    console.log(`✅ Complete getPricer data saved to: ${filepath}`);
    console.log(`📁 File size: ${(fs.statSync(filepath).size / 1024).toFixed(2)} KB`);
    
    return {
      success: true,
      filepath,
      filename,
      size: fs.statSync(filepath).size
    };
  } catch (error) {
    console.error("❌ Error saving getPricer data:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

const main = () => {
  try {
    // Path to the existing getPricer response file
    const inputFile = 'Oneway Booking with Baggage_Direct Flight_Direct Flight_2ADT_2CHD_2INF/8.GetSPricerRS.json';
    
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
    const result = saveGetPricerData(data, TUI);
    
    if (result.success) {
      console.log(`\n🎉 Successfully saved getPricer data!`);
      console.log(`📄 File: ${result.filename}`);
      console.log(`📂 Path: ${result.filepath}`);
      console.log(`📊 Size: ${(result.size / 1024).toFixed(2)} KB`);
      
      // Show some basic info about the data
      console.log(`\n📋 Data Summary:`);
      console.log(`   - TUI: ${data.TUI}`);
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
      
      // Show detailed breakdown
      console.log(`\n📊 Detailed Breakdown:`);
      if (data.Trips && data.Trips[0] && data.Trips[0].Journey && data.Trips[0].Journey[0]) {
        const journey = data.Trips[0].Journey[0];
        console.log(`   - Provider: ${journey.Provider}`);
        console.log(`   - Stops: ${journey.Stops}`);
        console.log(`   - Duration: ${journey.Duration}`);
        console.log(`   - Promo: ${journey.Promo}`);
        console.log(`   - FCType: ${journey.FCType}`);
        
        if (journey.Segments && journey.Segments[0]) {
          const segment = journey.Segments[0];
          console.log(`   - Flight: ${segment.Flight.Airline} ${segment.Flight.FlightNo}`);
          console.log(`   - Route: ${segment.Flight.DepartureCode} → ${segment.Flight.ArrivalCode}`);
          console.log(`   - Time: ${segment.Flight.DepartureTime} → ${segment.Flight.ArrivalTime}`);
        }
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