import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: "black",
    width: "60%",
    borderRadius: 3,
    alignSelf: 'center',
    paddingHorizontal: 5,
  },
  row: {
    flexDirection: 'row',
    marginLeft: 20,
    marginTop: 10,
    alignSelf: 'center',
    width: "80%",
  },
  text: {
    width: "40%",
    alignSelf: 'center'
  }
});

function millisecondsToText(timeInMilliseconds) {
  let min = 0;
  let seconds = timeInMilliseconds / 1000;
  while (seconds >= 60) {
    min++;
    seconds -= 60;
  }
  return (min < 10 ? "0"+min : min) + ":" + (seconds < 10 ? "0"+seconds : seconds);
};

function textToMilliseconds(timeInText) {
  [min, seconds] = timeInText.split(":");
  return (min*60 + seconds)*1000;
}

function validateTimeText(timeInText) {
  return /^[0-9][0-9]:[0-9][0-9]$/.test(timeInText);
}

function areAllValid(workTime, shortBreakTime, longBreakTime) {
  return validateTimeText(workTime) && validateTimeText(shortBreakTime) && validateTimeText(longBreakTime);
}

/* Used functions here to test out useState() */
export default function Settings({ navigation, route }) {
  // times are in minutes
  const [workTime, setWorkTime] = useState(millisecondsToText(route.params.workTime));
  const [shortBreakTime, setShortBreak] = useState(millisecondsToText(route.params.shortBreakTime));
  const [longBreakTime, setLongBreak] = useState(millisecondsToText(route.params.longBreakTime));

  return (    
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.text}>Work Time: </Text>
        <TextInput 
        style={styles.input}
        onChangeText={workTime => setWorkTime(workTime)}
        defaultValue={workTime}
        keyboardType="numeric" />
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>Short Break Time: </Text>
        <TextInput 
          style={styles.input}
          onChangeText={shortBreakTime => setShortBreak(shortBreakTime)}
          defaultValue={shortBreakTime}
          keyboardType="numeric"/>
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>Long Break Time: </Text>
        <TextInput 
          style={styles.input}
          onChangeText={longBreakTime => setLongBreak(longBreakTime)}
          defaultValue={longBreakTime}
          keyboardType="numeric"/>
      </View>
      <View style={[styles.row, {justifyContent: 'center'}]}>
        <Button 
          title="Save Changes" 
          onPress={() => navigation.goBack()}
          disabled={!areAllValid(workTime, shortBreakTime, longBreakTime)} />
      </View>
      
    </View>
  );
  
}