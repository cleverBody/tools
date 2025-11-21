import { useState } from 'react';
import { KeySquare, Copy, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Textarea } from '../components/ui/Textarea';
import { useToast } from '../contexts/ToastContext';

interface DecodedJWT {
    header: Record<string, unknown>;
    payload: Record<string, unknown>;
    signature: string;
}

export function JwtTool() {
    const [token, setToken] = useState('');
    const [decoded, setDecoded] = useState<DecodedJWT | null>(null);
    const [error, setError] = useState('');
    const { showToast } = useToast();

    const decodeJwt = (jwt: string) => {
        try {
            const parts = jwt.trim().split('.');
            if (parts.length !== 3) {
                throw new Error('Invalid JWT format. JWT must have 3 parts separated by dots.');
            }

            const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
            const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
            const signature = parts[2];

            setDecoded({ header, payload, signature });
            setError('');
        } catch (e) {
            setError((e as Error).message);
            setDecoded(null);
        }
    };

    const handleTokenChange = (value: string) => {
        setToken(value);
        if (value.trim()) {
            decodeJwt(value);
        } else {
            setDecoded(null);
            setError('');
        }
    };

    const copyJson = (data: Record<string, unknown>, name: string) => {
        navigator.clipboard.writeText(JSON.stringify(data, null, 2));
        showToast(`已复制 ${name}`);
    };

    const formatTimestamp = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleString('zh-CN');
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">JWT 解码器</h2>
                    <p className="text-muted-foreground">解析和查看 JWT Token 的内容。</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <Card className="shadow-md">
                    <CardHeader className="bg-muted/30 border-b pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <KeySquare className="w-5 h-5" />
                            JWT Token
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <Textarea
                            className="min-h-[120px] font-mono resize-y text-sm"
                            placeholder="粘贴 JWT Token..."
                            value={token}
                            onChange={(e) => handleTokenChange(e.target.value)}
                        />
                        {error && (
                            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-2 text-destructive">
                                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                <div className="text-sm">{error}</div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {decoded && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Header */}
                        <Card className="shadow-sm">
                            <CardHeader className="py-3 bg-blue-500/10 border-b flex flex-row items-center justify-between">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                    Header
                                </CardTitle>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyJson(decoded.header, 'Header')}
                                    className="h-6 px-2"
                                >
                                    <Copy className="w-3 h-3 mr-1" />
                                    复制
                                </Button>
                            </CardHeader>
                            <CardContent className="py-3">
                                <pre className="font-mono text-xs bg-muted/30 p-3 rounded overflow-auto max-h-[200px]">
                                    {JSON.stringify(decoded.header, null, 2)}
                                </pre>
                            </CardContent>
                        </Card>

                        {/* Payload */}
                        <Card className="shadow-sm">
                            <CardHeader className="py-3 bg-green-500/10 border-b flex flex-row items-center justify-between">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                    Payload
                                </CardTitle>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyJson(decoded.payload, 'Payload')}
                                    className="h-6 px-2"
                                >
                                    <Copy className="w-3 h-3 mr-1" />
                                    复制
                                </Button>
                            </CardHeader>
                            <CardContent className="py-3">
                                <pre className="font-mono text-xs bg-muted/30 p-3 rounded overflow-auto max-h-[200px]">
                                    {JSON.stringify(decoded.payload, null, 2)}
                                </pre>
                                {/* Show common claims */}
                                <div className="mt-3 space-y-2 text-sm">
                                    {(decoded.payload as any).iss && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Issuer (iss):</span>
                                            <span className="font-mono">{String((decoded.payload as any).iss)}</span>
                                        </div>
                                    )}
                                    {(decoded.payload as any).sub && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Subject (sub):</span>
                                            <span className="font-mono">{String((decoded.payload as any).sub)}</span>
                                        </div>
                                    )}
                                    {(decoded.payload as any).exp && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Expires (exp):</span>
                                            <span className="font-mono text-xs">
                                                {formatTimestamp(Number((decoded.payload as any).exp))}
                                            </span>
                                        </div>
                                    )}
                                    {(decoded.payload as any).iat && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Issued At (iat):</span>
                                            <span className="font-mono text-xs">
                                                {formatTimestamp(Number((decoded.payload as any).iat))}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Signature */}
                        <Card className="shadow-sm lg:col-span-2">
                            <CardHeader className="py-3 bg-purple-500/10 border-b">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                                    Signature
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="py-3">
                                <div className="font-mono text-xs bg-muted/30 p-3 rounded break-all">
                                    {decoded.signature}
                                </div>
                                <p className="mt-2 text-xs text-muted-foreground">
                                    ⚠️ 签名验证需要密钥，此工具仅解码 Token 内容，不验证签名有效性。
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
