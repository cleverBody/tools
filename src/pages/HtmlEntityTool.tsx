import { useState } from 'react';
import { Code2, ArrowRightLeft, Copy } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Textarea } from '../components/ui/Textarea';
import { useToast } from '../contexts/ToastContext';

export function HtmlEntityTool() {
    const [input, setInput] = useState('');
    const [mode, setMode] = useState<'encode' | 'decode'>('encode');
    const { showToast } = useToast();

    const encode = (text: string) => {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/\//g, '&#x2F;');
    };

    const decode = (text: string) => {
        const textarea = document.createElement('textarea');
        textarea.innerHTML = text;
        return textarea.value;
    };

    const output = mode === 'encode' ? encode(input) : decode(input);

    const copyOutput = () => {
        navigator.clipboard.writeText(output);
        showToast('已复制结果');
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">HTML 实体编解码</h2>
                    <p className="text-muted-foreground">HTML 特殊字符与实体编码互转。</p>
                </div>
            </div>

            <div className="flex gap-2">
                <Button
                    variant={mode === 'encode' ? 'default' : 'outline'}
                    onClick={() => setMode('encode')}
                    size="sm"
                >
                    <ArrowRightLeft className="w-4 h-4 mr-2" />
                    编码
                </Button>
                <Button
                    variant={mode === 'decode' ? 'default' : 'outline'}
                    onClick={() => setMode('decode')}
                    size="sm"
                >
                    <ArrowRightLeft className="w-4 h-4 mr-2" />
                    解码
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="shadow-md">
                    <CardHeader className="bg-muted/30 border-b pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Code2 className="w-5 h-5" />
                            输入
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <Textarea
                            className="min-h-[300px] font-mono resize-y text-sm"
                            placeholder={mode === 'encode' ? '输入包含特殊字符的文本...' : '输入 HTML 实体编码...'}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                    </CardContent>
                </Card>

                <Card className="shadow-md">
                    <CardHeader className="bg-muted/30 border-b pb-4 flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">输出</CardTitle>
                        {output && (
                            <Button variant="ghost" size="sm" onClick={copyOutput} className="h-8">
                                <Copy className="w-4 h-4 mr-2" />
                                复制
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent className="pt-6">
                        <Textarea
                            className="min-h-[300px] font-mono resize-y text-sm bg-muted/30"
                            readOnly
                            value={output}
                            placeholder="结果将显示在这里..."
                        />
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-sm">
                <CardHeader className="bg-muted/30 border-b pb-3">
                    <CardTitle className="text-sm">常用 HTML 实体</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm font-mono">
                        <div className="p-2 bg-muted/30 rounded">
                            <span className="text-muted-foreground">&amp;</span> → &amp;amp;
                        </div>
                        <div className="p-2 bg-muted/30 rounded">
                            <span className="text-muted-foreground">&lt;</span> → &amp;lt;
                        </div>
                        <div className="p-2 bg-muted/30 rounded">
                            <span className="text-muted-foreground">&gt;</span> → &amp;gt;
                        </div>
                        <div className="p-2 bg-muted/30 rounded">
                            <span className="text-muted-foreground">"</span> → &amp;quot;
                        </div>
                        <div className="p-2 bg-muted/30 rounded">
                            <span className="text-muted-foreground">'</span> → &amp;#39;
                        </div>
                        <div className="p-2 bg-muted/30 rounded">
                            <span className="text-muted-foreground">/</span> → &amp;#x2F;
                        </div>
                        <div className="p-2 bg-muted/30 rounded">
                            <span className="text-muted-foreground">空格</span> → &amp;nbsp;
                        </div>
                        <div className="p-2 bg-muted/30 rounded">
                            <span className="text-muted-foreground">©</span> → &amp;copy;
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
