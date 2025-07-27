import { formatCurrency } from "@/utils/format";
import React, { useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { BarChart, LineChart, PieChart, PopulationPyramid, RadarChart } from "react-native-gifted-charts";
import { ThemedText } from "./ThemedText";

interface ChartProps {
    chartType: 'pie' | 'pyramid' | 'bar' | 'radar' | 'line';
    data: {
        value: number,
        label?: string,
        text?: string
    }[]
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export default function ChartScreen({ chartType, data }: ChartProps) {
    const screenWidth = Dimensions.get('window').width;

    const chartData = useMemo(() =>
        data.map(d => ({
            value: d.value,
            text: d.label,
            color: getRandomColor(),
        })),
        [data]);

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
                        xAxisLabelTextStyle={{ color: 'white', fontSize: 10 }}
                        data={data} />
                )
            case 'line':
                return (
                    <LineChart areaChart
                        data={data}

                        width={screenWidth - 100}
                        startFillColor="rgb(46, 217, 255)"
                        startOpacity={0.8}
                        endFillColor="rgb(203, 241, 250)"
                        endOpacity={0.3}
                        color1="white"
                        dataPointsColor1="white"
                        yAxisIndicesColor="white"
                        xAxisColor="white"
                        yAxisTextStyle={{ color: 'white' }}
                        xAxisLabelTextStyle={{ color: 'white', fontSize: 10 }}
                    />
                )
            case 'pyramid':
                return (
                    <PopulationPyramid data={[{ left: 10, right: 12 }, { left: 9, right: 8 }]} />
                )
            case 'pie':
                return (
                    <View style={styles.container}>
                        <PieChart
                            strokeColor="white"
                            strokeWidth={2}
                            data={chartData}
                            innerCircleColor="#414141"
                            innerCircleBorderColor={'white'}
                        />
                        <View style={styles.legendContainer}>
                            {chartData.map((d, index) => (
                                <View key={index} style={styles.legendItem}>
                                    <View style={[styles.colorBox, { backgroundColor: d.color }]} />
                                    <ThemedText style={styles.legendLabel}>{d.text}: </ThemedText>
                                    <ThemedText style={styles.legendValue}>{formatCurrency(d.value)}</ThemedText>
                                </View>
                            ))}
                        </View>
                    </View>
                )
            case 'radar':
                return (
                    <RadarChart data={[50, 80, 90, 70]} />
                )
            default:
                return (
                    <PieChart
                        strokeColor="white"
                        strokeWidth={4}
                        donut
                        data={data}
                        innerCircleColor="#414141"
                        innerCircleBorderWidth={4}
                        innerCircleBorderColor={'white'}
                        showValuesAsLabels={true}
                        showText
                        textSize={14}

                    />
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
        alignItems: 'center'
    },
    legendContainer: {
        flexDirection: 'row', // deixa os itens em linha
        flexWrap: 'wrap', // permite quebrar linha se não couber
        justifyContent: 'center',
        marginTop: 24,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 8,
        marginVertical: 4,
    },
    colorBox: {
        width: 14,
        height: 14,
        borderRadius: 7,
        marginRight: 6,
        color: 'white'
    },
    legendLabel: {
        fontWeight: '600',
    },
    legendValue: {
        marginLeft: 4,
        color: '#555',
        fontWeight: 700
    }
});