export class T2I {
    url: string;
    api_key: string;
    model: string;

    constructor(url: string, api_key: string, model: string) {
        this.url = url;
        this.api_key = api_key;
        this.model = model;
    }

    async generate(prompt: string, image_url: string) {
        const generate_request = await (await fetch(`${this.url}/services/aigc/multimodal-generation/generation`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.api_key}`
            },
            body: JSON.stringify({
                model: this.model,
                input: {
                    messages: [
                        {
                            role: "user",
                            content: [
                                {
                                    text: prompt
                                },
                                {
                                    image: image_url
                                }
                            ]
                        }
                    ]
                },
                parameters: {
                    n: 1,
                    "size": "768*768"
                }
            })
        })).json();
        if (!Object.prototype.hasOwnProperty.call(generate_request, 'output')) {
            throw new Error('Image generation failed', generate_request);
        }
        return generate_request.output.choices[0].message.content[0].image;
    }
}
export const useT2I = () => {
    return new T2I("/dashscope/api/v1", "API_KEY_REMOVED", "wan2.6-image");
}