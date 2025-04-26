import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


export default function CustomTabBar({
    state,
    descriptors,
    navigation,
    handleAddButtonPress,
    handleNewChatPress,
    handleNewRecipePress,
    handleCloseMenu,
}: {
    state: any;
    descriptors: any;
    navigation: any;
    handleAddButtonPress: () => void;
    showAddMenu: boolean;
    handleNewChatPress: () => void;
    handleNewRecipePress: () => void;
    handleCloseMenu: () => void;
}) {
    return (
        <View style={styles.bottomNav}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label = options.title || route.name;
                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                // Special case for the middle "add" button
                if (index === 2) {
                    // Assuming the middle tab is at index 2
                    return (
                        <TouchableOpacity
                            key={route.key}
                            style={styles.navButton}
                            onPress={handleAddButtonPress}
                        >
                            <Ionicons name="add" size={26} color="#FFFFFF" />
                        </TouchableOpacity>
                    );
                }

                return (
                    
                    <TouchableOpacity
                        key={route.key}
                        style={styles.navItem}
                        onPress={onPress}
                    >
                        {options.tabBarIcon &&
                            options.tabBarIcon({
                                color: isFocused ? '#FE724C' : '#999999',
                                size: 24,
                            })}
                        <Text
                            style={[
                                styles.navText,
                                isFocused && styles.navTextActive,
                            ]}
                        >
                            {label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
        height: 65,
    },
    navItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    navText: {
        fontSize: 12,
        color: '#999999',
        marginTop: 4,
    },
    navTextActive: {
        color: '#FE724C',
    },
    navButton: {
        backgroundColor: '#FE724C',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
        shadowColor: '#FE724C',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 6,
    },
  
});
