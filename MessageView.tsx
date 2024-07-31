// MessageView.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, Image, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ref, onValue, push, set } from 'firebase/database';
import { database } from './firebaseConfig'; // Import the database reference

type RootStackParamList = {
  MessageView: { message: Message };
};

type Message = {
  id: string;
  message: string;
  senderID: string;
  timestamp: string;
};

type MessageViewProps = {
  route: RouteProp<RootStackParamList, 'MessageView'>;
  navigation: StackNavigationProp<RootStackParamList, 'MessageView'>;
};

const MessageView = ({ route, navigation }: MessageViewProps) => {
  const { message } = route.params;
  const [replyText, setReplyText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const messagesRef = ref(database, 'chats');
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      const messagesList: Message[] = data ? Object.values(data) : [];
      setMessages(messagesList);
    });

    return () => unsubscribe();
  }, []);

  const handleSendReply = useCallback(async () => {
    try {
      const messagesRef = ref(database, 'chats');
      const newMessageRef = push(messagesRef);
      await set(newMessageRef, {
        message: message.message,
        senderID: message.senderID,
        text: replyText,
        timestamp: new Date().toISOString(),
      });
      setReplyText('');
    } catch (error) {
      console.error('Error sending reply:', error);
      // Display a user-friendly error message or take other appropriate action
    }
  }, [replyText, message.senderID, message.message]);

  return (
    <View style={styles.container}>
      <View style={styles.messageContainer}>
        <View style={styles.messageContent}>
          <Text style={styles.senderName}>{message.senderID}</Text>
          <Text style={styles.messageText}>{message.message}</Text>
        </View>
      </View>
      <ScrollView style={styles.messagesContainer}>
        {messages.map((msg, index) => (
          <View key={index} style={styles.messageContainer}>
            <View style={styles.messageContent}>
              <Text style={styles.senderName}>{msg.senderID}</Text>
              <Text style={styles.messageText}>{msg.message}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.replyContainer}>
        <TextInput
          style={styles.replyInput}
          placeholder="Type your reply..."
          value={replyText}
          onChangeText={setReplyText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendReply}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  messageContainer: {
    flexDirection: 'row',
    padding: 16,
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 16,
  },
  messageContent: {
    flex: 1,
  },
  senderName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
  },
  messagesContainer: {
    flex: 1,
  },
  replyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f2f2f2',
  },
  replyInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#0077b6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default MessageView;