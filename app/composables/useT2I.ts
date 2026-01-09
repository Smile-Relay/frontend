export class LLM {
    url: string;
    api_key: string;
    model: string;
    minimum_size: string;
    constructor(url: string, api_key: string, model: string) {
        this.url = url;
        this.api_key = api_key;
        this.model = model;
        this.minimum_size = ['wan2.6-t2i', 'wan2.5-t2i-preview'].includes(model)? "768*768" : "512*512";
    }
    private async generate_old(prompt: string) {
        const generate_request = await (await fetch(`${this.url}/text2image/image-synthesis`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.api_key}`,
                'X-DashScope-Async': 'enable'
            },
            body: JSON.stringify({
                model: this.model,
                input: {
                    prompt: prompt
                },
                parameters: {
                    size: this.minimum_size,
                    prompt_extend: false,
                    n: 1
                }
            })
        })).json();
        if (!generate_request.hasOwnProperty('output')) {
            throw new Error('Image generation failed', generate_request);
        }
        const task_id = generate_request.output.task_id;
         while (true) {
             const task_status = await (await fetch(`${this.url}/tasks/${task_id}`, {
                headers: {
                    'Authorization': `Bearer ${this.api_key}`
                }
             })).json()
             if (!task_status.hasOwnProperty('output')) {
                 throw new Error('Image generation failed', task_status);
             }
             if (!task_status.output.finished) {
                 await new Promise((resolve) =>
                     {
                         setTimeout(resolve, 500)
                     }
                 );
                 continue;
             }
             if (task_status.output.task_status === 'SUCCEEDED') {
                 return task_status.output.choices[0].message.content[0].image;
             }
             if (task_status.output.task_status === 'FAILED') {
                 throw new Error('Image generation failed',task_status);
             }
        }
    }
    private async generate_new(prompt: string) {
        const generate_request = await (await fetch(`${this.url}/text2image/image-synthesis`, {
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
                                }
                            ]
                        }
                    ]
                },
                parameters: {
                    size: this.minimum_size,
                    prompt_extend: false,
                    n: 1
                }
            })
        })).json();
        if (!generate_request.hasOwnProperty('output')) {
            throw new Error('Image generation failed', generate_request);
        }
        return generate_request.output.choices[0].message.content[0].image;
    }

    async generate(prompt: string) {
        if (this.model === 'wan2.6-t2i') {
            return await this.generate_new(prompt);
        }
        return await this.generate_old(prompt);
    }
    async completions(messages: Message[], stream: boolean = false){
        return await fetch(`${this.url}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.api_key}`
            },
            body: JSON.stringify({
                model: this.model,
                messages: messages,
                stream: stream
            })
        })
    }
}
export const useLLM = () => {
    return new LLM("https://api.siliconflow.cn/v1", "API_KEY_REMOVED", "deepseek-ai/DeepSeek-V3");
}