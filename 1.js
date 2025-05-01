({
    meta: { name: "Peer Connection Game", description: "Multiplayer game using PeerJS." },
    styles: { backgroundColor: "#f4f4f4", textColor: "#222", buttonColor: "#4CAF50", fontFamily: "Arial" },
    settingsSchema: {
      maxPlayers: { label: "Max Players", type: "slider", min: 1, max: 4, default: 2 },
      gameMode: { label: "Game Mode", type: "dropdown", options: ["Team", "Free-for-all"], default: "Free-for-all" }
    },
    initState: (settings, deps) => ({
      peerId: null, connectedPeers: [], gameState: 'waiting', 
      playerData: { score: 0, health: 100 }, maxPlayers: settings.maxPlayers, gameMode: settings.gameMode
    }),
    gameLogic: (state, setState, deps) => {
      if (state.connectedPeers.length === state.maxPlayers && state.gameState === 'waiting') {
        setState({ ...state, gameState: 'playing' });
      }
      if (state.gameState === 'playing') {
        setState(prev => ({
          ...prev,
          playerData: { ...prev.playerData, score: prev.playerData.score + 1 }
        }));
      }
    },
    renderGameUI: (state, setState, styles, deps) => (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: styles.backgroundColor }}>
        <Text style={{ fontSize: 24, color: styles.textColor }}>State: {state.gameState}</Text>
        <Text style={{ fontSize: 20, color: styles.textColor }}>Score: {state.playerData.score}</Text>
        <Text style={{ fontSize: 18, color: styles.textColor, marginTop: 20 }}>
          {deps.peerId ? `Your Peer ID: ${deps.peerId}` : "Connecting..."}
        </Text>
      </View>
    ),
    renderCustomizationUI: (settings, setSettings, styles, deps) => (
      <View style={{ padding: 20, backgroundColor: styles.backgroundColor }}>
        <Text style={{ fontSize: 20, color: styles.textColor, marginBottom: 10 }}>Customize Game</Text>
        <Text style={{ color: styles.textColor }}>Max Players: {settings.maxPlayers}</Text>
        <Slider minimumValue={1} maximumValue={4} step={1} value={settings.maxPlayers}
          onValueChange={(v) => setSettings(prev => ({ ...prev, maxPlayers: v }))} />
        <Text style={{ color: styles.textColor, marginTop: 10 }}>Game Mode:</Text>
        <Picker selectedValue={settings.gameMode}
          onValueChange={(v) => setSettings(prev => ({ ...prev, gameMode: v }))}>
          {["Team", "Free-for-all"].map(mode => (
            <Picker.Item key={mode} label={mode} value={mode} />
          ))}
        </Picker>
      </View>
    ),
    startGame: (settings, deps) => {
      const peer = new Peer(undefined, { host: '0.peerjs.com', port: 443, path: '/', secure: true, debug: 2 });
      peer.on('open', (id) => { deps.setPeerId(id); });
      peer.on('connection', (conn) => { deps.setConnectedPeers(prev => [...prev, conn]); });
      peer.on('error', (err) => { console.error('PeerJS Error:', err); });
      deps.setPeer(peer);
    }
  })
