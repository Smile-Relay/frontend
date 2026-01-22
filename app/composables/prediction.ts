export type Prediction = {
    Angry: number,
    Disgust: number,
    Fear: number,
    Happy: number,
    Neutral: number,
    Sad: number,
    Surprise: number,
    Gender?: number
}
const emotionMap = {
    Angry: "😠生气",
    Disgust: "🤢厌恶",
    Fear: "😨恐惧",
    Happy: "😊开心",
    Neutral: "😐中性",
    Sad: "😢悲伤",
    Surprise: "😲惊讶"
} as const;

export type EmotionKey = keyof typeof emotionMap;

export const getChinese = (emotion: EmotionKey) => {
    return emotionMap[emotion];
}