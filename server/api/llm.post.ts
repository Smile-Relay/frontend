export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  return proxyRequest(event, `${config.siliconflowBaseUrl}/chat/completions`, {
    headers: {
      Authorization: `Bearer ${config.siliconflowApiKey}`
    }
  })
})
