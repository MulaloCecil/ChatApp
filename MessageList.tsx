import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { ref, onValue } from 'firebase/database';
import { database } from './firebaseConfig'; // Import the database reference
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  MessageView: { message: Message };
};

type Message = {
  id: string;
  message: string;
  senderID: string;
  timestamp: string;
};

type ApiResponse = {
  statusCode: string;
  statusMessage: string;
  supportMessage: string;
  transactionId: string;
};

type MessageListNavigationProp = StackNavigationProp<RootStackParamList, 'MessageView'>;

const MessageList = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<ApiResponse | null>(null);
  const navigation = useNavigation<MessageListNavigationProp>(); // Get navigation object

  useEffect(() => {
    const messagesRef = ref(database, 'chats');
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messageArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setMessages(messageArray);
      } else {
        setMessages([]);
      }
    });

    return unsubscribe;
  }, []);

  const handlePress = (message: Message) => {
    navigation.navigate('MessageView', { message });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePress(item)}>
            <View style={styles.messageContainer}>
              <Text>{item.message}</Text>
              <Text>{item.timestamp}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      {error && (
        <View style={styles.errorContainer}>
          <Text>{error.statusMessage}</Text>
          <Text>{error.supportMessage}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageContainer: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
  },
  errorContainer: {
    backgroundColor: '#ffcdd2',
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
  },
});

export default MessageList;