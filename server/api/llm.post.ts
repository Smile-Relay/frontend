export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  return proxyRequest(event, 'https://api.siliconflow.cn/v1/chat/completions', {
    headers: {
      Authorization: `Bearer ${config.siliconflowApiKey}`
    }
  })
})
