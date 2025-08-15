import fs from 'fs';
import path from 'path';

/**
 * Utility function to save getExpSearch response data to a JSON file
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

/**
 * Function to manually save existing getExpSearch data from a file
 * @param {string} inputFile - Path to the existing getExpSearch response file
 * @param {string} outputDir - Output directory
 */
export const saveExistingGetExpSearchData = (inputFile, outputDir = 'api_request_response') => {
  try {
    if (!fs.existsSync(inputFile)) {
      throw new Error(`Input file not found: ${inputFile}`);
    }
    
    const data = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
    const TUI = data.TUI || 'unknown';
    
    return saveGetExpSearchData(data, TUI, outputDir);
  } catch (error) {
    console.error("❌ Error processing existing file:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Example usage:
// import { saveGetExpSearchData } from './utils/saveGetExpSearch.js';
// 
// // In your controller after getting the data:
// const result = saveGetExpSearchData(data, TUI);
// if (result.success) {
//   console.log(`Data saved to: ${result.filepath}`);
// } 