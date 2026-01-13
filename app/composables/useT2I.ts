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
        const generate_request = await (await fetch(`${this.url}/services/aigc/image2image/image-synthesis`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.api_key}`,
                'X-DashScope-Async': 'enable'
            },
            body: JSON.stringify({
                model: this.model,
                input: {
                    function: 'control_cartoon_feature',
                    base_image_url: image_url,
                    prompt: prompt
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
            if (task_status.output.task_status === "RUNNING") {
                await new Promise((resolve) =>
                    {
                        setTimeout(resolve, 500)
                    }
                );
                continue;
            }
            if (task_status.output.task_status === 'SUCCEEDED') {
                return task_status.output.results[0].url;
            }
            if (task_status.output.task_status === 'FAILED') {
                throw new Error('Image generation failed',task_status);
            }
        }
    }
}
export const useT2I = () => {
    return new T2I("/dashscope/api/v1", "API_KEY_REMOVED", "wanx2.1-imageedit");
}