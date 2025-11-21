import { useState } from 'react';
import { FileSpreadsheet, ArrowRightLeft, Copy } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Textarea } from '../components/ui/Textarea';
import { useToast } from '../contexts/ToastContext';

export function CsvJsonTool() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [mode, setMode] = useState<'csv2json' | 'json2csv'>('csv2json');
    const [delimiter, setDelimiter] = useState(',');
    const [hasHeader, setHasHeader] = useState(true);
    const [error, setError] = useState('');
    const { showToast } = useToast();

    const csvToJson = () => {
        try {
            const lines = input.trim().split('\n');
            if (lines.length === 0) {
                setOutput('');
                return;
            }

            const headers = hasHeader
                ? lines[0].split(delimiter).map(h => h.trim())
                : lines[0].split(delimiter).map((_, i) => `column${i + 1}`);

            const dataLines = hasHeader ? lines.slice(1) : lines;
            const result = dataLines.map(line => {
                const values = line.split(delimiter).map(v => v.trim());
                const obj: Record<string, string> = {};
                headers.forEach((header, index) => {
                    obj[header] = values[index] || '';
                });
                return obj;
            });

            setOutput(JSON.stringify(result, null, 2));
            setError('');
        } catch (e) {
            setError((e as Error).message);
            setOutput('');
        }
    };

    const jsonToCsv = () => {
        try {
            const data = JSON.parse(input);
            if (!Array.isArray(data) || data.length === 0) {
                throw new Error('JSON must be an array of objects');
            }

            const headers = Object.keys(data[0]);
            const csvLines = [
                headers.join(delimiter),
                ...data.map(row =>
                    headers.map(header => {
                        const value = String(row[header] || '');
                        // 如果值包含分隔符或换行符，用引号包裹
                        return value.includes(delimiter) || value.includes('\n')
                            ? `"${value.replace(/"/g, '""')}"`
                            : value;
                    }).join(delimiter)
                ),
            ];

            setOutput(csvLines.join('\n'));
            setError('');
        } catch (e) {
            setError((e as Error).message);
            setOutput('');
        }
    };

    const handleConvert = () => {
        if (mode === 'csv2json') {
            csvToJson();
        } else {
            jsonToCsv();
        }
    };

    const copyOutput = () => {
        navigator.clipboard.writeText(output);
        showToast('已复制结果');
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">CSV/JSON 转换</h2>
                    <p className="text-muted-foreground">CSV 与 JSON 格式互相转换。</p>
                </div>
            </div>

            <div className="flex gap-4 flex-wrap items-center">
                <div className="flex gap-2">
                    <Button
                        variant={mode === 'csv2json' ? 'default' : 'outline'}
                        onClick={() => setMode('csv2json')}
                        size="sm"
                    >
                        CSV → JSON
                    </Button>
                    <Button
                        variant={mode === 'json2csv' ? 'default' : 'outline'}
                        onClick={() => setMode('json2csv')}
                        size="sm"
                    >
                        JSON → CSV
                    </Button>
                </div>

                {mode === 'csv2json' && (
                    <>
                        <div className="flex items-center gap-2">
                            <label className="text-sm">分隔符:</label>
                            <select
                                value={delimiter}
                                onChange={(e) => setDelimiter(e.target.value)}
                                className="px-2 py-1 rounded border border-input bg-background text-sm"
                            >
                                <option value=",">逗号 (,)</option>
                                <option value="\t">制表符 (\t)</option>
                                <option value=";">分号 (;)</option>
                                <option value="|">竖线 (|)</option>
                            </select>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={hasHeader}
                                onChange={(e) => setHasHeader(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <span className="text-sm">首行为列头</span>
                        </label>
                    </>
                )}

                <Button onClick={handleConvert} size="sm">
                    <ArrowRightLeft className="w-4 h-4 mr-2" />
                    转换
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="shadow-md">
                    <CardHeader className="bg-muted/30 border-b pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <FileSpreadsheet className="w-5 h-5" />
                            输入 ({mode === 'csv2json' ? 'CSV' : 'JSON'})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <Textarea
                            className="min-h-[400px] font-mono resize-y text-sm"
                            placeholder={
                                mode === 'csv2json'
                                    ? '粘贴 CSV 数据...\n例如:\nname,age,city\nAlice,30,Beijing\nBob,25,Shanghai'
                                    : '粘贴 JSON 数组...\n例如:\n[{"name":"Alice","age":30}]'
                            }
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                    </CardContent>
                </Card>

                <Card className="shadow-md">
                    <CardHeader className="bg-muted/30 border-b pb-4 flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">
                            输出 ({mode === 'csv2json' ? 'JSON' : 'CSV'})
                        </CardTitle>
                        {output && (
                            <Button variant="ghost" size="sm" onClick={copyOutput} className="h-8">
                                <Copy className="w-4 h-4 mr-2" />
                                复制
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent className="pt-6">
                        {error ? (
                            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                                {error}
                            </div>
                        ) : (
                            <Textarea
                                className="min-h-[400px] font-mono resize-y text-sm bg-muted/30"
                                readOnly
                                value={output}
                                placeholder="转换结果将显示在这里..."
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
