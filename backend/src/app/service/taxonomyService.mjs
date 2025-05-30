
export default class TaxonomyService {
  /**
   * 
   * @Description For clearing the Text
   * @returns 
   */
  static async classifyQuote(quote) {
    const response = await client.chat.completions.create({
      model: process.env.AZURE_OPENAI_MODEL,
      messages: [{
        role: "system",
        content: `Match to taxonomy:
        Pricing: ["cost concern","value question"]
        Features: ["comparison","request"]`
      }, {
        role: "user",
        content: `Classify: "${quote.cleanedText}"`
      }],
      temperature: 0
    });

    return {
      ...quote,
    };
  }
}