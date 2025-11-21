import { useState } from 'react';
import { Binary, Copy } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useToast } from '../contexts/ToastContext';

export function BaseConverterTool() {
    const [input, setInput] = useState('');
    const [fromBase, setFromBase] = useState(10);
    const [error, setError] = useState('');
    const { showToast } = useToast();

    const convert = (toBase: number) => {
        try {
            if (!input.trim()) return '';
            const decimal = parseInt(input.trim(), fromBase);
            if (isNaN(decimal)) {
                throw new Error('Invalid input for the selected base');
            }
            return decimal.toString(toBase).toUpperCase();
        } catch (e) {
            setError((e as Error).message);
            return '';
        }
    };

    const results = [
        { base: 2, name: '二进制', value: convert(2) },
        { base: 8, name: '八进制', value: convert(8) },
        { base: 10, name: '十进制', value: convert(10) },
        { base: 16, name: '十六进制', value: convert(16) },
    ];

    const copyValue = (value: string, name: string) => {
        navigator.clipboard.writeText(value);
        showToast(`已复制${name}`);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">进制转换</h2>
                    <p className="text-muted-foreground">在二进制、八进制、十进制、十六进制之间转换。</p>
                </div>
            </div>

            <Card className="shadow-md">
                <CardHeader className="bg-muted/30 border-b pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Binary className="w-5 h-5" />
                        输入数值
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="flex gap-4 items-center">
                        <label className="text-sm font-medium">输入进制:</label>
                        <select
                            value={fromBase}
                            onChange={(e) => {
                                setFromBase(Number(e.target.value));
                                setError('');
                            }}
                            className="px-3 py-2 rounded border border-input bg-background"
                        >
                            <option value={2}>二进制 (Binary)</option>
                            <option value={8}>八进制 (Octal)</option>
                            <option value={10}>十进制 (Decimal)</option>
                            <option value={16}>十六进制 (Hexadecimal)</option>
                        </select>
                    </div>

                    <input
                        type="text"
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);
                            setError('');
                        }}
                        placeholder={`输入${fromBase}进制数值...`}
                        className="w-full px-4 py-3 rounded-lg border border-input bg-background font-mono text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />

                    {error && (
                        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                            {error}
                        </div>
                    )}
                </CardContent>
            </Card>

            {input && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.map((result) => (
                        <Card key={result.base} className="shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="py-3 bg-muted/10 border-b flex flex-row items-center justify-between">
                                <CardTitle className="text-sm font-medium">{result.name}</CardTitle>
                                {result.value && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => copyValue(result.value, result.name)}
                                        className="h-6 px-2"
                                    >
                                        <Copy className="w-3 h-3 mr-1" />
                                        复制
                                    </Button>
                                )}
                            </CardHeader>
                            <CardContent className="py-4">
                                <div className="font-mono text-2xl font-bold break-all">
                                    {result.value || '-'}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
