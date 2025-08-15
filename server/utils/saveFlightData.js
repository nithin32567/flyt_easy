import fs from 'fs';
import path from 'path';

/**
 * Comprehensive utility to save flight API response data
 * Supports both getExpSearch and getPricer endpoints
 */

/**
 * Save getExpSearch response data to a JSON file
 * @param {Object} data - The complete getExpSearch response data
 * @param {string} TUI - The TUI identifier
 * @param {string} outputDir - Output directory (defaults to api_request_response)
 */
export const saveGetExpSearchData = (data, TUI, outputDir = 'api_request_response') => {
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
      size: fs.statSync(filepath).size,
      type: 'getExpSearch'
    };
  } catch (error) {
    console.error("❌ Error saving getExpSearch data:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Save getPricer response data to a JSON file
 * @param {Object} data - The complete getPricer response data
 * @param {string} TUI - The TUI identifier
 * @param {string} outputDir - Output directory (defaults to api_request_response)
 */
export const saveGetPricerData = (data, TUI, outputDir = 'api_request_response') => {
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
      size: fs.statSync(filepath).size,
      type: 'getPricer'
    };
  } catch (error) {
    console.error("❌ Error saving getPricer data:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Save any flight API response data (auto-detects type)
 * @param {Object} data - The complete API response data
 * @param {string} TUI - The TUI identifier
 * @param {string} outputDir - Output directory
 */
export const saveFlightData = (data, TUI, outputDir = 'api_request_response') => {
  // Auto-detect the type based on data structure
  if (data.Completed === "True" && data.Trips && data.Trips[0] && data.Trips[0].Journey) {
    return saveGetExpSearchData(data, TUI, outputDir);
  } else if (data.Code === "200" && data.Trips && data.Trips[0] && data.Trips[0].Journey && data.Trips[0].Journey[0] && data.Trips[0].Journey[0].Segments) {
    return saveGetPricerData(data, TUI, outputDir);
  } else {
    console.error("❌ Unknown data type, cannot determine if it's getExpSearch or getPricer");
    return {
      success: false,
      error: "Unknown data type"
    };
  }
};

/**
 * Function to manually save existing flight data from files
 * @param {string} inputFile - Path to the existing response file
 * @param {string} outputDir - Output directory
 */
export const saveExistingFlightData = (inputFile, outputDir = 'api_request_response') => {
  try {
    if (!fs.existsSync(inputFile)) {
      throw new Error(`Input file not found: ${inputFile}`);
    }
    
    const data = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
    const TUI = data.TUI || 'unknown';
    
    return saveFlightData(data, TUI, outputDir);
  } catch (error) {
    console.error("❌ Error processing existing file:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Save all flight data from a directory
 * @param {string} inputDir - Directory containing flight data files
 * @param {string} outputDir - Output directory
 */
export const saveAllFlightData = (inputDir, outputDir = 'api_request_response') => {
  try {
    if (!fs.existsSync(inputDir)) {
      throw new Error(`Input directory not found: ${inputDir}`);
    }
    
    const files = fs.readdirSync(inputDir);
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    
    console.log(`📁 Found ${jsonFiles.length} JSON files in ${inputDir}`);
    
    const results = [];
    
    for (const file of jsonFiles) {
      const filepath = path.join(inputDir, file);
      console.log(`\n📖 Processing: ${file}`);
      
      const result = saveExistingFlightData(filepath, outputDir);
      results.push({
        file,
        ...result
      });
    }
    
    console.log(`\n📊 Summary:`);
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    console.log(`✅ Successfully saved: ${successful.length} files`);
    console.log(`❌ Failed: ${failed.length} files`);
    
    if (successful.length > 0) {
      const totalSize = successful.reduce((sum, r) => sum + r.size, 0);
      console.log(`📁 Total size: ${(totalSize / 1024).toFixed(2)} KB`);
    }
    
    return results;
  } catch (error) {
    console.error("❌ Error processing directory:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Example usage:
// import { saveFlightData, saveGetExpSearchData, saveGetPricerData } from './utils/saveFlightData.js';
// 
// // Auto-detect and save
// const result = saveFlightData(data, TUI);
// 
// // Or save specific type
// const expSearchResult = saveGetExpSearchData(data, TUI);
// const pricerResult = saveGetPricerData(data, TUI); 