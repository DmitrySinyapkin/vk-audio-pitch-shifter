import { useContext } from 'react'
import { Root, View, Panel } from '@vkontakte/vkui'
import { PanelContext } from './context/PanelContext'
import MainPanel from './panels/MainPanel'
import PlayerPanel from './panels/PlayerPanel'

function App() {
  const { activePanel } = useContext(PanelContext)

  return (
    <Root activeView='main-view'>
      <View id="main-view" activePanel={activePanel}>
          <Panel id="main">
              <MainPanel />
          </Panel>
          <Panel id="player">
              <PlayerPanel />
          </Panel>
      </View>
    </Root>
  )
}

export default App
