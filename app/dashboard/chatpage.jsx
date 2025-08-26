import { StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';

const ChatPage = () => {
  const [modalVisible, setModalVisible] = useState(false);

  // Show modal on first load
  useEffect(() => {
    setModalVisible(true);
  }, []);

  const handlePayNow = () => {
    // You can navigate to payment page or handle payment logic
    setModalVisible(false);
    alert('Redirecting to payment...');
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chat Page</Text>

      {/* Payment Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Payment Required</Text>
            <Text style={styles.modalText}>
              You haven't paid yet. Please pay to continue chatting.
            </Text>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.payButton} onPress={handlePayNow}>
                <Text style={styles.buttonText}>Pay Now</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ChatPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  payButton: {
    backgroundColor: '#2d1e3f',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: 'gray',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
