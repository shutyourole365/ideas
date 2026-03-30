import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const PLATFORMS = [
  'GitHub', 'Vercel', 'Netlify', 'Stripe', 'Supabase',
  'Bolt', 'Google Cloud', 'Claude', 'Datadog', 'Sentry',
  'Linear', 'Auth0', 'Slack', 'SendGrid', 'AWS',
  'DigitalOcean', 'MongoDB', 'Redis', 'Plausible', 'Segment', 'Vault'
];

export default function HomeScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filteredPlatforms, setFilteredPlatforms] = useState(PLATFORMS);

  useEffect(() => {
    if (search) {
      setFilteredPlatforms(
        PLATFORMS.filter(p => p.toLowerCase().includes(search.toLowerCase()))
      );
    } else {
      setFilteredPlatforms(PLATFORMS);
    }
  }, [search]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="🔍 Search platforms..."
        value={search}
        onChangeText={setSearch}
        placeholderTextColor="#999"
      />

      <Text style={styles.countText}>{filteredPlatforms.length}/{PLATFORMS.length} platforms</Text>

      <ScrollView style={styles.platformList}>
        {filteredPlatforms.map(platform => (
          <TouchableOpacity key={platform} style={styles.platformButton}>
            <Text style={styles.platformText}>{platform}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => router.push('/settings')}
      >
        <Text style={styles.settingsButtonText}>⚙️ Settings</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  searchInput: {
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 12,
    fontSize: 16,
  },
  countText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
  },
  platformList: {
    flex: 1,
  },
  platformButton: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  platformText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  settingsButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  settingsButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
