import { Link } from 'react-router-dom';
import { FileJson, Fingerprint, Clock, ArrowRight, Link as LinkIcon, FileCode, Hash, KeyRound, Regex, Palette, QrCode, KeySquare, FileText, FileEdit, BarChart3, ListFilter, FileSpreadsheet, Binary, Ruler, Clock3, Code2, Type, Info, Languages, Image, ScanLine, GitCompare } from 'lucide-react';

const toolCategories = [
    {
        id: 'common',
        name: '常用工具',
        icon: '🔧',
        description: '日常开发最常用的基础工具',
        tools: [
            { path: '/json', label: 'JSON 工具', icon: FileJson, desc: '格式化、验证和压缩 JSON 数据' },
            { path: '/json-diff', label: 'JSON 对比', icon: GitCompare, desc: '比较两个 JSON 对象的差异' },
            { path: '/uuid', label: 'UUID 生成器', icon: Fingerprint, desc: '批量生成 Version 4 UUID' },
            { path: '/time', label: '时间转换', icon: Clock, desc: '时间戳与日期相互转换' },
            { path: '/url', label: 'URL 编解码', icon: LinkIcon, desc: 'URL 编码/解码及参数解析' },
            { path: '/base64', label: 'Base64 转换', icon: FileCode, desc: '文本/文件与 Base64 互转' },
            { path: '/hash', label: '哈希生成', icon: Hash, desc: '计算 SHA-1, SHA-256 等哈希值' },
            { path: '/password', label: '密码生成', icon: KeyRound, desc: '生成高强度随机密码' },
            { path: '/regex', label: '正则测试', icon: Regex, desc: '实时测试正则表达式匹配' },
        ],
    },
    {
        id: 'text',
        name: '文本处理',
        icon: '📝',
        description: '文本编辑、对比、统计等处理工具',
        tools: [
            { path: '/diff', label: '文本对比', icon: FileText, desc: '逐行/逐词/逐字符对比差异' },
            { path: '/markdown', label: 'Markdown 编辑', icon: FileEdit, desc: '实时预览，导出 HTML' },
            { path: '/text-stats', label: '文本统计', icon: BarChart3, desc: '字数、行数、阅读时间统计' },
            { path: '/deduplicate', label: '文本去重', icon: ListFilter, desc: '删除重复行，保持顺序' },
        ],
    },
    {
        id: 'conversion',
        name: '数据转换',
        icon: '🔄',
        description: '各种数据格式和单位的转换工具',
        tools: [
            { path: '/csv-json', label: 'CSV/JSON', icon: FileSpreadsheet, desc: 'CSV 与 JSON 互转' },
            { path: '/base-converter', label: '进制转换', icon: Binary, desc: '二/八/十/十六进制互转' },
            { path: '/unit-converter', label: '单位换算', icon: Ruler, desc: '长度、重量、温度等换算' },
        ],
    },
    {
        id: 'developer',
        name: '开发工具',
        icon: '⚙️',
        description: '专为开发者设计的实用工具',
        tools: [
            { path: '/cron', label: 'Cron 表达式', icon: Clock3, desc: '可视化构建定时任务' },
            { path: '/html-entity', label: 'HTML 实体', icon: Code2, desc: 'HTML 字符实体编解码' },
            { path: '/case-converter', label: '命名风格', icon: Type, desc: 'camelCase/snake_case 互转' },
            { path: '/http-status', label: 'HTTP 状态码', icon: Info, desc: 'HTTP 响应状态码参考' },
            { path: '/unicode', label: 'Unicode', icon: Languages, desc: 'Unicode 与文本互转' },
            { path: '/jwt', label: 'JWT 解码', icon: KeySquare, desc: '解析 JWT Token 内容' },
        ],
    },
    {
        id: 'image',
        name: '图片工具',
        icon: '🖼️',
        description: '图片处理和二维码相关工具',
        tools: [
            { path: '/color', label: '颜色转换', icon: Palette, desc: 'HEX/RGB/HSL 格式互转' },
            { path: '/qr', label: '二维码生成', icon: QrCode, desc: '将文本/URL 转为二维码' },
            { path: '/image-base64', label: '图片转 Base64', icon: Image, desc: '图片文件转 Base64 编码' },
            { path: '/qr-scanner', label: '二维码识别', icon: ScanLine, desc: '上传图片识别二维码' },
        ],
    },
];

const totalTools = toolCategories.reduce((sum, cat) => sum + cat.tools.length, 0);

export function Home() {
    return (
        <div className="space-y-16 py-8">
            {/* Hero Section */}
            <div className="space-y-4 text-center max-w-2xl mx-auto animate-in fade-in">
                <div className="inline-flex items-center justify-center p-2 bg-muted rounded-full mb-4">
                    <span className="text-sm font-medium px-3 py-0.5">✨ 开发者必备工具箱</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent pb-2">
                    高效开发的得力助手
                </h1>
                <p className="text-xl text-muted-foreground">
                    集合了 {totalTools} 个日常开发中最常用的工具。快速、安全、纯前端运行，保护您的数据隐私。
                </p>
            </div>

            {/* Tool Categories */}
            {toolCategories.map((category, categoryIndex) => (
                <section key={category.id} id={category.id} className="scroll-mt-24">
                    {/* Category Header */}
                    <div className="mb-8 pb-4 border-b-2 border-primary/20">
                        <div className="flex items-center gap-4 mb-2">
                            <span className="text-4xl">{category.icon}</span>
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight">{category.name}</h2>
                                <p className="text-muted-foreground mt-1">{category.description}</p>
                            </div>
                        </div>
                    </div>

                    {/* Tools Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {category.tools.map((tool, index) => {
                            const Icon = tool.icon;
                            return (
                                <Link
                                    key={tool.path}
                                    to={tool.path}
                                    className="group relative overflow-hidden p-8 border rounded-2xl bg-card hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] animate-in scale-in"
                                    style={{ animationDelay: `${(categoryIndex * 100 + index * 50)}ms` }}
                                >
                                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-primary/5 rounded-full group-hover:bg-primary/10 transition-colors blur-2xl" />

                                    <div className="flex items-center justify-between mb-6 relative">
                                        <div className="p-4 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm group-hover:scale-110">
                                            <Icon className="w-8 h-8" />
                                        </div>
                                        <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3 tracking-tight">{tool.label}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{tool.desc}</p>
                                </Link>
                            );
                        })}
                    </div>
                </section>
            ))}
        </div>
    );
}

// Export categories for use in Layout
export { toolCategories };
