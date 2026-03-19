import React, { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { AccountCard } from './AccountCard';
import { colors } from '../../../theme';

interface Account {
  id: string;
  accountName: string;
  accountNumber: string;
  availableBalance: number;
  actualBalance: number;
  isActive?: boolean;
}

interface AccountCarouselProps {
  accounts: Account[];
  onMakeDeposit?: () => void;
}

const CARD_WIDTH = 343;
const CARD_SPACING = 16;

export const AccountCarousel: React.FC<AccountCarouselProps> = ({ accounts, onMakeDeposit }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / (CARD_WIDTH + CARD_SPACING));
    setActiveIndex(index);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled={false}
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + CARD_SPACING}
        snapToAlignment="start"
        contentContainerStyle={styles.scrollContent}
      >
        {accounts.map((account, index) => (
          <View
            key={account.id}
            style={[
              styles.cardWrapper,
              index === 0 && styles.firstCard,
              index === accounts.length - 1 && styles.lastCard,
            ]}
          >
            <AccountCard
              accountName={account.accountName}
              accountNumber={account.accountNumber}
              availableBalance={account.availableBalance}
              actualBalance={account.actualBalance}
              isActive={account.isActive}
              onMakeDeposit={onMakeDeposit}
            />
          </View>
        ))}
      </ScrollView>

      {/* Pagination Dots */}
      {accounts.length > 1 && (
        <View style={styles.pagination}>
          {accounts.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === activeIndex && styles.activeDot,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingRight: 24,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    marginRight: CARD_SPACING,
  },
  firstCard: {},
  lastCard: {
    marginRight: 24,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
  },
  activeDot: {
    backgroundColor: colors.primary.DEFAULT,
    width: 24,
  },
});
