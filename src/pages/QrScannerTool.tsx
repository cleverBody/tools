import { useState, useRef } from 'react';
import { ScanLine, Upload } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import jsQR from 'jsqr';

export function QrScannerTool() {
    const [result, setResult] = useState('');
    const [preview, setPreview] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (!ctx) return;

                ctx.drawImage(img, 0, 0);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height);

                if (code) {
                    setResult(code.data);
                } else {
                    setResult('未检测到二维码');
                }
                setPreview(event.target?.result as string);
            };
            img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">二维码识别</h2>
                    <p className="text-muted-foreground">上传图片识别二维码内容。</p>
                </div>
            </div>

            <Card className="shadow-md">
                <CardHeader className="bg-muted/30 border-b pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Upload className="w-5 h-5" />
                        上传二维码图片
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="qr-upload"
                        />
                        <label htmlFor="qr-upload" className="cursor-pointer">
                            <ScanLine className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                            <p className="text-lg font-medium mb-2">点击选择二维码图片</p>
                            <p className="text-sm text-muted-foreground">支持 JPG, PNG, GIF 等格式</p>
                        </label>
                    </div>
                </CardContent>
            </Card>

            {preview && (
                <>
                    <Card className="shadow-md">
                        <CardHeader className="bg-muted/30 border-b pb-4">
                            <CardTitle className="text-lg">图片预览</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="flex justify-center">
                                <img
                                    src={preview}
                                    alt="QR Code"
                                    className="max-w-full max-h-[400px] rounded-lg border-2 border-border shadow-lg"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-md">
                        <CardHeader className="bg-muted/30 border-b pb-4">
                            <CardTitle className="text-lg">识别结果</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {result === '未检测到二维码' ? (
                                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
                                    {result}
                                </div>
                            ) : (
                                <div className="p-4 bg-primary/5 rounded-lg">
                                    <p className="text-sm text-muted-foreground mb-2">二维码内容:</p>
                                    <p className="font-mono text-lg break-all">{result}</p>
                                    {result.startsWith('http') && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => window.open(result, '_blank')}
                                            className="mt-4"
                                        >
                                            打开链接
                                        </Button>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}
