export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  return proxyRequest(event, `${config.dashscopeBaseUrl}/services/aigc/multimodal-generation/generation`, {
    headers: {
      Authorization: `Bearer ${config.dashscopeApiKey}`
    }
  })
})
