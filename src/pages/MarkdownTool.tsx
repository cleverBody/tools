import { useState } from 'react';
import { FileEdit, Copy, Download, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Textarea } from '../components/ui/Textarea';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useToast } from '../contexts/ToastContext';

export function MarkdownTool() {
    const [markdown, setMarkdown] = useState('# 欢迎使用 Markdown 编辑器\n\n## 功能特性\n\n- 实时预览\n- 支持 GFM (GitHub Flavored Markdown)\n- 导出 HTML\n\n### 代码示例\n\n```javascript\nconst greeting = "Hello, World!";\nconsole.log(greeting);\n```\n\n### 表格示例\n\n| 功能 | 状态 |\n|------|------|\n| 预览 | ✅ |\n| 导出 | ✅ |\n');
    const [showPreview, setShowPreview] = useState(true);
    const { showToast } = useToast();

    const copyMarkdown = () => {
        navigator.clipboard.writeText(markdown);
        showToast('已复制 Markdown');
    };

    const downloadMarkdown = () => {
        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.md';
        a.click();
        URL.revokeObjectURL(url);
        showToast('Markdown 已下载');
    };

    const exportHTML = () => {
        const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Markdown Export</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.6; }
        code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; }
        pre { background: #f4f4f4; padding: 16px; border-radius: 6px; overflow-x: auto; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f4f4f4; }
    </style>
</head>
<body>
${markdown}
</body>
</html>`;

        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.html';
        a.click();
        URL.revokeObjectURL(url);
        showToast('HTML 已导出');
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Markdown 编辑器</h2>
                    <p className="text-muted-foreground">实时预览 Markdown，支持 GFM 语法。</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowPreview(!showPreview)} size="sm">
                        {showPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                        {showPreview ? '隐藏预览' : '显示预览'}
                    </Button>
                    <Button variant="outline" onClick={copyMarkdown} size="sm">
                        <Copy className="w-4 h-4 mr-2" />
                        复制
                    </Button>
                    <Button variant="outline" onClick={downloadMarkdown} size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        下载 MD
                    </Button>
                    <Button onClick={exportHTML} size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        导出 HTML
                    </Button>
                </div>
            </div>

            <div className={`grid gap-6 ${showPreview ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
                <Card className="shadow-md">
                    <CardHeader className="bg-muted/30 border-b pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <FileEdit className="w-5 h-5" />
                            编辑器
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <Textarea
                            className="min-h-[500px] font-mono resize-y text-sm"
                            placeholder="输入 Markdown..."
                            value={markdown}
                            onChange={(e) => setMarkdown(e.target.value)}
                        />
                    </CardContent>
                </Card>

                {showPreview && (
                    <Card className="shadow-md">
                        <CardHeader className="bg-muted/30 border-b pb-4">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Eye className="w-5 h-5" />
                                预览
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="prose prose-sm dark:prose-invert max-w-none min-h-[500px] overflow-auto">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {markdown}
                                </ReactMarkdown>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
