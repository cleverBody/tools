import { useState } from 'react';
import { Copy, RefreshCw, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';


export function UuidTool() {
    const [uuids, setUuids] = useState<string[]>([]);
    const [count, setCount] = useState(1);

    const generateUuid = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    const handleGenerate = () => {
        const newUuids = Array.from({ length: count }, () => generateUuid());
        setUuids(newUuids);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const copyAll = () => {
        if (uuids.length > 0) {
            copyToClipboard(uuids.join('\n'));
        }
    };

    const clearAll = () => {
        setUuids([]);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">UUID 生成器</h2>
                    <p className="text-muted-foreground">生成随机 Version 4 UUID。</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={clearAll} disabled={uuids.length === 0}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        清空
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1 shadow-md">
                    <CardHeader className="bg-muted/30 border-b pb-4">
                        <CardTitle className="text-lg">配置</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <div className="space-y-3">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">生成数量 (1-100)</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={count}
                                    onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">一次最多生成 100 个 UUID。</p>
                        </div>
                        <Button onClick={handleGenerate} className="w-full shadow-sm" size="lg">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            生成 UUID
                        </Button>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2 shadow-md flex flex-col h-[600px]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 bg-muted/30 border-b py-4">
                        <CardTitle className="text-lg">生成结果</CardTitle>
                        {uuids.length > 0 && (
                            <Button variant="ghost" size="sm" onClick={copyAll} className="h-8">
                                <Copy className="w-4 h-4 mr-2" />
                                复制全部
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent className="flex-1 overflow-hidden p-0">
                        {uuids.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground bg-muted/5">
                                <div className="p-4 rounded-full bg-muted/20 mb-4">
                                    <RefreshCw className="w-8 h-8 opacity-50" />
                                </div>
                                <p>点击生成按钮开始创建 UUID</p>
                            </div>
                        ) : (
                            <div className="h-full overflow-y-auto p-4 space-y-2">
                                {uuids.map((uuid, index) => (
                                    <div key={index} className="flex items-center gap-3 group bg-card border rounded-lg p-2 pl-4 hover:border-primary/50 transition-colors shadow-sm">
                                        <div className="font-mono text-sm text-muted-foreground w-8">{index + 1}.</div>
                                        <div className="flex-1 font-mono text-sm font-medium tracking-wide text-foreground">
                                            {uuid}
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => copyToClipboard(uuid)}
                                            className="opacity-0 group-hover:opacity-100 transition-all h-8 w-8"
                                            title="复制"
                                        >
                                            <Copy className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
