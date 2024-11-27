import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
//import './index.css'
import vkBridge, { parseURLSearchParamsForGetLaunchParams } from '@vkontakte/vk-bridge'
import { useAppearance, useInsets, useAdaptivity } from '@vkontakte/vk-bridge-react'
import { Platform, ConfigProvider, AdaptivityProvider, AppRoot } from '@vkontakte/vkui'
import { transformVKBridgeAdaptivity } from './transformers/transformVKBridgeAdaptivity.ts'

vkBridge.send('VKWebAppInit')

const RootWrapper = () => {
  const vkBridgeAppearance = useAppearance() || undefined
  const vkBridgeInsets = useInsets() || undefined
  const vkBridgeAdaptivityProps = transformVKBridgeAdaptivity(useAdaptivity())
  const { vk_platform } = parseURLSearchParamsForGetLaunchParams(window.location.search)

  return (
    <ConfigProvider
      appearance={vkBridgeAppearance}
      platform={vk_platform === 'desktop_web' ? 'vkcom' : undefined}
      isWebView={vkBridge.isWebView()}
      hasCustomPanelHeaderAfter={true} 
    >
      <AdaptivityProvider {...vkBridgeAdaptivityProps}>
        <AppRoot mode="full" safeAreaInsets={vkBridgeInsets}>
          <App />
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootWrapper />
  </StrictMode>,
)
