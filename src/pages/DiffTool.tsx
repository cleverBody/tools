import { useState } from 'react';
import { FileText, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Textarea } from '../components/ui/Textarea';
import * as Diff from 'diff';

export function DiffTool() {
    const [text1, setText1] = useState('');
    const [text2, setText2] = useState('');
    const [diffMode, setDiffMode] = useState<'lines' | 'words' | 'chars'>('lines');

    const clearAll = () => {
        setText1('');
        setText2('');
    };

    const getDiff = () => {
        if (!text1 && !text2) return [];

        switch (diffMode) {
            case 'words':
                return Diff.diffWords(text1, text2);
            case 'chars':
                return Diff.diffChars(text1, text2);
            default:
                return Diff.diffLines(text1, text2);
        }
    };

    const diff = getDiff();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">文本对比</h2>
                    <p className="text-muted-foreground">比较两段文本的差异，支持逐行、逐词、逐字符对比。</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={clearAll} title="清空所有">
                        <Trash2 className="w-4 h-4 mr-2" />
                        清空
                    </Button>
                </div>
            </div>

            <div className="flex gap-2 mb-4">
                <Button
                    variant={diffMode === 'lines' ? 'default' : 'outline'}
                    onClick={() => setDiffMode('lines')}
                    size="sm"
                >
                    逐行对比
                </Button>
                <Button
                    variant={diffMode === 'words' ? 'default' : 'outline'}
                    onClick={() => setDiffMode('words')}
                    size="sm"
                >
                    逐词对比
                </Button>
                <Button
                    variant={diffMode === 'chars' ? 'default' : 'outline'}
                    onClick={() => setDiffMode('chars')}
                    size="sm"
                >
                    逐字符对比
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="shadow-md">
                    <CardHeader className="bg-muted/30 border-b pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            原始文本
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <Textarea
                            className="min-h-[300px] font-mono resize-y text-sm"
                            placeholder="输入原始文本..."
                            value={text1}
                            onChange={(e) => setText1(e.target.value)}
                        />
                    </CardContent>
                </Card>

                <Card className="shadow-md">
                    <CardHeader className="bg-muted/30 border-b pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            对比文本
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <Textarea
                            className="min-h-[300px] font-mono resize-y text-sm"
                            placeholder="输入对比文本..."
                            value={text2}
                            onChange={(e) => setText2(e.target.value)}
                        />
                    </CardContent>
                </Card>
            </div>

            {(text1 || text2) && (
                <Card className="shadow-md">
                    <CardHeader className="bg-muted/30 border-b pb-4">
                        <CardTitle className="text-lg">差异结果</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="font-mono text-sm whitespace-pre-wrap break-words bg-muted/30 p-4 rounded-lg max-h-[500px] overflow-auto">
                            {diff.length === 0 ? (
                                <div className="text-center text-muted-foreground py-8">
                                    两段文本完全相同
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
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
