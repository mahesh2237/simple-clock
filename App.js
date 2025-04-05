import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Platform, FlatList, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import CurrentTimeDisplay from './components/CurrentTimeDisplay';
import { loadAlarmsFromStorage, saveAlarmsToStorage } from './util/alarms'

export default function App() {

  const [alarmTime, setAlarmTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [alarms, setAlarms] = useState([]);

  const onTimeChange = async (event, selectedTime) => {
    setShowPicker(false);
  
    if (event.type === 'set' && selectedTime) {
      const selectedISO = selectedTime.toISOString();
  
      // Check if same time already exists
      const index = alarms.findIndex(
        (alarm) => alarm.toISOString() === selectedISO
      );
  
      let updatedAlarms;
  
      if (index !== -1) {
        // Replace the existing time
        updatedAlarms = [...alarms];
        updatedAlarms[index] = selectedTime;
      } else {
        // Add as new alarm
        updatedAlarms = [...alarms, selectedTime];
      }
  
      setAlarmTime(selectedTime);
      setAlarms(updatedAlarms);
      await saveAlarmsToStorage(updatedAlarms);
    }
  };

  const addAlarm = () => {
    setAlarms((prev) => [...prev, alarmTime]);
  };

  const formatTime = (date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  useEffect(() => {
    const fetchAlarms = async () => {
      const storedAlarms = await loadAlarmsFromStorage();
      setAlarms(storedAlarms.map((time) => new Date(time)));
    };

    fetchAlarms();
  }, []);
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>

        <StatusBar style="light" />

        <CurrentTimeDisplay />


        <Text style={styles.title}>⏰ Alarms</Text>

        {/* <View style={styles.timeContainer}>
        <Text style={styles.timeText}>Selected Time:</Text>
        <Text style={styles.timeValue}>{alarmTime.toLocaleTimeString()}</Text>
      </View> */}

        {/* <Button title="Pick Alarm Time" onPress={() => setShowPicker(true)} /> */}



        {showPicker && (
          <DateTimePicker
            value={alarmTime}
            mode="time"
            is24Hour={false}
            display="default"
            onChange={onTimeChange}
          />
        )}

        <View style={styles.alarmBtnContainer}>

          <View>
            <Text style={styles.alarmListTitle}>Your Alarms</Text>
          </View>
          <View>
            <TouchableOpacity style={styles.addButton} onPress={() => setShowPicker(true)}>
              <Text style={styles.plusText}>+</Text>
            </TouchableOpacity>

          </View>

        </View>





        <FlatList
          data={alarms}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.alarmCard}>
              <Text style={styles.alarmTime}>{formatTime(item)}</Text>
            </View>
          )}
        />
      </SafeAreaView >
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    padding: 20,
    paddingTop: 50,
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 40,
    fontWeight: 'bold',
    color: '#fff'
  },
  timeContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  timeText: {
    fontSize: 18,
  },
  timeValue: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 5,
  },
  alarmCard: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android shadow
  },

  alarmTime: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
  },

  addButton: {
    alignSelf: 'flex-end',
    paddingRight: 20,
    marginVertical: 10,
  }
  ,
  plusText: {
    fontSize: 28,
    color: '#F7E1A1',
    fontWeight: 'bold',
  },

  alarmListTitle: {
    fontSize: 16,
    color: '#F7E1A1',
    fontWeight: 'bold',
  },

  alarmBtnContainer: {
  
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  }
});
