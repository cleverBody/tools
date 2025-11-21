import { useState } from 'react';
import { Link as LinkIcon, ArrowRightLeft, Copy, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Textarea } from '../components/ui/Textarea';

export function UrlTool() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');

    const handleEncode = () => {
        try {
            setOutput(encodeURIComponent(input));
        } catch (e) {
            setOutput('Error: Unable to encode');
        }
    };

    const handleDecode = () => {
        try {
            setOutput(decodeURIComponent(input));
        } catch (e) {
            setOutput('Error: Unable to decode');
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(output);
    };

    const clearAll = () => {
        setInput('');
        setOutput('');
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">URL 编解码</h2>
                    <p className="text-muted-foreground">对 URL 进行编码 (Encode) 或解码 (Decode)。</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={clearAll} title="清空所有">
                        <Trash2 className="w-4 h-4 mr-2" />
                        清空
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <Card className="shadow-md">
                    <CardHeader className="bg-muted/30 border-b pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <LinkIcon className="w-5 h-5" />
                            转换工具
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">输入内容</label>
                            <Textarea
                                className="min-h-[150px] font-mono resize-y"
                                placeholder="在此输入需要编码或解码的 URL..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-4">
                            <Button onClick={handleEncode} className="flex-1 shadow-sm">
                                <ArrowRightLeft className="w-4 h-4 mr-2" />
                                编码 (Encode)
                            </Button>
                            <Button onClick={handleDecode} variant="secondary" className="flex-1 shadow-sm">
                                <ArrowRightLeft className="w-4 h-4 mr-2" />
                                解码 (Decode)
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium leading-none">输出结果</label>
                                {output && (
                                    <Button variant="ghost" size="sm" onClick={copyToClipboard} className="h-6 px-2">
                                        <Copy className="w-3 h-3 mr-1" />
                                        复制
                                    </Button>
                                )}
                            </div>
                            <Textarea
                                className="min-h-[150px] font-mono resize-y bg-muted/30"
                                readOnly
                                value={output}
                                placeholder="结果将显示在这里..."
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
