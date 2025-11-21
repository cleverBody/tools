import { useState, useEffect, useMemo } from 'react';
import { Copy, Trash2, Minimize2, AlignLeft, Code2, ArrowUpDown, FileText, CheckCircle2, XCircle, Maximize2, X, AlertTriangle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Textarea } from '../components/ui/Textarea';
import { useToast } from '../contexts/ToastContext';

type ActionType = 'format' | 'minify' | 'sort' | 'typescript' | 'java' | 'escape' | 'unescape';

interface ValidationResult {
    valid: boolean;
    error?: string;
    line?: number;
    column?: number;
}

export function JsonTool() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [indent, setIndent] = useState(2);
    const [stats, setStats] = useState<any>(null);
    const [validation, setValidation] = useState<ValidationResult>({ valid: true });
    const [fullscreenMode, setFullscreenMode] = useState(false);
    const { showToast } = useToast();

    const lineCount = useMemo(() => input.split('\n').length, [input]);
    const isLargeJson = lineCount > 1000;

    const lineNumbers = useMemo(() => {
        if (lineCount > 10000) return '';
        return input.split('\n').map((_, i) => i + 1).join('\n');
    }, [input, lineCount]);

    useEffect(() => {
        if (!input.trim()) {
            setValidation({ valid: true });
            return;
        }

        const debounceTime = isLargeJson ? 2000 : 500;
        const timer = setTimeout(() => validateJson(input), debounceTime);
        return () => clearTimeout(timer);
    }, [input, isLargeJson]);

    const validateJson = (jsonString: string): ValidationResult => {
        if (!jsonString.trim()) {
            const result = { valid: true };
            setValidation(result);
            return result;
        }

        try {
            JSON.parse(jsonString);
            const result = { valid: true };
            setValidation(result);
            return result;
        } catch (err: any) {
            const errorMessage = err.message;
            const positionMatch = errorMessage.match(/position (\d+)/);
            let line: number | undefined;
            let column: number | undefined;

            if (positionMatch) {
                const position = parseInt(positionMatch[1]);
                const lines = jsonString.substring(0, position).split('\n');
                line = lines.length;
                column = lines[lines.length - 1].length + 1;
            }

            const result = { valid: false, error: errorMessage, line, column };
            setValidation(result);
            return result;
        }
    };

    const manualValidate = () => {
        const result = validateJson(input);
        showToast(result.valid ? '✅ JSON 格式正确' : '❌ JSON 格式错误', result.valid ? 'success' : 'error');
    };

    const analyzeJson = (obj: any): any => {
        const stats = { keys: 0, arrays: 0, objects: 0, strings: 0, numbers: 0, booleans: 0, nulls: 0, maxDepth: 0 };
        const analyze = (value: any, depth: number = 0) => {
            stats.maxDepth = Math.max(stats.maxDepth, depth);
            if (value === null) stats.nulls++;
            else if (typeof value === 'string') stats.strings++;
            else if (typeof value === 'number') stats.numbers++;
            else if (typeof value === 'boolean') stats.booleans++;
            else if (Array.isArray(value)) {
                stats.arrays++;
                value.forEach(item => analyze(item, depth + 1));
            } else if (typeof value === 'object') {
                stats.objects++;
                stats.keys += Object.keys(value).length;
                Object.values(value).forEach(val => analyze(val, depth + 1));
            }
        };
        analyze(obj);
        return stats;
    };

    const sortKeys = (obj: any): any => {
        if (Array.isArray(obj)) return obj.map(sortKeys);
        if (obj !== null && typeof obj === 'object') {
            return Object.keys(obj).sort().reduce((sorted: any, key) => {
                sorted[key] = sortKeys(obj[key]);
                return sorted;
            }, {});
        }
        return obj;
    };

    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
    const snakeToCamel = (str: string) => str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

    const jsonToJava = (obj: any, className: string = 'Root'): string => {
        const getJavaType = (value: any, fieldName: string): string => {
            if (value === null) return 'Object';
            if (Array.isArray(value)) {
                if (value.length === 0) return 'List<Object>';
                return `List<${getJavaType(value[0], fieldName)}>`;
            }
            if (typeof value === 'object') return capitalize(snakeToCamel(fieldName));
            if (typeof value === 'string') return 'String';
            if (typeof value === 'number') return Number.isInteger(value) ? 'Integer' : 'Double';
            if (typeof value === 'boolean') return 'Boolean';
            return 'Object';
        };

        const generateClass = (obj: any, className: string, isNested: boolean = false): string => {
            const lines: string[] = [];
            const nestedClasses: string[] = [];
            const hasSnakeCase = Object.keys(obj).some(key => key.includes('_'));

            if (!isNested) {
                lines.push('import java.util.List;', 'import lombok.Data;');
                if (hasSnakeCase) {
                    lines.push('import com.fasterxml.jackson.databind.PropertyNamingStrategies;');
                    lines.push('import com.fasterxml.jackson.databind.annotation.JsonNaming;');
                }
                lines.push('');
            }

            const indent = isNested ? '    ' : '';
            if (!isNested) {
                lines.push('@Data');
                if (hasSnakeCase) lines.push('@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)');
            } else {
                lines.push('    @Data');
                if (hasSnakeCase) lines.push('    @JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)');
            }

            lines.push(`${indent}public ${isNested ? 'static ' : ''}class ${className} {`);

            for (const [key, value] of Object.entries(obj)) {
                const camelKey = snakeToCamel(key);
                const javaType = getJavaType(value, key);
                lines.push(`${indent}    private ${javaType} ${camelKey};`);

                if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
                    nestedClasses.push(generateClass(value, capitalize(snakeToCamel(key)), true));
                } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
                    nestedClasses.push(generateClass(value[0], capitalize(snakeToCamel(key)), true));
                }
            }

            lines.push(`${indent}}`);
            if (!isNested && nestedClasses.length > 0) {
                lines.push('', ...nestedClasses);
            }

            return lines.join('\n');
        };

        return generateClass(obj, className);
    };

    const jsonToTypeScript = (obj: any, name: string = 'Root'): string => {
        const getType = (value: any): string => {
            if (value === null) return 'null';
            if (Array.isArray(value)) {
                if (value.length === 0) return 'any[]';
                return `${getType(value[0])}[]`;
            }
            if (typeof value === 'object') return generateInterface(value, name);
            return typeof value;
        };

        const generateInterface = (obj: any, interfaceName: string): string => {
            const lines = [`interface ${interfaceName} {`];
            for (const [key, value] of Object.entries(obj)) {
                lines.push(`  ${key}: ${getType(value)};`);
            }
            lines.push('}');
            return lines.join('\n');
        };

        return generateInterface(obj, name);
    };

    const escapeJson = (str: string) => JSON.stringify(str);
    const unescapeJson = (str: string) => { try { return JSON.parse(str); } catch { return str; } };

    const processJson = (action: ActionType) => {
        try {
            if (!input.trim()) {
                setError('请输入 JSON 数据');
                return;
            }

            const parsed = JSON.parse(input);
            setStats(analyzeJson(parsed));

            let result = '';
            switch (action) {
                case 'format': result = JSON.stringify(parsed, null, indent); break;
                case 'minify': result = JSON.stringify(parsed); break;
                case 'sort': result = JSON.stringify(sortKeys(parsed), null, indent); break;
                case 'typescript': result = jsonToTypeScript(parsed); break;
                case 'java': result = jsonToJava(parsed); break;
                case 'escape': result = escapeJson(JSON.stringify(parsed, null, indent)); break;
                case 'unescape': result = unescapeJson(input); break;
            }

            setOutput(result);
            setError(null);
        } catch (err) {
            setError((err as Error).message);
            setOutput('');
            setStats(null);
        }
    };

    const copyToClipboard = () => {
        if (output) {
            navigator.clipboard.writeText(output);
            showToast('已复制到剪贴板');
        }
    };

    const clearAll = () => {
        setInput('');
        setOutput('');
        setError(null);
        setStats(null);
        setValidation({ valid: true });
    };

    const openFullscreen = () => {
        if (validation.valid && input.trim()) {
            try {
                const formatted = JSON.stringify(JSON.parse(input), null, 2);
                setOutput(formatted);
                setFullscreenMode(true);
            } catch (err) {
                showToast('请先输入有效的 JSON', 'error');
            }
        }
    };

    return (
        <>
            <div className="h-[calc(100vh-8rem)] flex flex-col gap-3">
                {/* 极简标题栏 */}
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">JSON 工具</h2>
                    <div className="flex gap-2 items-center text-sm">
                        {input && (
                            <div className="flex items-center gap-2">
                                {validation.valid ? (
                                    <div className="flex items-center gap-1 text-green-600">
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span>正确</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1 text-destructive">
                                        <XCircle className="w-4 h-4" />
                                        <span>错误{validation.line && ` 行${validation.line}`}</span>
                                    </div>
                                )}
                                {isLargeJson && (
                                    <div className="flex items-center gap-1 text-yellow-600">
                                        <AlertTriangle className="w-4 h-4" />
                                        <span>{lineCount.toLocaleString()}行</span>
                                    </div>
                                )}
                                {stats && (
                                    <span className="text-muted-foreground">
                                        对象{stats.objects} 数组{stats.arrays} 深度{stats.maxDepth}
                                    </span>
                                )}
                            </div>
                        )}
                        <select value={indent} onChange={(e) => setIndent(Number(e.target.value))} className="px-2 py-1 rounded border text-xs">
                            <option value={2}>2空格</option>
                            <option value={4}>4空格</option>
                            <option value={0}>Tab</option>
                        </select>
                        <Button variant="outline" size="sm" onClick={clearAll}>
                            <Trash2 className="w-3 h-3 mr-1" />
                            清空
                        </Button>
                    </div>
                </div>

                {/* 主要内容区域 - 左右分栏 */}
                <div className="grid grid-cols-2 gap-3 flex-1 min-h-0">
                    {/* 左侧：输入 */}
                    <div className="flex flex-col border rounded-lg overflow-hidden">
                        <div className="flex items-center justify-between px-3 py-1.5 bg-muted/30 border-b">
                            <span className="text-sm font-medium flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                输入
                            </span>
                            {/* 操作按钮 - 移到标题栏 */}
                            <div className="flex gap-2">
                                <Button onClick={() => processJson('format')} size="sm" disabled={!validation.valid} className="h-8 text-xs px-3">
                                    <AlignLeft className="w-3.5 h-3.5 mr-1.5" />
                                    格式化
                                </Button>
                                <Button onClick={() => processJson('minify')} variant="secondary" size="sm" disabled={!validation.valid} className="h-8 text-xs px-3">
                                    <Minimize2 className="w-3.5 h-3.5 mr-1.5" />
                                    压缩
                                </Button>
                                <Button onClick={() => processJson('sort')} variant="secondary" size="sm" disabled={!validation.valid} className="h-8 text-xs px-3">
                                    <ArrowUpDown className="w-3.5 h-3.5 mr-1.5" />
                                    排序
                                </Button>
                                <Button onClick={manualValidate} variant="outline" size="sm" className="h-8 text-xs px-3">
                                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                                    校验
                                </Button>
                                <Button onClick={() => processJson('typescript')} variant="outline" size="sm" disabled={!validation.valid} className="h-8 text-xs px-3">
                                    <Code2 className="w-3.5 h-3.5 mr-1.5" />
                                    TS
                                </Button>
                                <Button onClick={() => processJson('java')} variant="outline" size="sm" disabled={!validation.valid} className="h-8 text-xs px-3">
                                    <Code2 className="w-3.5 h-3.5 mr-1.5" />
                                    Java
                                </Button>
                                <Button onClick={() => processJson('escape')} variant="outline" size="sm" disabled={!validation.valid} className="h-8 text-xs px-3">
                                    <FileText className="w-3.5 h-3.5 mr-1.5" />
                                    转义
                                </Button>
                                <Button onClick={() => processJson('unescape')} variant="outline" size="sm" disabled={!validation.valid} className="h-8 text-xs px-3">
                                    <FileText className="w-3.5 h-3.5 mr-1.5" />
                                    反转义
                                </Button>
                            </div>
                        </div>
                        <div className="flex-1 flex overflow-hidden">
                            {lineCount <= 10000 && (
                                <div className="bg-muted/50 px-2 py-2 text-right font-mono text-xs text-muted-foreground select-none border-r overflow-y-auto min-w-[3rem]">
                                    {lineNumbers}
                                </div>
                            )}
                            <Textarea
                                className="flex-1 font-mono resize-none border-0 focus-visible:ring-0 rounded-none p-3 text-sm leading-relaxed"
                                placeholder='粘贴 JSON...'
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                style={{
                                    colorScheme: 'dark',
                                    tabSize: indent
                                }}
                            />
                        </div>
                    </div>

                    {/* 右侧：结果 */}
                    <div className="flex flex-col border rounded-lg overflow-hidden">
                        <div className="flex items-center justify-between px-3 py-2 bg-muted/30 border-b">
                            <span className="text-sm font-medium flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                结果
                            </span>
                            <div className="flex gap-1">
                                {output && (
                                    <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                                        <Copy className="w-3 h-3 mr-1" />复制
                                    </Button>
                                )}
                                <Button variant="ghost" size="sm" onClick={openFullscreen} disabled={!validation.valid || !input.trim()}>
                                    <Maximize2 className="w-3 h-3 mr-1" />全屏
                                </Button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-hidden relative">
                            {error ? (
                                <div className="absolute inset-0 p-3 bg-destructive/5 text-destructive font-mono text-sm whitespace-pre-wrap overflow-auto">
                                    <div className="flex items-center gap-2 font-bold mb-2">
                                        <XCircle className="w-4 h-4" />解析错误
                                    </div>
                                    {error}
                                </div>
                            ) : (
                                <Textarea
                                    className="h-full font-mono resize-none border-0 focus-visible:ring-0 rounded-none p-3 text-sm bg-muted/20"
                                    readOnly
                                    value={output}
                                    placeholder="结果将显示在这里..."
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {fullscreenMode && (
                <div className="fixed inset-0 bg-background z-50 flex flex-col">
                    <div className="flex items-center justify-between p-4 border-b">
                        <h3 className="text-lg font-semibold">JSON 全屏查看</h3>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={copyToClipboard}>
                                <Copy className="w-4 h-4 mr-2" />复制
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => setFullscreenMode(false)}>
                                <X className="w-4 h-4 mr-2" />关闭
                            </Button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-auto p-6">
                        <pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap break-words">
                            {output}
                        </pre>
                    </div>
                </div>
            )}
        </>
    );
}
