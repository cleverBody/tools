import { useState, useEffect, useRef } from 'react';
import { QrCode, Download, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Textarea } from '../components/ui/Textarea';
import QRCodeLib from 'qrcode';
import { useToast } from '../contexts/ToastContext';

export function QrTool() {
    const [text, setText] = useState('https://example.com');
    const [qrDataUrl, setQrDataUrl] = useState('');
    const [size, setSize] = useState(256);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { showToast } = useToast();

    useEffect(() => {
        if (text && canvasRef.current) {
            QRCodeLib.toCanvas(
                canvasRef.current,
                text,
                {
                    width: size,
                    margin: 2,
                    color: {
                        dark: '#000000',
                        light: '#ffffff',
                    },
                },
                (error: Error | null | undefined) => {
                    if (error) {
                        console.error(error);
                    } else {
                        const dataUrl = canvasRef.current?.toDataURL('image/png');
                        if (dataUrl) {
                            setQrDataUrl(dataUrl);
                        }
                    }
                }
            );
        }
    }, [text, size]);

    const downloadQr = () => {
        if (qrDataUrl) {
            const link = document.createElement('a');
            link.download = 'qrcode.png';
            link.href = qrDataUrl;
            link.click();
            showToast('二维码已下载');
        }
    };

    const clearAll = () => {
        setText('');
        setQrDataUrl('');
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">二维码生成器</h2>
                    <p className="text-muted-foreground">将文本或 URL 转换为二维码图片。</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={clearAll} title="清空">
                        <Trash2 className="w-4 h-4 mr-2" />
                        清空
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="shadow-md">
                    <CardHeader className="bg-muted/30 border-b pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <QrCode className="w-5 h-5" />
                            输入内容
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <Textarea
                            className="min-h-[150px] font-mono resize-y"
                            placeholder="输入文本、URL 或其他内容..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <label className="text-sm font-medium">二维码尺寸: {size}px</label>
                            </div>
                            <input
                                type="range"
                                min="128"
                                max="512"
                                step="64"
                                value={size}
                                onChange={(e) => setSize(parseInt(e.target.value))}
                                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>128px</span>
                                <span>512px</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-md">
                    <CardHeader className="bg-muted/30 border-b pb-4 flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">生成结果</CardTitle>
                        {qrDataUrl && (
                            <Button variant="ghost" size="sm" onClick={downloadQr} className="h-8">
                                <Download className="w-4 h-4 mr-2" />
                                下载
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent className="pt-6 flex items-center justify-center min-h-[300px]">
                        {text ? (
                            <div className="flex flex-col items-center gap-4">
                                <canvas ref={canvasRef} className="border-4 border-border rounded-lg shadow-lg" />
                                <p className="text-sm text-muted-foreground">扫描二维码查看内容</p>
                            </div>
                        ) : (
                            <div className="text-center text-muted-foreground">
                                <QrCode className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                <p>输入内容以生成二维码</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
