import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Platform } from 'react-native';
import { colors } from '../../theme';

interface DatePickerProps {
  visible: boolean;
  onClose: () => void;
  onSelectDate: (date: string) => void;
  selectedDate?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  visible,
  onClose,
  onSelectDate,
  selectedDate,
}) => {
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from({ length: 100 }, (_, i) => currentDate.getFullYear() - i);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handleDayPress = (day: number) => {
    setSelectedDay(day);
  };

  const handleConfirm = () => {
    if (selectedDay) {
      const formattedDate = `${selectedDay} ${months[selectedMonth].slice(0, 3)}, ${selectedYear}`;
      onSelectDate(formattedDate);
      onClose();
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
    const firstDay = getFirstDayOfMonth(selectedYear, selectedMonth);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.dayCell} />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = selectedDay === day;
      const isToday =
        day === currentDate.getDate() &&
        selectedMonth === currentDate.getMonth() &&
        selectedYear === currentDate.getFullYear();

      days.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.dayCell,
            isSelected && styles.selectedDay,
            isToday && !isSelected && styles.todayDay,
          ]}
          onPress={() => handleDayPress(day)}
        >
          <Text
            style={[
              styles.dayText,
              isSelected && styles.selectedDayText,
              isToday && !isSelected && styles.todayDayText,
            ]}
          >
            {day}
          </Text>
        </TouchableOpacity>
      );
    }

    return days;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.modalContainer} onStartShouldSetResponder={() => true}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Select Date</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <View>
            {/* Month and Year Selectors */}
            <View style={styles.selectorsContainer}>
              <View style={styles.selector}>
                <Text style={styles.selectorLabel}>Month</Text>
                <ScrollView
                  style={styles.selectorScroll}
                  showsVerticalScrollIndicator={false}
                  nestedScrollEnabled={true}
                  scrollEnabled={true}
                >
                  {months.map((month, index) => (
                    <TouchableOpacity
                      key={month}
                      style={[
                        styles.selectorOption,
                        selectedMonth === index && styles.selectorOptionSelected,
                      ]}
                      onPress={() => {
                        setSelectedMonth(index);
                        setSelectedDay(null);
                      }}
                    >
                      <Text
                        style={[
                          styles.selectorOptionText,
                          selectedMonth === index && styles.selectorOptionTextSelected,
                        ]}
                      >
                        {month}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.selector}>
                <Text style={styles.selectorLabel}>Year</Text>
                <ScrollView
                  style={styles.selectorScroll}
                  showsVerticalScrollIndicator={false}
                  nestedScrollEnabled={true}
                  scrollEnabled={true}
                >
                  {years.map((year) => (
                    <TouchableOpacity
                      key={year}
                      style={[
                        styles.selectorOption,
                        selectedYear === year && styles.selectorOptionSelected,
                      ]}
                      onPress={() => {
                        setSelectedYear(year);
                        setSelectedDay(null);
                      }}
                    >
                      <Text
                        style={[
                          styles.selectorOptionText,
                          selectedYear === year && styles.selectorOptionTextSelected,
                        ]}
                      >
                        {year}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            {/* Calendar Grid */}
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.calendarContainer}>
                <View style={styles.weekDaysContainer}>
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                    <Text key={index} style={styles.weekDayText}>
                      {day}
                    </Text>
                  ))}
                </View>
                <View style={styles.daysGrid}>{renderCalendar()}</View>
              </View>
            </ScrollView>
          </View>

          {/* Confirm Button */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.confirmButton, !selectedDay && styles.confirmButtonDisabled]}
              onPress={handleConfirm}
              disabled={!selectedDay}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxHeight: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  closeButton: {
    fontSize: 24,
    color: '#6B7280',
    fontWeight: '400',
  },
  selectorsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 12,
  },
  selector: {
    flex: 1,
  },
  selectorLabel: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  selectorScroll: {
    height: 150,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
  },
  selectorOption: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  selectorOptionSelected: {
    backgroundColor: colors.primary.DEFAULT,
  },
  selectorOptionText: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
  },
  selectorOptionTextSelected: {
    fontFamily: 'Manrope_600SemiBold',
    color: '#FFFFFF',
    fontWeight: '600',
  },
  calendarContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  weekDaysContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  weekDayText: {
    flex: 1,
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  selectedDay: {
    backgroundColor: colors.primary.DEFAULT,
    borderRadius: 8,
  },
  todayDay: {
    borderWidth: 2,
    borderColor: colors.primary.DEFAULT,
    borderRadius: 8,
  },
  dayText: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 14,
    color: '#374151',
  },
  selectedDayText: {
    fontFamily: 'Manrope_600SemiBold',
    color: '#FFFFFF',
    fontWeight: '600',
  },
  todayDayText: {
    fontFamily: 'Manrope_600SemiBold',
    color: colors.primary.DEFAULT,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  confirmButton: {
    backgroundColor: colors.primary.DEFAULT,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  confirmButtonText: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
