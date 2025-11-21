import { useState, useEffect } from 'react';
import { format, fromUnixTime, getUnixTime } from 'date-fns';
import { Clock, ArrowRightLeft, Copy } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

export function TimeTool() {
    const [now, setNow] = useState(new Date());
    const [timestampInput, setTimestampInput] = useState('');
    const [dateInput, setDateInput] = useState('');
    const [conversionResult, setConversionResult] = useState<string | null>(null);

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleTimestampConvert = () => {
        try {
            const ts = parseInt(timestampInput);
            if (isNaN(ts)) throw new Error('Invalid timestamp');
            // Handle milliseconds vs seconds
            const date = ts > 10000000000 ? new Date(ts) : fromUnixTime(ts);
            setConversionResult(format(date, 'yyyy-MM-dd HH:mm:ss'));
        } catch {
            setConversionResult('Invalid Timestamp');
        }
    };

    const handleDateConvert = () => {
        try {
            const date = new Date(dateInput);
            if (isNaN(date.getTime())) throw new Error('Invalid date');
            setConversionResult(getUnixTime(date).toString());
        } catch {
            setConversionResult('Invalid Date');
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">时间转换</h2>
                    <p className="text-muted-foreground">时间戳与日期格式相互转换。</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Current Time Card */}
                <Card className="md:col-span-2 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 shadow-md">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-medium text-primary flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            当前时间
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                            <div className="p-6 bg-background/80 backdrop-blur rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                                <div className="text-sm text-muted-foreground mb-2 font-medium">Unix 时间戳 (秒)</div>
                                <div className="text-3xl font-mono font-bold tracking-tight text-foreground">{getUnixTime(now)}</div>
                            </div>
                            <div className="p-6 bg-background/80 backdrop-blur rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                                <div className="text-sm text-muted-foreground mb-2 font-medium">Unix 时间戳 (毫秒)</div>
                                <div className="text-3xl font-mono font-bold tracking-tight text-foreground">{now.getTime()}</div>
                            </div>
                            <div className="p-6 bg-background/80 backdrop-blur rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                                <div className="text-sm text-muted-foreground mb-2 font-medium">UTC 时间</div>
                                <div className="text-xl font-mono font-bold tracking-tight text-foreground mb-1">{now.toISOString().split('T')[0]}</div>
                                <div className="text-sm font-mono text-muted-foreground">{now.toISOString().split('T')[1].split('.')[0]}Z</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Timestamp to Date */}
                <Card className="shadow-md">
                    <CardHeader className="bg-muted/30 border-b pb-4">
                        <CardTitle className="text-lg">时间戳转日期</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <div className="space-y-3">
                            <label className="text-sm font-medium leading-none">Unix 时间戳</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="例如：1679812345"
                                    value={timestampInput}
                                    onChange={(e) => {
                                        setTimestampInput(e.target.value);
                                        setConversionResult(null);
                                    }}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 font-mono"
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">支持秒 (10位) 或毫秒 (13位) 时间戳。</p>
                        </div>
                        <Button onClick={handleTimestampConvert} className="w-full shadow-sm">
                            <ArrowRightLeft className="w-4 h-4 mr-2" />
                            转换为日期
                        </Button>
                        {conversionResult && !dateInput && (
                            <div className="mt-4 p-4 bg-muted/50 rounded-lg border flex items-center justify-between group animate-in fade-in slide-in-from-top-2">
                                <span className="font-mono font-medium text-foreground">{conversionResult}</span>
                                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(conversionResult)} className="h-8 w-8">
                                    <Copy className="w-4 h-4" />
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Date to Timestamp */}
                <Card className="shadow-md">
                    <CardHeader className="bg-muted/30 border-b pb-4">
                        <CardTitle className="text-lg">日期转时间戳</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <div className="space-y-3">
                            <label className="text-sm font-medium leading-none">日期时间</label>
                            <input
                                type="datetime-local"
                                value={dateInput}
                                onChange={(e) => {
                                    setDateInput(e.target.value);
                                    setConversionResult(null);
                                }}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 font-mono"
                            />
                        </div>
                        <Button onClick={handleDateConvert} className="w-full shadow-sm">
                            <ArrowRightLeft className="w-4 h-4 mr-2" />
                            转换为时间戳
                        </Button>
                        {conversionResult && !timestampInput && (
                            <div className="mt-4 p-4 bg-muted/50 rounded-lg border flex items-center justify-between group animate-in fade-in slide-in-from-top-2">
                                <span className="font-mono font-medium text-foreground">{conversionResult}</span>
                                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(conversionResult)} className="h-8 w-8">
                                    <Copy className="w-4 h-4" />
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

