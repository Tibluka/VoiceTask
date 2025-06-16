import React, { useState } from 'react';
import { useColorScheme, useWindowDimensions } from 'react-native';
import { SceneMap, TabView } from 'react-native-tab-view';

import { Footer } from '@/components/Footer';
import AudioRecorder from '@/components/recorder';
import ProfileScreen from './ProfileScreen';

const renderScene = SceneMap({
    chat: AudioRecorder,
    profile: ProfileScreen,
});

export default function MainTabs() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const layout = useWindowDimensions();

    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'chat', title: 'Chat' },
        { key: 'profile', title: 'Perfil' },
    ]);

    return (
        <>
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
                swipeEnabled
                renderTabBar={() => null}
            />
            <Footer selectedIndex={index} onTabPress={setIndex} />
        </>
    );
}