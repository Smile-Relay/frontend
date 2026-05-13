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
    model: string;
    constructor(url: URL, model: string) {
        this.url = url;
        this.model = model;
    }
    async completions(messages: Message[], stream: boolean = false){
        return await fetch(this.url.toString(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
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
    return new LLM(new URL("/api/llm", window.location.href), "deepseek-ai/DeepSeek-V3");
}