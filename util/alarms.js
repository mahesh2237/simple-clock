const saveAlarmsToStorage = async (alarms) => {
    try {
      const jsonValue = JSON.stringify(alarms);
      await AsyncStorage.setItem('@alarms', jsonValue);
    } catch (e) {
      console.error('Failed to save alarms:', e);
    }
  };
  
  const loadAlarmsFromStorage = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@alarms');
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error('Failed to load alarms:', e);
      return [];
    }
  };
  