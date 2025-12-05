import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { X, Check } from 'lucide-react-native';
import { Pet } from '@habitapp/shared';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

interface PetStyleModalProps {
    visible: boolean;
    onClose: () => void;
    pet: Pet;
    onUpdate: (updates: Partial<Pet>) => void;
}

const COLORS = [
    '#ef4444', // Red
    '#f97316', // Orange
    '#f59e0b', // Amber
    '#eab308', // Yellow
    '#84cc16', // Lime
    '#22c55e', // Green
    '#10b981', // Emerald
    '#06b6d4', // Cyan
    '#0ea5e9', // Sky
    '#3b82f6', // Blue
    '#6366f1', // Indigo
    '#8b5cf6', // Violet
    '#a855f7', // Purple
    '#d946ef', // Fuchsia
    '#ec4899', // Pink
    '#f43f5e', // Rose
];

export const PetStyleModal = ({ visible, onClose, pet, onUpdate }: PetStyleModalProps) => {
    const [name, setName] = useState(pet.name);
    const [selectedColor, setSelectedColor] = useState(pet.color);

    const handleSave = () => {
        onUpdate({ name, color: selectedColor });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        onClose();
    };

    const handleColorSelect = (color: string) => {
        setSelectedColor(color);
        Haptics.selectionAsync();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.overlay}
            >
                <BlurView intensity={40} tint="dark" style={styles.blurContainer}>
                    <View style={styles.modalContent}>
                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.title}>Style Pet</Text>
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <X size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        {/* Name Input */}
                        <View style={styles.section}>
                            <Text style={styles.label}>NAME</Text>
                            <TextInput
                                style={styles.input}
                                value={name}
                                onChangeText={setName}
                                placeholder="Pet Name"
                                placeholderTextColor="rgba(255,255,255,0.3)"
                                maxLength={20}
                            />
                        </View>

                        {/* Color Picker */}
                        <View style={styles.section}>
                            <Text style={styles.label}>COLOR</Text>
                            <View style={styles.colorGrid}>
                                {COLORS.map((color) => (
                                    <TouchableOpacity
                                        key={color}
                                        style={[
                                            styles.colorDot,
                                            { backgroundColor: color },
                                            selectedColor === color && styles.selectedColor
                                        ]}
                                        onPress={() => handleColorSelect(color)}
                                    >
                                        {selectedColor === color && <Check size={16} color="#fff" strokeWidth={3} />}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Save Button */}
                        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                            <Text style={styles.saveButtonText}>Save Changes</Text>
                        </TouchableOpacity>
                    </View>
                </BlurView>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    blurContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#1c1c1e',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        paddingBottom: 40,
        gap: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: '#fff',
    },
    closeButton: {
        padding: 4,
    },
    section: {
        gap: 12,
    },
    label: {
        fontSize: 12,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.5)',
        letterSpacing: 0.5,
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 16,
        padding: 16,
        fontSize: 18,
        color: '#fff',
        fontWeight: '600',
    },
    colorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    colorDot: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedColor: {
        borderColor: '#fff',
        transform: [{ scale: 1.1 }],
    },
    saveButton: {
        backgroundColor: '#fff',
        padding: 18,
        borderRadius: 20,
        alignItems: 'center',
        marginTop: 12,
    },
    saveButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '700',
    },
});
