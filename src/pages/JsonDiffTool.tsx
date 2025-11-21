import { useState, useMemo } from 'react';
import { FileText, Trash2, GitCompare, Copy } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Textarea } from '../components/ui/Textarea';
import { useToast } from '../contexts/ToastContext';
import * as Diff from 'diff';

export function JsonDiffTool() {
    const [json1, setJson1] = useState('');
    const [json2, setJson2] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { showToast } = useToast();

    const clearAll = () => {
        setJson1('');
        setJson2('');
        setError(null);
    };

    const diff = useMemo(() => {
        if (!json1 && !json2) return [];

        try {
            const formatted1 = json1.trim() ? JSON.stringify(JSON.parse(json1), null, 2) : '';
            const formatted2 = json2.trim() ? JSON.stringify(JSON.parse(json2), null, 2) : '';

            // 如果两个 JSON 完全相同，返回空数组
            if (formatted1 === formatted2) {
                setError(null);
                return [];
            }

            setError(null);
            return Diff.diffLines(formatted1, formatted2);
        } catch (err) {
            setError((err as Error).message);
            return [];
        }
    }, [json1, json2]);

    const copyDiffResult = () => {
        if (diff.length === 0) {
            showToast('没有差异内容可复制');
            return;
        }

        const diffText = diff.map(part => part.value).join('');
        navigator.clipboard.writeText(diffText);
        showToast('差异结果已复制到剪贴板');
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">JSON 对比</h2>
                    <p className="text-muted-foreground">比较两个 JSON 对象的差异，自动格式化并高亮显示不同之处。</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={clearAll} title="清空所有">
                        <Trash2 className="w-4 h-4 mr-2" />
                        清空
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="shadow-md">
                    <CardHeader className="bg-muted/30 border-b pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            JSON 1
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <Textarea
                            className="min-h-[300px] font-mono resize-y text-sm"
                            placeholder='输入第一个 JSON... 例如: {"name": "张三", "age": 25}'
                            value={json1}
                            onChange={(e) => setJson1(e.target.value)}
                        />
                    </CardContent>
                </Card>

                <Card className="shadow-md">
                    <CardHeader className="bg-muted/30 border-b pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            JSON 2
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <Textarea
                            className="min-h-[300px] font-mono resize-y text-sm"
                            placeholder='输入第二个 JSON... 例如: {"name": "李四", "age": 30}'
                            value={json2}
                            onChange={(e) => setJson2(e.target.value)}
                        />
                    </CardContent>
                </Card>
            </div>

            {(json1 || json2) && (
                <Card className="shadow-md">
                    <CardHeader className="bg-muted/30 border-b pb-4 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <GitCompare className="w-5 h-5" />
                            差异结果
                        </CardTitle>
                        {!error && diff.length > 0 && (
                            <Button variant="ghost" size="sm" onClick={copyDiffResult} className="h-8">
                                <Copy className="w-4 h-4 mr-2" />
                                复制
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent className="pt-6">
                        {error ? (
                            <div className="p-4 bg-destructive/5 text-destructive font-mono text-sm whitespace-pre-wrap rounded-lg">
                                <div className="flex items-center gap-2 font-bold mb-2">
                                    <div className="w-2 h-2 rounded-full bg-destructive" />
                                    解析错误
                                </div>
                                {error}
                            </div>
                        ) : (
                            <>
                                <div className="font-mono text-sm whitespace-pre-wrap break-words bg-muted/30 p-4 rounded-lg max-h-[500px] overflow-auto">
                                    {diff.length === 0 ? (
                                        <div className="text-center text-muted-foreground py-8">
                                            两个 JSON 完全相同
                                        </div>
                                    ) : (
                                        diff.map((part, index) => (
                                            <span
                                                key={index}
                                                className={
                                                    part.added
                                                        ? 'bg-green-500/20 text-green-700 dark:text-green-300'
                                                        : part.removed
                                                            ? 'bg-red-500/20 text-red-700 dark:text-red-300 line-through'
                                                            : ''
                                                }
                                            >
                                                {part.value}
                                            </span>
                                        ))
                                    )}
                                </div>
                                <div className="mt-4 flex gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-green-500/20 border border-green-500/50 rounded" />
                                        <span className="text-muted-foreground">新增内容</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-red-500/20 border border-red-500/50 rounded" />
                                        <span className="text-muted-foreground">删除内容</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
