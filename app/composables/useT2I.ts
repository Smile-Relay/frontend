export class T2I {
    url: URL;
    model: string;

    constructor(url: URL, model: string) {
        this.url = url;
        this.model = model;
    }

    async generate(prompt: string, image_url: string) {
        const generate_request = await (await fetch(this.url.toString(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
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
    return new T2I(new URL("/api/t2i", window.location.href), "wan2.6-image");
}