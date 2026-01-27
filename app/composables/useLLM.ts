export class Message {
    role: string;
    content: string;
    constructor(role: string, content: string) {
        this.role = role;
        this.content = content;
    }
}
export class LLM {
    url: URL;
    api_key: string;
    model: string;
    constructor(url: URL, api_key: string, model: string) {
        this.url = url;
        this.api_key = api_key;
        this.model = model;
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
    return new LLM(<URL>URL.parse("https://api.siliconflow.cn/v1"), "API_KEY_REMOVED", "deepseek-ai/DeepSeek-V3");
}