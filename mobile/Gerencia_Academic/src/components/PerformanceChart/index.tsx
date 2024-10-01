import React from 'react';
import { View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const PerformanceChart: React.FC<{ data: number[] }> = ({ data }) => {
    return (
        <View>
            <BarChart
                data={{
                    labels: ['Matéria A', 'Matéria B', 'Matéria C'],
                    datasets: [
                        {
                            data,
                        },
                    ],
                }}
                width={400}
                height={220}
                yAxisLabel=""
                chartConfig={{
                    backgroundColor: '#fff',
                    backgroundGradientFrom: '#fff',
                    backgroundGradientTo: '#fff',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                        borderRadius: 16,
                    },
                }}
                style={{
                    marginVertical: 8,
                    borderRadius: 16,
                }}
            />
        </View>
    );
};

export default PerformanceChart;
