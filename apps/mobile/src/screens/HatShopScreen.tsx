import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, FlatList } from 'react-native';
import { useHabit, HAT_ITEMS } from '@habitapp/shared';
import { LiquidGlass } from '../theme/theme';
import { useNavigation } from '@react-navigation/native';
import { Zap, ArrowLeft, Check } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';

export const HatShopScreen = () => {
    const { pet, buyItem, equipHat } = useHabit();
    const navigation = useNavigation();
    const router = useRouter();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    const handleBack = () => {
        router.back();
    };

    const handleBuy = async (item: typeof HAT_ITEMS[0]) => {
        if (!pet) return;

        if (pet.xp < item.price) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert('Not Enough XP', `You need ${item.price - pet.xp} more XP to buy this!`);
            return;
        }

        Alert.alert(
            'Purchase Hat',
            `Buy ${item.name} for ${item.price} XP?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Buy',
                    onPress: async () => {
                        const success = await buyItem(item.id, item.price);
                        if (success) {
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                            // Auto equip? Maybe just unlock.
                        }
                    }
                }
            ]
        );
    };

    const handleEquip = (itemId: string) => {
        Haptics.selectionAsync();
        equipHat(itemId);
    };

    const renderItem = ({ item }: { item: typeof HAT_ITEMS[0] }) => {
        const isOwned = pet?.inventory?.includes(item.id) || item.id === 'none';
        const isEquipped = pet?.hat === item.id || (item.id === 'none' && !pet?.hat);
        const canAfford = (pet?.xp || 0) >= item.price;

        return (
            <View style={styles.cardContainer}>
                <View style={[styles.card, isEquipped && styles.equippedCard]}>
                    <View style={styles.iconContainer}>
                        <Text style={styles.icon}>{item.icon}</Text>
                    </View>
                    <Text style={styles.itemName}>{item.name}</Text>

                    {isOwned ? (
                        <TouchableOpacity
                            style={[
                                styles.button,
                                isEquipped ? styles.equippedButton : styles.equipButton
                            ]}
                            onPress={() => !isEquipped && handleEquip(item.id)}
                            activeOpacity={isEquipped ? 1 : 0.7}
                        >
                            {isEquipped ? (
                                <View style={styles.buttonContent}>
                                    <Check size={14} color="#fff" />
                                    <Text style={styles.buttonText}>Equipped</Text>
                                </View>
                            ) : (
                                <Text style={styles.buttonText}>Equip</Text>
                            )}
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={[
                                styles.button,
                                canAfford ? styles.buyButton : styles.lockedButton
                            ]}
                            onPress={() => handleBuy(item)}
                            activeOpacity={canAfford ? 0.7 : 1}
                        >
                            <View style={styles.buttonContent}>
                                <Zap size={12} color="#1a1a1a" fill="#1a1a1a" />
                                <Text style={[styles.buttonText, { color: '#1a1a1a' }]}>
                                    {item.price}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <ArrowLeft size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Hat Shop</Text>

                {/* XP Balance Pill */}
                <View style={styles.balancePill}>
                    <Zap size={14} color="#facc15" fill="#facc15" />
                    <Text style={styles.balanceText}>{pet?.xp || 0}</Text>
                </View>
            </View>

            <FlatList
                data={HAT_ITEMS}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                numColumns={2}
                contentContainerStyle={styles.gridContent}
                columnWrapperStyle={styles.columnWrapper}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: LiquidGlass.backgroundColor,
        paddingTop: 60,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 24,
        gap: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#fff',
        flex: 1,
    },
    balancePill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(250, 204, 21, 0.15)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
        borderWidth: 1,
        borderColor: 'rgba(250, 204, 21, 0.3)',
    },
    balanceText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#facc15',
    },
    gridContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    cardContainer: {
        width: '48%',
        marginBottom: 16,
    },
    card: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 24,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    equippedCard: {
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderColor: 'rgba(34, 197, 94, 0.3)',
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    icon: {
        fontSize: 40,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 12,
    },
    button: {
        width: '100%',
        paddingVertical: 10,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#fff',
    },
    buyButton: {
        backgroundColor: '#facc15',
    },
    lockedButton: {
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    equipButton: {
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    equippedButton: {
        backgroundColor: '#22c55e',
    },
});
