const ADJECTIVES = [
    "干净的",
    "吵闹的",
    "普通的",
    "忙碌的",
    "老旧的",
    "新买的",
    "冰凉的",
    "温热的",
    "随手的",
    "偏暗的",
    "结实的",
    "空着的",
    "慢慢的",
    "随意的",
    "熟悉的",
    "顺滑的"
] as const

const NOUNS = [
    "桌子",
    "椅子",
    "手机",
    "钥匙",
    "杯子",
    "书包",
    "门",
    "窗户",
    "披萨",
    "面包",
    "巧克力",
    "水果盘",
    "蛋糕",
    "咖啡杯",
    "雨伞",
    "笔记本"
] as const

type Adjective = typeof ADJECTIVES[number]
type Noun = typeof NOUNS[number]

export const vocabularies = {
    adjectives: ADJECTIVES as unknown as Adjective[],
    nouns: NOUNS as unknown as Noun[],
} as const