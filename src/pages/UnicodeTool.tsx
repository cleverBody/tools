import { useState } from 'react';
import { Languages, ArrowRightLeft, Copy } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Textarea } from '../components/ui/Textarea';
import { useToast } from '../contexts/ToastContext';

export function UnicodeTool() {
    const [input, setInput] = useState('');
    const [mode, setMode] = useState<'encode' | 'decode'>('encode');
    const { showToast } = useToast();

    const toUnicode = (str: string) => {
        return str
            .split('')
            .map((char) => {
                const code = char.charCodeAt(0);
                return code > 127 ? `\\u${code.toString(16).padStart(4, '0')}` : char;
            })
            .join('');
    };

    const fromUnicode = (str: string) => {
        return str.replace(/\\u[\dA-Fa-f]{4}/g, (match) => {
            return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
        });
    };

    const output = mode === 'encode' ? toUnicode(input) : fromUnicode(input);

    const copyOutput = () => {
        navigator.clipboard.writeText(output);
        showToast('已复制结果');
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Unicode 转换</h2>
                    <p className="text-muted-foreground">Unicode 编码与文本互相转换。</p>
                </div>
            </div>

            <div className="flex gap-2">
                <Button
                    variant={mode === 'encode' ? 'default' : 'outline'}
                    onClick={() => setMode('encode')}
                    size="sm"
                >
                    <ArrowRightLeft className="w-4 h-4 mr-2" />
                    文本 → Unicode
                </Button>
                <Button
                    variant={mode === 'decode' ? 'default' : 'outline'}
                    onClick={() => setMode('decode')}
                    size="sm"
                >
                    <ArrowRightLeft className="w-4 h-4 mr-2" />
                    Unicode → 文本
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="shadow-md">
                    <CardHeader className="bg-muted/30 border-b pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Languages className="w-5 h-5" />
                            输入
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <Textarea
                            className="min-h-[300px] font-mono resize-y text-sm"
                            placeholder={
                                mode === 'encode'
                                    ? '输入包含中文或特殊字符的文本...'
                                    : '输入 Unicode 编码 (如 \\u4e2d\\u6587)...'
                            }
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
                    <CardTitle className="text-sm">示例</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-2 text-sm">
                    <div className="p-3 bg-muted/30 rounded font-mono">
                        <div className="text-muted-foreground mb-1">文本:</div>
                        <div>你好，世界！</div>
                    </div>
                    <div className="p-3 bg-muted/30 rounded font-mono">
                        <div className="text-muted-foreground mb-1">Unicode:</div>
                        <div className="break-all">\u4f60\u597d\uff0c\u4e16\u754c\uff01</div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
