import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { BarChart, LineChart, PieChart, PopulationPyramid, RadarChart } from "react-native-gifted-charts";

interface ChartProps {
    chartType: 'pie' | 'pyramid' | 'bar' | 'radar' | 'line';
    data: {
        value: number,
        label?: string
    }[]
}


export default function ChartScreen({ chartType, data }: ChartProps) {
    const screenWidth = Dimensions.get('window').width;

    const renderChartType = () => {
        switch (chartType) {
            case 'bar':
                return (
                    <BarChart
                        noOfSections={3}
                        barBorderRadius={4}
                        frontColor={'#177AD5'}
                        barWidth={32}
                        width={screenWidth - 100}
                        yAxisTextStyle={{ color: 'white' }}
                        xAxisLabelTextStyle={{ color: 'white' }}
                        rotateLabel={true}
                        data={data} />
                )
            case 'line':
                return (
                    <LineChart areaChart
                        data={data}
                        startFillColor="rgb(46, 217, 255)"
                        startOpacity={0.8}
                        endFillColor="rgb(203, 241, 250)"
                        endOpacity={0.3}
                        color1="white" />
                )
            case 'pyramid':
                return (
                    <PopulationPyramid data={[{ left: 10, right: 12 }, { left: 9, right: 8 }]} />
                )
            case 'pie':
                return (
                    <PieChart showText
                        textColor="white"
                        textSize={20}
                        showTextBackground
                        textBackgroundRadius={26}
                        data={data} />
                )
            case 'radar':
                return (
                    <RadarChart data={[50, 80, 90, 70]} />
                )
            default:
                return (
                    <PieChart showText
                        textColor="black"
                        radius={150}
                        textSize={20}
                        showTextBackground
                        textBackgroundRadius={26}
                        data={data} />
                )
        }
    }

    return (
        <View style={styles.container}>
            {renderChartType()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    }
});