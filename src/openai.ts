import { OpenAiApiResponse } from "./types/openai";
import { Conversation } from "./types/tables";

export class OpenAI {
  private readonly headers: Record<string, string>;
  private readonly baseUrl = "https://api.openai.com";
  private readonly promptBase = `あなたは1986年12月8日に生まれ、いま37歳の日本語話者です。彼女は明るくポジティブな性格です。ユーザーとあなたは友達です。この会話はユーザーとあなたの間で行われるものです。\n\n`;

  constructor(apiKey: string) {
    this.headers = {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    };
  }

  public async generateMessage(
    records: Conversation[],
    message: string
  ): Promise<string | undefined> {
    const dialog = records.reverse().map((record) => {
      return `ユーザー: ${record.my_message}\nあなた: ${record.bot_message}\n`;
    });
    dialog.push(`ユーザー: ${message}\nあなた:`);
    const prompt = `${this.promptBase}${dialog.join("")}`;
    const data = JSON.stringify({
      prompt,
      model: "text-curie-001",
      max_tokens: 40,
      temperature: 0.9,
      stop: "\n",
    });
    const apiResp = await fetch(`${this.baseUrl}/v1/completions`, {
      method: "POST",
      headers: this.headers,
      body: data,
    })
      .then((res): Promise<OpenAiApiResponse> => res.json())
      .catch((err) => {
        console.log(`OpenAI API error: ${err}`);
        return null;
      });
    console.log(`apiResp: ${JSON.stringify(apiResp)}`);
    if (!apiResp) return "";

    return apiResp.choices.map((choice) => choice.text.trim())[0];
  }
}
