import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button, Vibration } from 'react-native';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const WORK_TIME = 1*30*1000; // in milliseconds
const SHORT_BREAK_TIME = 1*10*1000;
const LONG_BREAK_TIME = 1*20*1000;

const Time = props => (
  <View style={styles.verticalSpacing}>
    <Text style={{fontSize: 80}}>{props.time}</Text>
  </View>
)

function CurrentSession(props) {
  switch (props.session) {
    case sessions.WORK:
      return <Text>Time to work hard!</Text>
    case sessions.SHORT_BREAK:
      return <Text>Time for a short break!</Text>
    case sessions.LONG_BREAK:
      return <Text>Rest up! Time for a long break.</Text>
  }
}

// enum for session type
const sessions = {
  WORK: 0,
  SHORT_BREAK: 1,
  LONG_BREAK: 2,
};

export default class App extends React.Component {
  state = {
    timeLeft: WORK_TIME,
    session: sessions.WORK, 
    timer: null, 
    pomodoros: 0,
    breaksTaken: 0, 
  };

  // starts timer and when timer ends, updates session and timeLeft
  startTimer = () => {
    console.log("starting")
    this.state.timer = setInterval(
      () => {
        if (this.state.timeLeft >= 1000) 
          this.setState(prevState => ({timeLeft: prevState.timeLeft - 1000}));
        else { // timer finished
          Vibration.vibrate(1000);
          this.nextSession(true);
        }
      }
    , 1000);
  };

  stopTimer = () => {
    clearInterval(this.state.timer);
    console.log("stopping...");
  }

  resetTimer = () => {
    this.stopTimer();
    let timeToResetTo = 0;
    switch (this.state.session) {
      case sessions.WORK:
        timeToResetTo = WORK_TIME;
        break;
      case sessions.SHORT_BREAK:
        timeToResetTo = SHORT_BREAK_TIME;
        break;
      case sessions.LONG_BREAK:
        timeToResetTo = LONG_BREAK_TIME;
        break;
    }
    this.setState({timeLeft: timeToResetTo});
    console.log("resetting...");
  }

  skipSession = () => {    
    this.stopTimer();
    this.nextSession(false);
  }

  nextSession = (didSessionComplete) => {
    if (this.state.session !== sessions.WORK) // if current session is break, then next session is work
      this.setState({session: sessions.WORK, timeLeft: WORK_TIME});
    else {
      /* Callback has to be used here if not checking for every 4th break will run before breaksTaken finishes updating */
      this.setState({breaksTaken: this.state.breaksTaken + 1}, () => {
        if (didSessionComplete) // successfully ended a work session, increment pomodoro count
          this.setState({pomodoros: this.state.pomodoros + 1}); 
        // every 4th break should be a long one
        if (this.state.breaksTaken % 4 === 0 && this.state.breaksTaken !== 0)
          this.setState({session: sessions.LONG_BREAK, timeLeft: LONG_BREAK_TIME});
        else {
          this.setState({session: sessions.SHORT_BREAK, timeLeft: SHORT_BREAK_TIME});        
        }
      });
    }
  }

  // returns time in mm:ss format
  getTime = () => {
    let min = 0;
    let seconds = this.state.timeLeft / 1000;
    while (seconds >= 60) {
      min++;
      seconds -= 60;
    }
    return (min < 10 ? "0"+min : min) + ":" + (seconds < 10 ? "0"+seconds : seconds);
  };

  render() {
    return (
      <View style={styles.container}>
        <Time time={this.getTime()} />    
        <View style={styles.verticalSpacing}><CurrentSession session={this.state.session} /></View>    
        <View style={[styles.row, styles.verticalSpacing]}>
          <View style={styles.controlButton}>
            <Button title="Start" onPress={this.startTimer} />
          </View>      
          <View style={styles.controlButton}>
            <Button title="Stop" onPress={this.stopTimer} />  
          </View>              
        </View>      
        <View style={[styles.row, styles.verticalSpacing]}>
          <View style={styles.controlButton}>
            <Button title="Reset" onPress={this.resetTimer} />
          </View>  
          <View style={styles.controlButton}>
            <Button title="Skip" onPress={this.skipSession} />
          </View>
        </View>  
        <Text style={styles.verticalSpacing}>Completed Pomodoros: {this.state.pomodoros}</Text>
        <StatusBar style="auto" />
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verticalSpacing: {
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignSelf: 'stretch',
  },
  controlButton: {
    width: 100,
  },
});
