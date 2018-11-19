import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Linking, Button } from 'react-native';
window.navigator.userAgent = 'react-native';
var io = require('socket.io-client/dist/socket.io');

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

var logSocket = io('https://logdataingest.riverway.in/astro/logs?app=' + 'location' + '&user=Maya' );
// logSocket.emit('log.info', { errorCode: 8024, errorMessage:'Map init function is initialized' });
// OR
// logSocket.emit('log.error', { errorCode: 403, errorMessage: 'Error Message Text', data: { pseudoName: currentUser.pseudoName,sessionid: sessID } });
type Props = {};
// let logSocket = "";

export default class App extends Component<Props> {
  state = {
    lat: "",
    long: "",
    counter: 0
  }

  constructor() {
    super();
  }
  componentDidMount() {
    let success = (position) => {
      this.setState({
        lat: position.coords.latitude,
        long: position.coords.longitude
      })
      logSocket.emit('log.info', { errorCode: 9898, errorMessage:'Map init function is initialized' });
    }
    let error = (errors) => {
      logSocket.emit('log.error', { errorCode: 9989, errorMessage: 'Error Message Text', data: { pseudoName: "maya",sessionid:0 } });
    }

    setInterval(() => {
      navigator.geolocation.getCurrentPosition(success, error)
      this.setState((prestate) => {
        return { counter: prestate.counter + 1 }
      })
    }, 1000)

  }

  openMap(lat, lng) {
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${lat},${lng}`;

    const label = 'Your Current Location';
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });

    Linking.openURL(url);
  }

  render() {

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>counter: {this.state.counter}</Text>
        <Text style={styles.welcome}>Current Coordinates</Text>
        <Text style={styles.welcome}>Latitude: {this.state.lat}</Text>
        <Text style={styles.welcome}>Longitude: {this.state.long}</Text>
        <Button
          onPress={() => {
            this.openMap(this.state.lat, this.state.long)
          }}
          title="Open Maps"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
