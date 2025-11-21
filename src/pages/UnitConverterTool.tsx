import { useState } from 'react';
import { Ruler } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

type UnitCategory = 'length' | 'weight' | 'temperature' | 'time';

const units = {
    length: [
        { name: '米 (m)', factor: 1 },
        { name: '千米 (km)', factor: 1000 },
        { name: '厘米 (cm)', factor: 0.01 },
        { name: '毫米 (mm)', factor: 0.001 },
        { name: '英里 (mi)', factor: 1609.34 },
        { name: '码 (yd)', factor: 0.9144 },
        { name: '英尺 (ft)', factor: 0.3048 },
        { name: '英寸 (in)', factor: 0.0254 },
    ],
    weight: [
        { name: '千克 (kg)', factor: 1 },
        { name: '克 (g)', factor: 0.001 },
        { name: '毫克 (mg)', factor: 0.000001 },
        { name: '吨 (t)', factor: 1000 },
        { name: '磅 (lb)', factor: 0.453592 },
        { name: '盎司 (oz)', factor: 0.0283495 },
    ],
    temperature: [
        {
            name: '摄氏度 (°C)', convert: (v: number, to: string) => {
                if (to === '华氏度 (°F)') return v * 9 / 5 + 32;
                if (to === '开尔文 (K)') return v + 273.15;
                return v;
            }
        },
        {
            name: '华氏度 (°F)', convert: (v: number, to: string) => {
                if (to === '摄氏度 (°C)') return (v - 32) * 5 / 9;
                if (to === '开尔文 (K)') return (v - 32) * 5 / 9 + 273.15;
                return v;
            }
        },
        {
            name: '开尔文 (K)', convert: (v: number, to: string) => {
                if (to === '摄氏度 (°C)') return v - 273.15;
                if (to === '华氏度 (°F)') return (v - 273.15) * 9 / 5 + 32;
                return v;
            }
        },
    ],
    time: [
        { name: '秒 (s)', factor: 1 },
        { name: '分钟 (min)', factor: 60 },
        { name: '小时 (h)', factor: 3600 },
        { name: '天 (d)', factor: 86400 },
        { name: '周 (week)', factor: 604800 },
    ],
};

export function UnitConverterTool() {
    const [category, setCategory] = useState<UnitCategory>('length');
    const [value, setValue] = useState('1');
    const [fromUnit, setFromUnit] = useState(0);
    const [toUnit, setToUnit] = useState(1);

    const convert = () => {
        const num = parseFloat(value);
        if (isNaN(num)) return '';

        const categoryUnits = units[category];

        if (category === 'temperature') {
            const from = categoryUnits[fromUnit] as any;
            const to = categoryUnits[toUnit] as any;
            if (fromUnit === toUnit) return num.toString();
            return from.convert(num, to.name).toFixed(4);
        } else {
            const from = categoryUnits[fromUnit] as any;
            const to = categoryUnits[toUnit] as any;
            const baseValue = num * from.factor;
            return (baseValue / to.factor).toFixed(6);
        }
    };

    const result = convert();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">单位换算</h2>
                    <p className="text-muted-foreground">常用单位之间的转换。</p>
                </div>
            </div>

            <div className="flex gap-2 flex-wrap">
                {(['length', 'weight', 'temperature', 'time'] as UnitCategory[]).map((cat) => (
                    <button
                        key={cat}
                        onClick={() => {
                            setCategory(cat);
                            setFromUnit(0);
                            setToUnit(1);
                        }}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${category === cat
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted hover:bg-muted/80'
                            }`}
                    >
                        {cat === 'length' && '长度'}
                        {cat === 'weight' && '重量'}
                        {cat === 'temperature' && '温度'}
                        {cat === 'time' && '时间'}
                    </button>
                ))}
            </div>

            <Card className="shadow-md">
                <CardHeader className="bg-muted/30 border-b pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Ruler className="w-5 h-5" />
                        单位转换
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">从</label>
                            <select
                                value={fromUnit}
                                onChange={(e) => setFromUnit(Number(e.target.value))}
                                className="w-full px-3 py-2 rounded border border-input bg-background"
                            >
                                {units[category].map((unit, index) => (
                                    <option key={index} value={index}>
                                        {unit.name}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="number"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-input bg-background font-mono text-lg"
                                placeholder="输入数值"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">到</label>
                            <select
                                value={toUnit}
                                onChange={(e) => setToUnit(Number(e.target.value))}
                                className="w-full px-3 py-2 rounded border border-input bg-background"
                            >
                                {units[category].map((unit, index) => (
                                    <option key={index} value={index}>
                                        {unit.name}
                                    </option>
                                ))}
                            </select>
                            <div className="w-full px-4 py-3 rounded-lg border border-input bg-muted/30 font-mono text-lg font-bold">
                                {result || '-'}
                            </div>
                        </div>
                    </div>

                    {result && (
                        <div className="p-4 bg-primary/5 rounded-lg text-center">
                            <p className="text-lg">
                                <span className="font-bold">{value}</span> {units[category][fromUnit].name} ={' '}
                                <span className="font-bold text-primary">{result}</span> {units[category][toUnit].name}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
