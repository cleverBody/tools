import { useState, useEffect } from 'react';
import { Regex, Trash2, Info } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Textarea } from '../components/ui/Textarea';

export function RegexTool() {
    const [pattern, setPattern] = useState('');
    const [flags, setFlags] = useState('gm');
    const [text, setText] = useState('');
    const [matches, setMatches] = useState<string[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!pattern) {
            setMatches([]);
            setError('');
            return;
        }

        try {
            const regex = new RegExp(pattern, flags);
            const found = text.match(regex);
            setMatches(found || []);
            setError('');
        } catch (e) {
            setError((e as Error).message);
            setMatches([]);
        }
    }, [pattern, flags, text]);

    const clearAll = () => {
        setPattern('');
        setText('');
        setMatches([]);
        setError('');
    };

    const commonPatterns = [
        { name: 'Email', pattern: '[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}' },
        { name: 'URL', pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)' },
        { name: 'IPv4', pattern: '\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b' },
        { name: 'Date (YYYY-MM-DD)', pattern: '\\d{4}-\\d{2}-\\d{2}' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">正则测试</h2>
                    <p className="text-muted-foreground">实时测试正则表达式匹配。</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={clearAll} title="清空所有">
                        <Trash2 className="w-4 h-4 mr-2" />
                        清空
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="shadow-md">
                        <CardHeader className="bg-muted/30 border-b pb-4">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Regex className="w-5 h-5" />
                                正则表达式
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <div className="flex gap-2">
                                <div className="flex-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-muted-foreground font-mono">/</span>
                                    </div>
                                    <input
                                        type="text"
                                        value={pattern}
                                        onChange={(e) => setPattern(e.target.value)}
                                        placeholder="输入正则表达式..."
                                        className="flex h-10 w-full rounded-md border border-input bg-background pl-6 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 font-mono"
                                    />
                                </div>
                                <div className="w-24 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-muted-foreground font-mono">/</span>
                                    </div>
                                    <input
                                        type="text"
                                        value={flags}
                                        onChange={(e) => setFlags(e.target.value)}
                                        placeholder="flags"
                                        className="flex h-10 w-full rounded-md border border-input bg-background pl-6 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 font-mono"
                                    />
                                </div>
                            </div>
                            {error && (
                                <div className="text-sm text-destructive flex items-center gap-2">
                                    <Info className="w-4 h-4" />
                                    {error}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="shadow-md">
                        <CardHeader className="bg-muted/30 border-b pb-4">
                            <CardTitle className="text-lg">测试文本</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <Textarea
                                className="min-h-[200px] font-mono resize-y"
                                placeholder="在此输入测试文本..."
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="shadow-md">
                        <CardHeader className="bg-muted/30 border-b pb-4">
                            <CardTitle className="text-lg">匹配结果</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {matches.length > 0 ? (
                                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                    <div className="text-sm text-muted-foreground mb-2">找到 {matches.length} 个匹配项:</div>
                                    {matches.map((match, index) => (
                                        <div key={index} className="p-2 bg-muted/50 rounded border font-mono text-sm break-all">
                                            {match}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-muted-foreground py-8">
                                    {pattern && text ? '未找到匹配项' : '输入正则和文本开始测试'}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="shadow-md">
                        <CardHeader className="bg-muted/30 border-b pb-4">
                            <CardTitle className="text-lg">常用正则</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-2">
                                {commonPatterns.map((item) => (
                                    <button
                                        key={item.name}
                                        onClick={() => setPattern(item.pattern)}
                                        className="w-full text-left p-2 hover:bg-muted rounded transition-colors text-sm flex flex-col gap-1 group"
                                    >
                                        <span className="font-medium text-foreground">{item.name}</span>
                                        <span className="font-mono text-xs text-muted-foreground truncate group-hover:text-primary transition-colors">
                                            {item.pattern}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
