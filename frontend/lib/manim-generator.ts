export function generateManimCode(aiResponse: string): string {
  
    const manimCodeMatch = aiResponse.match(/```python([\s\S]*?)```/);
    
    if (manimCodeMatch) {
        return manimCodeMatch[1].trim();
    }
  
    return "Error: AI did not generate valid Manim code.";
  }
  