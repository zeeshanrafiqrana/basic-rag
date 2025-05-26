class ValidationService {
    static async validate(quote) {
      const response = await client.chat.completions.create({
        model: process.env.AZURE_OPENAI_MODEL,
        messages: [{
          role: "system",
          content: `Verify quote quality (1-5 scale):
          1. Contains complete technical thought
          2. Properly classified
          3. Cleaned effectively`
        }]
      });
      return {
        ...quote,
        validationScore: parseInt(response.choices[0].message.content)
      };
    }
  }