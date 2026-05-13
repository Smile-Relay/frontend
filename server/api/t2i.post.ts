export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  return proxyRequest(event, 'https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation', {
    headers: {
      Authorization: `Bearer ${config.dashscopeApiKey}`
    }
  })
})
