import { useHabit, HAT_ITEMS } from '@habitapp/shared';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Check, Lock, Zap } from 'lucide-react-native';
import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Alert } from 'react-native';

import { GlassSegmentedControl } from '../components/GlassSegmentedControl';
import { PetPreview, HatIcon } from '../components/PetPreview';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { LiquidGlass } from '../theme/theme';
import { RootStackParamList } from '../navigation/types';
import { CurrencyBadge } from '../components/badges/CurrencyBadge';

const { width } = Dimensions.get('window');

const CATEGORIES = ['Hats', 'Glasses', 'Outfits'];

export const ShopScreen = () => {
    const { pet, buyItem, equipHat } = useHabit();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const router = useRouter();
    const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Shop',
            headerLeft: () => (
                <View style={{ paddingHorizontal: 16, justifyContent: 'center' }}>
                    <CurrencyBadge amount={pet?.xp || 0} size="md" />
                </View>
            ),
            headerRight: () => (
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{ paddingHorizontal: 16, justifyContent: 'center', alignItems: 'flex-end', minWidth: 60 }}
                    accessibilityLabel="Close shop"
                    accessibilityRole="button"
                >
                    <Text style={{ color: '#fff', fontSize: LiquidGlass.typography.size.headline, fontWeight: '600' }}>
                        Done
                    </Text>
                </TouchableOpacity>
            ),
        });
    }, [navigation, router, pet?.xp]);

    if (!pet) return null;

    const handleBuy = async (item: (typeof HAT_ITEMS)[0]) => {
        if ((pet.xp || 0) < item.price) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert('Not Enough XP', `You need ${item.price - (pet.xp || 0)} more XP!`);
            return;
        }

        Alert.alert('Purchase Item', `Buy ${item.name} for ${item.price} XP?`, [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Buy',
                onPress: async () => {
                    const success = await buyItem(item.id, item.price);
                    if (success) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                },
            },
        ]);
    };

    const handleEquip = (itemId: string) => {
        Haptics.selectionAsync();
        equipHat(itemId);
    };

    const renderContent = () => {
        if (selectedCategoryIndex === 0) {
            // HATS
            return (
                <View style={styles.grid}>
                    {HAT_ITEMS.map((item) => {
                        const isOwned = pet?.inventory?.includes(item.id) || item.id === 'none';
                        const isEquipped = pet?.hat === item.id || (item.id === 'none' && !pet?.hat);
                        const canAfford = (pet?.xp || 0) >= item.price;

                        return (
                            <TouchableOpacity
                                key={item.id}
                                style={[
                                    styles.card,
                                    isEquipped && styles.cardEquipped,
                                    !isOwned && !canAfford && styles.cardLocked,
                                ]}
                                onPress={() => {
                                    if (isOwned && !isEquipped) handleEquip(item.id);
                                    else if (!isOwned) handleBuy(item);
                                }}
                                activeOpacity={0.8}
                                accessibilityLabel={`${item.name}, ${isEquipped ? 'equipped' : isOwned ? 'owned, tap to equip' : `${item.price} XP to buy`}`}
                                accessibilityRole="button"
                            >
                                <HatIcon type={item.id} />
                                <Text style={styles.itemName} numberOfLines={1}>
                                    {item.name}
                                </Text>

                                {/* Action / Price */}
                                <View style={styles.actionContainer}>
                                    {isEquipped ? (
                                        <View style={styles.badgeEquipped}>
                                            <Check size={10} color="#000" strokeWidth={3} />
                                            <Text style={styles.badgeText}>On</Text>
                                        </View>
                                    ) : isOwned ? (
                                        <View style={styles.badgeOwned}>
                                            <Text style={[styles.badgeText, { color: '#fff' }]}>Owned</Text>
                                        </View>
                                    ) : (
                                        <View style={styles.priceContainer}>
                                            <Zap
                                                size={10}
                                                color={
                                                    canAfford ? LiquidGlass.colors.currency : 'rgba(255,255,255,0.4)'
                                                }
                                                fill={canAfford ? LiquidGlass.colors.currency : 'none'}
                                            />
                                            <Text
                                                style={[
                                                    styles.priceText,
                                                    !canAfford && { color: 'rgba(255,255,255,0.4)' },
                                                ]}
                                            >
                                                {item.price}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            );
        }

        // COMING SOON placeholders
        return (
            <View style={styles.emptyState}>
                <Text style={styles.emptyText}>Coming Soon...</Text>
                <Text style={styles.emptySubtext}>Check back later for more items!</Text>
            </View>
        );
    };

    return (
        <ScreenWrapper keyboardAvoiding isModal contentContainerStyle={styles.content}>
            {/* Live Pet Preview */}
            <View style={styles.previewSection}>
                <PetPreview color={pet.color} hat={pet.hat || 'none'} mood={pet.mood} />
            </View>

            {/* Category Switcher */}
            <View style={styles.tabContainer}>
                <GlassSegmentedControl
                    values={CATEGORIES}
                    selectedIndex={selectedCategoryIndex}
                    onChange={(event) => {
                        setSelectedCategoryIndex(event.nativeEvent.selectedSegmentIndex);
                        Haptics.selectionAsync();
                    }}
                />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {renderContent()}
            </ScrollView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    previewSection: {
        marginBottom: 20,
        height: 180,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabContainer: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        // paddingHorizontal: 20, // Removed to avoid double padding with ScreenWrapper
    },
    card: {
        width: Math.floor((width - 40 - 24) / 3),
        backgroundColor: LiquidGlass.colors.card,
        borderRadius: 16,
        padding: LiquidGlass.spacing.md,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: LiquidGlass.colors.border,
        aspectRatio: 0.8,
        justifyContent: 'space-between',
    },
    cardEquipped: {
        borderColor: LiquidGlass.colors.success,
        backgroundColor: 'rgba(52, 199, 89, 0.1)', // Match success color 0.1
    },
    cardLocked: {
        opacity: 0.6,
    },
    itemName: {
        fontSize: LiquidGlass.typography.size.caption2,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.9)',
        marginTop: 8,
        textAlign: 'center',
    },
    actionContainer: {
        marginTop: 'auto',
        width: '100%',
        alignItems: 'center',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    priceText: {
        fontSize: LiquidGlass.typography.size.caption1,
        fontWeight: '700',
        color: LiquidGlass.colors.currency,
    },
    badgeEquipped: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: LiquidGlass.colors.success,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 4,
    },
    badgeOwned: {
        backgroundColor: LiquidGlass.colors.surfaceHighlight,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    badgeText: {
        fontSize: LiquidGlass.typography.size.micro,
        fontWeight: '700',
        color: '#000',
    },
    emptyState: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        color: '#fff',
        fontSize: LiquidGlass.typography.size.headline,
        fontWeight: '600',
        marginBottom: 8,
    },
    emptySubtext: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: LiquidGlass.typography.size.subheadline,
    },
});
