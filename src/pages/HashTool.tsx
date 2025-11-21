import { useState, useEffect } from 'react';
import { Hash, Copy, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Textarea } from '../components/ui/Textarea';

export function HashTool() {
    const [input, setInput] = useState('');
    const [hashes, setHashes] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const calculateHashes = async () => {
            if (!input) {
                setHashes({});
                return;
            }

            const encoder = new TextEncoder();
            const data = encoder.encode(input);

            const algorithms = {
                'SHA-1': 'SHA-1',
                'SHA-256': 'SHA-256',
                'SHA-384': 'SHA-384',
                'SHA-512': 'SHA-512',
            };

            const newHashes: { [key: string]: string } = {};

            // MD5 is not supported by Web Crypto API natively, we might need a library or just skip it for now.
            // Or implement a simple JS version. For now, let's stick to SHA family supported by browser.
            // If user really needs MD5, we can add a library later.

            for (const [name, algo] of Object.entries(algorithms)) {
                try {
                    const hashBuffer = await crypto.subtle.digest(algo, data);
                    const hashArray = Array.from(new Uint8Array(hashBuffer));
                    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
                    newHashes[name] = hashHex;
                } catch (e) {
                    console.error(`Error calculating ${name}:`, e);
                    newHashes[name] = 'Error';
                }
            }

            setHashes(newHashes);
        };

        calculateHashes();
    }, [input]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const clearAll = () => {
        setInput('');
        setHashes({});
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">哈希生成器</h2>
                    <p className="text-muted-foreground">计算文本的 SHA-1, SHA-256, SHA-384, SHA-512 哈希值。</p>
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
                            <Hash className="w-5 h-5" />
                            输入内容
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <Textarea
                            className="min-h-[100px] font-mono resize-y"
                            placeholder="在此输入需要计算哈希的文本..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 gap-4">
                    {['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'].map((algo) => (
                        <Card key={algo} className="shadow-sm">
                            <CardHeader className="py-3 bg-muted/10 border-b flex flex-row items-center justify-between">
                                <CardTitle className="text-sm font-medium">{algo}</CardTitle>
                                {hashes[algo] && (
                                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(hashes[algo])} className="h-6 px-2">
                                        <Copy className="w-3 h-3 mr-1" />
                                        复制
                                    </Button>
                                )}
                            </CardHeader>
                            <CardContent className="py-3">
                                <div className="font-mono text-sm break-all text-muted-foreground">
                                    {hashes[algo] || '-'}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
