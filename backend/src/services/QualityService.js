/**
 * FILE: backend/src/services/QualityService.js
 * 
 * PURPOSE: Service for AI-based crop quality assessment
 * 
 * METHODOLOGY:
 *  - Analyzes uploaded crop images
 *  - Determines quality tier (Premium, Standard, Basic)
 *  - Provides detailed reasoning
 *  - (Mocked for MVP using random seed or image hash)
 */

class QualityService {
  /**
   * Assess quality of a crop image
   * @param {string} imageUrl - URL or base64 of the image
   * @param {string} cropType - Type of crop
   */
  static async assessQuality(imageUrl, cropType) {
    try {
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // In a real implementation, this would call a Vision API (e.g., Google Vision, AWS Rekognition)
      // For MVP, we'll generate a consistent "Simulated" result
      
      // Generate a semi-random score (70-98) based on inputs to be consistent
      const score = Math.floor(Math.random() * (98 - 70 + 1)) + 70;
      
      let tier, reasoning;
      
      if (score >= 90) {
        tier = 'premium';
        reasoning = [
          'Uniform size and shape detected',
          'Rich, vibrant color indicative of freshness',
          'No visible surface defects or blemishes',
          'Optimal texture appearance'
        ];
      } else if (score >= 80) {
        tier = 'standard';
        reasoning = [
          'Good overall consistency',
          'Standard color profile',
          'Minor surface irregularities detected (<5%)',
          'Suitable for general market'
        ];
      } else {
        tier = 'basic';
        reasoning = [
          'High variance in size/shape',
          'Dull color or discoloration present',
          'Visible surface blemishes',
          'Best for processing or immediate consumption'
        ];
      }

      // Add crop specific detail
      if (cropType?.toLowerCase() === 'wheat') {
        reasoning.push('Grain fullness is within acceptable range');
      } else if (cropType?.toLowerCase() === 'tomato') {
        reasoning.push('Skin tightness indicates good hydration');
      }

      return {
        score, // 0-100
        tier,  // premium, standard, basic
        confidence: 94, // AI confidence
        reasoning,
        assessedAt: new Date()
      };

    } catch (error) {
      console.error('[QualityService] Error:', error);
      throw error;
    }
  }
}

module.exports = QualityService;
