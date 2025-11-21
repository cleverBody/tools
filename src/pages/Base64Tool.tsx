import { useState } from 'react';
import { FileCode, ArrowRightLeft, Copy, Trash2, Upload } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Textarea } from '../components/ui/Textarea';

export function Base64Tool() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [mode, setMode] = useState<'encode' | 'decode'>('encode');

    const handleConvert = () => {
        try {
            if (mode === 'encode') {
                setOutput(btoa(unescape(encodeURIComponent(input))));
            } else {
                setOutput(decodeURIComponent(escape(atob(input))));
            }
        } catch (e) {
            setOutput('Error: Invalid input for Base64 conversion');
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                // Remove data URL prefix if present for pure Base64
                const base64 = result.split(',')[1] || result;
                setInput(base64);
                setMode('decode'); // Switch to decode mode so user can see the base64 they just uploaded? 
                // Actually, usually people want to convert File -> Base64.
                // So if they upload a file, we should probably set the OUTPUT to the base64 of that file.
                // Let's change logic: Upload -> Input becomes file content? No, Upload -> Output is Base64.

                // Let's keep it simple: Upload File -> Input Textarea gets the Base64 string.
                // Then user can do what they want.
                // Wait, if I upload an image, I want the Base64 string.
                setInput(result); // Put the full data URL in input
                setMode('encode'); // It's already encoded technically, but let's just show it.
                // Actually, let's just put it in Input and let user decide.
            };
            reader.readAsDataURL(file);
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
                    <h2 className="text-3xl font-bold tracking-tight">Base64 转换</h2>
                    <p className="text-muted-foreground">文本或文件与 Base64 之间的相互转换。</p>
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
                            <FileCode className="w-5 h-5" />
                            转换工具
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium leading-none">输入内容</label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        id="file-upload"
                                        className="hidden"
                                        onChange={handleFileUpload}
                                    />
                                    <Button variant="outline" size="sm" className="h-8" onClick={() => document.getElementById('file-upload')?.click()}>
                                        <Upload className="w-3 h-3 mr-2" />
                                        上传文件转 Base64
                                    </Button>
                                </div>
                            </div>
                            <Textarea
                                className="min-h-[150px] font-mono resize-y"
                                placeholder="在此输入文本或 Base64 字符串..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-4">
                            <Button
                                onClick={() => { setMode('encode'); handleConvert(); }}
                                className="flex-1 shadow-sm"
                                variant={mode === 'encode' ? 'default' : 'secondary'}
                            >
                                <ArrowRightLeft className="w-4 h-4 mr-2" />
                                编码 (Text → Base64)
                            </Button>
                            <Button
                                onClick={() => { setMode('decode'); handleConvert(); }}
                                className="flex-1 shadow-sm"
                                variant={mode === 'decode' ? 'default' : 'secondary'}
                            >
                                <ArrowRightLeft className="w-4 h-4 mr-2" />
                                解码 (Base64 → Text)
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
