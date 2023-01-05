import { OpenAiApiResponse } from "./types/openai";
import { Conversation } from "./types/tables";

export class OpenAI {
  private readonly headers: Record<string, string>;
  private readonly baseUrl = "https://api.openai.com";
  private readonly promptBase = `あなたは日本語や英語などの語学に堪能な通訳スペシャリストとして振る舞ってください。この会話はあなたと私の間で行われるものです。あなたの反応とあなたの意見と私にとって有益な情報を教えてください。\n\n`;

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
      return `私: ${record.my_message}\nあなた: ${record.bot_message}\n`;
    });
    dialog.push(`私: ${message}\nあなた:`);
    const prompt = `${this.promptBase}${dialog.join("")}`;
    const data = JSON.stringify({
      prompt,
      model: "text-davinci-003",
      max_tokens: 500,
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
