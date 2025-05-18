import { SafeAreaView, StyleSheet } from 'react-native';
import AudioRecorderExample from '../components/recorder';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <AudioRecorderExample />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
});
