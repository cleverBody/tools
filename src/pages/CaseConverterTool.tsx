import { useState } from 'react';
import { Type, Copy } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Textarea } from '../components/ui/Textarea';
import { useToast } from '../contexts/ToastContext';

type CaseType = 'camel' | 'pascal' | 'snake' | 'kebab' | 'constant';

export function CaseConverterTool() {
    const [input, setInput] = useState('');
    const { showToast } = useToast();

    const toCamelCase = (str: string) => {
        return str
            .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
            .replace(/^[A-Z]/, (c) => c.toLowerCase());
    };

    const toPascalCase = (str: string) => {
        const camel = toCamelCase(str);
        return camel.charAt(0).toUpperCase() + camel.slice(1);
    };

    const toSnakeCase = (str: string) => {
        return str
            .replace(/([A-Z])/g, '_$1')
            .replace(/[-\s]+/g, '_')
            .replace(/^_/, '')
            .toLowerCase();
    };

    const toKebabCase = (str: string) => {
        return str
            .replace(/([A-Z])/g, '-$1')
            .replace(/[_\s]+/g, '-')
            .replace(/^-/, '')
            .toLowerCase();
    };

    const toConstantCase = (str: string) => {
        return toSnakeCase(str).toUpperCase();
    };

    const convertLine = (line: string, type: CaseType) => {
        if (!line.trim()) return line;
        switch (type) {
            case 'camel':
                return toCamelCase(line);
            case 'pascal':
                return toPascalCase(line);
            case 'snake':
                return toSnakeCase(line);
            case 'kebab':
                return toKebabCase(line);
            case 'constant':
                return toConstantCase(line);
            default:
                return line;
        }
    };

    const convertBatch = (type: CaseType) => {
        return input
            .split('\n')
            .map((line) => convertLine(line, type))
            .join('\n');
    };

    const results = [
        { type: 'camel' as CaseType, name: 'camelCase', example: 'myVariableName', value: convertBatch('camel') },
        { type: 'pascal' as CaseType, name: 'PascalCase', example: 'MyClassName', value: convertBatch('pascal') },
        { type: 'snake' as CaseType, name: 'snake_case', example: 'my_variable_name', value: convertBatch('snake') },
        { type: 'kebab' as CaseType, name: 'kebab-case', example: 'my-css-class', value: convertBatch('kebab') },
        { type: 'constant' as CaseType, name: 'CONSTANT_CASE', example: 'MY_CONSTANT', value: convertBatch('constant') },
    ];

    const copyValue = (value: string, name: string) => {
        navigator.clipboard.writeText(value);
        showToast(`已复制 ${name}`);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">命名风格转换</h2>
                    <p className="text-muted-foreground">在不同编程命名风格之间转换。</p>
                </div>
            </div>

            <Card className="shadow-md">
                <CardHeader className="bg-muted/30 border-b pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Type className="w-5 h-5" />
                        输入文本
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <Textarea
                        className="min-h-[150px] font-mono resize-y text-sm"
                        placeholder="输入变量名或文本，支持多行批量转换..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                </CardContent>
            </Card>

            {input && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.map((result) => (
                        <Card key={result.type} className="shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="py-3 bg-muted/10 border-b flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-sm font-medium">{result.name}</CardTitle>
                                    <p className="text-xs text-muted-foreground mt-1 font-mono">{result.example}</p>
                                </div>
                                {result.value && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => copyValue(result.value, result.name)}
                                        className="h-6 px-2"
                                    >
                                        <Copy className="w-3 h-3" />
                                    </Button>
                                )}
                            </CardHeader>
                            <CardContent className="py-4">
                                <div className="font-mono text-sm break-all whitespace-pre-wrap max-h-[200px] overflow-auto">
                                    {result.value || '-'}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
