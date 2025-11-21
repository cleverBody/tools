import { useState } from 'react';
import { ListFilter, Copy, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Textarea } from '../components/ui/Textarea';
import { useToast } from '../contexts/ToastContext';

export function DeduplicateTool() {
    const [input, setInput] = useState('');
    const [caseSensitive, setCaseSensitive] = useState(false);
    const [preserveOrder, setPreserveOrder] = useState(true);
    const { showToast } = useToast();

    const clearAll = () => {
        setInput('');
    };

    const deduplicate = () => {
        if (!input.trim()) return '';

        const lines = input.split('\n');
        let unique: string[];

        if (preserveOrder) {
            const seen = new Set<string>();
            unique = lines.filter(line => {
                const key = caseSensitive ? line : line.toLowerCase();
                if (seen.has(key)) {
                    return false;
                }
                seen.add(key);
                return true;
            });
        } else {
            const uniqueSet = new Set(
                lines.map(line => (caseSensitive ? line : line.toLowerCase()))
            );
            unique = Array.from(uniqueSet);
            if (!caseSensitive) {
                // 恢复原始大小写
                const lineMap = new Map<string, string>();
                lines.forEach(line => {
                    const key = line.toLowerCase();
                    if (!lineMap.has(key)) {
                        lineMap.set(key, line);
                    }
                });
                unique = unique.map(key => lineMap.get(key) || key);
            }
        }

        return unique.join('\n');
    };

    const output = deduplicate();
    const originalLines = input.split('\n').filter(l => l.trim()).length;
    const uniqueLines = output.split('\n').filter(l => l.trim()).length;
    const removedLines = originalLines - uniqueLines;

    const copyOutput = () => {
        navigator.clipboard.writeText(output);
        showToast('已复制去重结果');
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">文本去重</h2>
                    <p className="text-muted-foreground">删除文本中的重复行。</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={clearAll} title="清空">
                        <Trash2 className="w-4 h-4 mr-2" />
                        清空
                    </Button>
                </div>
            </div>

            <div className="flex gap-4 flex-wrap">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={caseSensitive}
                        onChange={(e) => setCaseSensitive(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm">区分大小写</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={preserveOrder}
                        onChange={(e) => setPreserveOrder(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm">保持原始顺序</span>
                </label>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="shadow-md">
                    <CardHeader className="bg-muted/30 border-b pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <ListFilter className="w-5 h-5" />
                            输入文本
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <Textarea
                            className="min-h-[400px] font-mono resize-y text-sm"
                            placeholder="每行输入一条内容..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        {input && (
                            <div className="mt-3 text-sm text-muted-foreground">
                                共 {originalLines} 行
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="shadow-md">
                    <CardHeader className="bg-muted/30 border-b pb-4 flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">去重结果</CardTitle>
                        {output && (
                            <Button variant="ghost" size="sm" onClick={copyOutput} className="h-8">
                                <Copy className="w-4 h-4 mr-2" />
                                复制
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent className="pt-6">
                        <Textarea
                            className="min-h-[400px] font-mono resize-y text-sm bg-muted/30"
                            readOnly
                            value={output}
                            placeholder="去重结果将显示在这里..."
                        />
                        {output && (
                            <div className="mt-3 space-y-1">
                                <div className="text-sm text-muted-foreground">
                                    去重后: {uniqueLines} 行
                                </div>
                                {removedLines > 0 && (
                                    <div className="text-sm text-green-600 dark:text-green-400">
                                        已删除 {removedLines} 行重复内容
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
