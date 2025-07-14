import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link } from 'expo-router';
import { Image, StyleSheet, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <View style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <Image
          source={require('@/assets/images/404.avif')} // Add a 404 illustration or animation here
          style={styles.image}
          resizeMode="contain"
        />
        <ThemedText type="title" style={styles.title}>
          Page Not Found
        </ThemedText>
        <ThemedText type="default" style={styles.subtitle}>
          The page you’re looking for doesn’t exist or has been moved.
        </ThemedText>
        <Link href="/(tabs)/home" style={styles.link}>
          <ThemedText type="link" style={{ color: '#fff' }}>
            Go back to Home
          </ThemedText>
        </Link>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  link: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#093FB4',
    borderRadius: 8,
  },
});
