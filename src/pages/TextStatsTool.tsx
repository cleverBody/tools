import { useState } from 'react';
import { BarChart3, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Textarea } from '../components/ui/Textarea';

export function TextStatsTool() {
    const [text, setText] = useState('');

    const clearAll = () => {
        setText('');
    };

    const getStats = () => {
        if (!text) {
            return {
                characters: 0,
                charactersNoSpaces: 0,
                words: 0,
                lines: 0,
                paragraphs: 0,
                sentences: 0,
                readingTime: 0,
            };
        }

        const characters = text.length;
        const charactersNoSpaces = text.replace(/\s/g, '').length;
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        const lines = text.split('\n').length;
        const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim()).length;
        const sentences = text.split(/[.!?。！？]+/).filter(s => s.trim()).length;
        const readingTime = Math.ceil(words / 200); // 假设每分钟阅读200字

        return {
            characters,
            charactersNoSpaces,
            words,
            lines,
            paragraphs,
            sentences,
            readingTime,
        };
    };

    const stats = getStats();

    const statItems = [
        { label: '字符数', value: stats.characters, icon: '📝' },
        { label: '字符数（不含空格）', value: stats.charactersNoSpaces, icon: '✏️' },
        { label: '单词/字数', value: stats.words, icon: '📖' },
        { label: '行数', value: stats.lines, icon: '📄' },
        { label: '段落数', value: stats.paragraphs, icon: '📋' },
        { label: '句子数', value: stats.sentences, icon: '💬' },
        { label: '阅读时间（分钟）', value: stats.readingTime, icon: '⏱️' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">文本统计</h2>
                    <p className="text-muted-foreground">统计文本的字符、单词、行数等信息。</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={clearAll} title="清空">
                        <Trash2 className="w-4 h-4 mr-2" />
                        清空
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 shadow-md">
                    <CardHeader className="bg-muted/30 border-b pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <BarChart3 className="w-5 h-5" />
                            输入文本
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <Textarea
                            className="min-h-[400px] font-mono resize-y text-sm"
                            placeholder="输入或粘贴文本进行统计..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    <Card className="shadow-md">
                        <CardHeader className="bg-muted/30 border-b pb-4">
                            <CardTitle className="text-lg">统计结果</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-3">
                            {statItems.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl">{item.icon}</span>
                                        <span className="text-sm text-muted-foreground">{item.label}</span>
                                    </div>
                                    <span className="text-lg font-bold">{item.value.toLocaleString()}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {text && (
                        <Card className="shadow-sm bg-primary/5">
                            <CardContent className="pt-4 text-center">
                                <p className="text-sm text-muted-foreground mb-1">预计阅读时间</p>
                                <p className="text-3xl font-bold text-primary">
                                    {stats.readingTime} <span className="text-lg">分钟</span>
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
