import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import type { ProfileData } from '@/app/screens/profileScreen/validation';

interface StatusOption {
  label: ProfileData['status'];
  color: string;
}

interface StatusSelectorProps {
  selected: ProfileData['status'];
  onSelect: (status: ProfileData['status']) => void;
  options: StatusOption[];
}

export const StatusSelector = ({ selected, onSelect, options }: StatusSelectorProps) => (
  <View style={styles.statusSelector}>
    {options.map((option) => (
      <TouchableOpacity
        key={option.label}
        style={[
          styles.statusOption,
          selected === option.label && styles.selectedStatus,
          { borderColor: option.color }
        ]}
        onPress={() => onSelect(option.label)}
      >
        <View style={[styles.statusDot, { backgroundColor: option.color }]} />
        <Text style={styles.statusOptionText}>{option.label}</Text>
      </TouchableOpacity>
    ))}
  </View>
);

const styles = StyleSheet.create({
  statusSelector: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: '#fff',
  },
  selectedStatus: {
    backgroundColor: '#f3f4f6',
  },
  statusOptionText: {
    fontSize: 12,
    color: '#4b5563',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
});