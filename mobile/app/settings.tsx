import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const PLATFORMS = [
  { key: 'github', label: 'GitHub Token' },
  { key: 'vercel', label: 'Vercel Token' },
  { key: 'stripe', label: 'Stripe API Key' },
  { key: 'datadog', label: 'Datadog API Key' },
  { key: 'sentry', label: 'Sentry Token' },
  { key: 'linear', label: 'Linear Token' },
  { key: 'slack', label: 'Slack Token' },
  { key: 'aws_key', label: 'AWS Access Key' },
  { key: 'digitalocean', label: 'DigitalOcean Token' },
  { key: 'plausible', label: 'Plausible Token' },
];

export default function SettingsScreen() {
  const [tokens, setTokens] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTokens();
  }, []);

  const loadTokens = async () => {
    try {
      const loaded: Record<string, string> = {};
      for (const { key } of PLATFORMS) {
        const token = await SecureStore.getItemAsync(key);
        if (token) loaded[key] = token;
      }
      setTokens(loaded);
    } catch (error) {
      console.error('Failed to load tokens:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveToken = async (key: string, value: string) => {
    try {
      await SecureStore.setItemAsync(key, value);
      setTokens(prev => ({ ...prev, [key]: value }));
    } catch (error) {
      console.error('Failed to save token:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Add API Tokens</Text>
      <Text style={styles.description}>
        Tokens are stored securely using device encryption
      </Text>

      {PLATFORMS.map(({ key, label }) => (
        <View key={key} style={styles.tokenInput}>
          <Text style={styles.label}>{label}</Text>
          <TextInput
            style={styles.input}
            placeholder={`Enter ${label}`}
            value={tokens[key] || ''}
            onChangeText={value => saveToken(key, value)}
            secureTextEntry={true}
            editable={true}
          />
        </View>
      ))}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          ✨ Tokens auto-save using secure storage
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  tokenInput: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  footer: {
    marginTop: 40,
    paddingVertical: 16,
    borderTopColor: '#ddd',
    borderTopWidth: 1,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
});
