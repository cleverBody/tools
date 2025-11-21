import { useState } from 'react';
import { Image as ImageIcon, Upload, Copy } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useToast } from '../contexts/ToastContext';

export function ImageBase64Tool() {
    const [base64, setBase64] = useState('');
    const [preview, setPreview] = useState('');
    const { showToast } = useToast();

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            showToast('请选择图片文件', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const result = event.target?.result as string;
            setBase64(result);
            setPreview(result);
        };
        reader.readAsDataURL(file);
    };

    const copyBase64 = () => {
        navigator.clipboard.writeText(base64);
        showToast('已复制 Base64');
    };

    const copyDataUrl = () => {
        navigator.clipboard.writeText(base64);
        showToast('已复制 Data URL');
    };

    const getBase64Only = () => {
        return base64.split(',')[1] || '';
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">图片转 Base64</h2>
                    <p className="text-muted-foreground">将图片文件转换为 Base64 编码。</p>
                </div>
            </div>

            <Card className="shadow-md">
                <CardHeader className="bg-muted/30 border-b pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Upload className="w-5 h-5" />
                        上传图片
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="image-upload"
                        />
                        <label htmlFor="image-upload" className="cursor-pointer">
                            <ImageIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                            <p className="text-lg font-medium mb-2">点击选择图片</p>
                            <p className="text-sm text-muted-foreground">支持 JPG, PNG, GIF, WebP 等格式</p>
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
                                    alt="Preview"
                                    className="max-w-full max-h-[400px] rounded-lg border-2 border-border shadow-lg"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-md">
                        <CardHeader className="bg-muted/30 border-b pb-4 flex flex-row items-center justify-between">
                            <CardTitle className="text-lg">Base64 编码</CardTitle>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="sm" onClick={copyDataUrl} className="h-8">
                                    <Copy className="w-4 h-4 mr-2" />
                                    复制 Data URL
                                </Button>
                                <Button variant="ghost" size="sm" onClick={copyBase64} className="h-8">
                                    <Copy className="w-4 h-4 mr-2" />
                                    复制 Base64
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-2 block">Data URL (可直接用于 img src):</label>
                                <textarea
                                    readOnly
                                    value={base64}
                                    className="w-full h-32 px-3 py-2 rounded border border-input bg-muted/30 font-mono text-xs resize-none"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-2 block">Base64 编码 (仅数据部分):</label>
                                <textarea
                                    readOnly
                                    value={getBase64Only()}
                                    className="w-full h-32 px-3 py-2 rounded border border-input bg-muted/30 font-mono text-xs resize-none"
                                />
                            </div>
                            <div className="text-sm text-muted-foreground">
                                文件大小: {(base64.length * 0.75 / 1024).toFixed(2)} KB
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}
